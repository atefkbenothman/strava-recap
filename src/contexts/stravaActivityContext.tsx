import { useQuery } from "@tanstack/react-query"
import { createContext, useEffect, useMemo, useState } from "react"
import { stravaApi } from "../services/api"
import { ActivitiesByMonth, ActivitiesByType, ActivityData, Month, MONTHS, UnitDefinitions, Units } from "../types/activity"
import { SportType, StravaActivity, StravaAthleteZones, StravaPhoto } from "../types/strava"
import { useStravaAuthContext } from "../hooks/useStravaAuthContext"
import { useCurrentYearContext } from "../hooks/useCurrentYearContext"
import { useThemeContext } from "../hooks/useThemeContext"
import { generateColorPalette, storage } from "../utils/utils"
import * as Sentry from "@sentry/browser"
import { track } from '@vercel/analytics'


export const createEmptyMonthlyActivities = () => {
  return MONTHS.reduce((acc, month) => {
    acc[month] = []
    return acc
  }, {} as ActivitiesByMonth)
}


interface StravaActivityContextType {
  activitiesData: ActivityData
  activitiesLoading: boolean
  activitiesError: Error | null
  athleteZonesData: StravaAthleteZones | undefined
  athleteZonesLoading: boolean
  athleteZonesError: Error | null
  units: Units
  filters: SportType[]
  availableSports: SportType[]
  photosData: StravaPhoto[] | undefined
  photosLoading: boolean
  photosError: Error | null
  setUnits: (units: Units) => void
  setFilters: React.Dispatch<React.SetStateAction<SportType[]>>
}

export const StravaActivityContext = createContext<StravaActivityContextType>(
  {
    activitiesData: {
      all: [],
      byMonth: createEmptyMonthlyActivities(),
      byType: {}
    },
    activitiesLoading: false,
    activitiesError: null,
    athleteZonesData: undefined,
    athleteZonesLoading: false,
    athleteZonesError: null,
    units: "imperial",
    filters: [],
    availableSports: [],
    photosData: undefined,
    photosLoading: false,
    photosError: null,
    setUnits: () => { },
    setFilters: () => { }
  }
)


export const processActivities = (allActivities: StravaActivity[], filters: SportType[]) => {
  const activitiesByMonth: ActivitiesByMonth = createEmptyMonthlyActivities()
  const activitiesByType: ActivitiesByType = {}
  const activitiesWithPhotos: StravaActivity[] = []
  const allSports: Set<SportType> = new Set()

  const filteredActivities = allActivities.reduce((acc, act) => {
    if (!act.sport_type || !act.start_date || isNaN(new Date(act.start_date).getTime())) {
      console.warn("Skipping activity with missing/invalid sport_type or start_date: ", act)
      Sentry.captureException("Skipping activity with missing/invalid sport_type or start_date")
      return acc
    }
    const sportType = act.sport_type as SportType

    allSports.add(sportType)

    if (filters.length > 0 && !filters.includes(act.sport_type as SportType)) {
      return acc
    }

    // add to sport type
    if (!activitiesByType[sportType]) {
      activitiesByType[sportType] = [act]
    } else {
      activitiesByType[sportType].push(act)
    }

    // add to month
    const activityMonth = new Date(act.start_date).toLocaleString("default", { month: "long" }) as Month
    activitiesByMonth[activityMonth].push(act)

    // add to photo
    if (act.total_photo_count && act.total_photo_count > 0) {
      activitiesWithPhotos.push(act)
    }

    acc.push(act)
    return acc
  }, [] as StravaActivity[])

  return {
    all: filteredActivities,
    allSports: Array.from(allSports),
    byMonth: activitiesByMonth,
    byType: activitiesByType,
    withPhotos: activitiesWithPhotos
  }
}


