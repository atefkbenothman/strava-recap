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
  filter: SportType | "All"
  photosData: StravaPhoto[] | undefined
  photosLoading: boolean
  photosError: Error | null
  setUnits: (units: Units) => void
  setFilter: (filter: SportType | "All") => void
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
    filter: "All",
    photosData: undefined,
    photosLoading: false,
    photosError: null,
    setUnits: () => { },
    setFilter: () => { }
  }
)


export const processActivities = (allActivities: StravaActivity[], filter: SportType | "All") => {
  const activitiesByMonth: ActivitiesByMonth = createEmptyMonthlyActivities()
  const activitiesByType: ActivitiesByType = {}
  const activitiesWithPhotos: StravaActivity[] = []

  const filteredActivities = allActivities.reduce((acc, act) => {
    if (!act.sport_type || !act.start_date || isNaN(new Date(act.start_date).getTime())) {
      console.warn("Skipping activity with missing sport_type or start_date: ", act)
      Sentry.captureException("Skipping activity with missing sport_type or start_date")
      return acc
    }
    if (filter !== "All" && act.sport_type !== filter) {
      return acc
    }

    // add to sport type
    const sportType = act.sport_type as SportType
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
  const [filter, setFilter] = useState<SportType | "All">("All")
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
      const { all, byMonth, byType, withPhotos } = processActivities(allActivityData, filter)
      setColorPalette(generateColorPalette(Object.keys(byType) as SportType[], theme, colorPalette, false))
      if (withPhotos.length > 0) {
        const actWithPhoto = withPhotos[Math.floor(Math.random() * withPhotos.length)]
        setActivityPhoto(actWithPhoto)
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
  }, [allActivityData, filter])

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

  const updateUnits = (unit: Units) => {
    setUnits(unit)
    storage.set<string>("units", unit)
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
        filter,
        photosData,
        photosLoading,
        photosError,
        setUnits: updateUnits,
        setFilter
      }}
    >
      {children}
    </StravaActivityContext.Provider>
  )

}