export default function StravaActivityContextProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, accessToken } = useStravaAuthContext()
  const { currentYear } = useCurrentYearContext()
  const { theme, colorPalette, setColorPalette } = useThemeContext()

  const storedUnits = storage.get("units", "imperial" as Units)
  const [units, setUnits] = useState<Units>(
    Object.keys(UnitDefinitions).includes(storedUnits as string)
      ? storedUnits as Units
      : "metric"
  )
  const [filters, setFilters] = useState<SportType[]>([])
  const [availableSports, setAvailableSports] = useState<SportType[]>([])
  const [activityPhoto, setActivityPhoto] = useState<StravaActivity | undefined>()

  const {
    data: allActivityData,
    isLoading: activitiesLoading,
    error: activitiesError
  } = useQuery({
    queryKey: [currentYear],
    queryFn: () => stravaApi.getAllActivities(accessToken!, currentYear),
    enabled: isAuthenticated && !!accessToken,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: false,
  })

  const {
    data: athleteZonesData,
    isLoading: athleteZonesLoading,
    error: athleteZonesError,
  } = useQuery({
    queryKey: ["athleteZones"],
    queryFn: () => stravaApi.getAthleteZones(accessToken!),
    enabled: isAuthenticated && !!accessToken,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: false
  })

  const {
    data: photosData,
    isLoading: photosLoading,
    error: photosError
  } = useQuery({
    queryKey: ["activityPhotos", activityPhoto],
    queryFn: () => stravaApi.getActivityPhotos(accessToken!, activityPhoto!.id),
    enabled: isAuthenticated && !!accessToken && !!activityPhoto,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: false,
  })

  const activitiesData = useMemo(() => {
    if (!allActivityData || allActivityData.length === 0) {
      return {
        all: [],
        byMonth: createEmptyMonthlyActivities(),
        byType: {}
      } as ActivityData
    }
    try {
      const { all, byMonth, byType, withPhotos, allSports } = processActivities(allActivityData, filters)
      setAvailableSports(allSports)
      if (withPhotos.length > 0) {
        const actWithPhoto = withPhotos[Math.floor(Math.random() * withPhotos.length)]
        setActivityPhoto(actWithPhoto)
      }
      // only track initial processing
      if (filters.length === 0) {
        track("successfully processed activities", {
          currentYear: currentYear,
          numActivities: all.length,
          numSports: allSports.length
        })
      }
      return { all, byMonth, byType }
    } catch (err) {
      console.warn("Error processing activities data")
      Sentry.captureException(err)
      return {
        all: [],
        byMonth: createEmptyMonthlyActivities(),
        byType: {}
      } as ActivityData
    }
  }, [allActivityData, filters])

  useEffect(() => {
    if (Object.keys(activitiesData.byType).length === 0) {
      return
    }
    const sportTypes = Object.keys(activitiesData.byType) as SportType[]
    setColorPalette(generateColorPalette(sportTypes, theme, colorPalette, false))
  }, [activitiesData])

  useEffect(() => {
    if (Object.keys(activitiesData.byType).length === 0) {
      return
    }
    try {
      const sportTypes = Object.keys(activitiesData.byType) as SportType[]
      setColorPalette(generateColorPalette(sportTypes, theme, colorPalette, true))
    } catch (err) {
      console.warn("Error setting color palette")
      Sentry.captureException(err)
    }
  }, [theme])

  useEffect(() => {
    setFilters([])
  }, [currentYear])

  const updateUnits = (unit: Units) => {
    setUnits(unit)
    storage.set<string>("units", unit)
    track("changed unit", {
      unit: unit
    })
  }

  return (
    <StravaActivityContext.Provider
      value={{
        activitiesData,
        activitiesLoading,
        activitiesError,
        athleteZonesData,
        athleteZonesLoading,
        athleteZonesError,
        units,
        filters,
        availableSports,
        photosData,
        photosLoading,
        photosError,
        setUnits: updateUnits,
        setFilters
      }}
    >
      {children}
    </StravaActivityContext.Provider>
  )

}