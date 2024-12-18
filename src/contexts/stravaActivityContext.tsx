import { useQuery } from "@tanstack/react-query"
import { createContext, useEffect, useMemo, useState } from "react"
import { stravaApi } from "../services/api"
import { ActivitiesByType, ActivityData, MonthlyActivities, Months, Units } from "../types/activity"
import { SportType, StravaAthleteZones } from "../types/strava"
import { useStravaAuthContext } from "../hooks/useStravaAuthContext"
import { useCurrentYearContext } from "../hooks/useCurrentYearContext"
import { useThemeContext } from "../hooks/useThemeContext"
import { generateColorPalette } from "../utils/utils"

interface StravaActivityContextType {
  isLoading: boolean
  error: Error | null
  activityData: ActivityData
  athleteZones: StravaAthleteZones
  units: Units
  filter: SportType | "All"
  setUnits: (units: Units) => void
  setFilter: (filter: SportType | "All") => void
}

export const StravaActivityContext = createContext<StravaActivityContextType>(
  {
    isLoading: false,
    error: null,
    activityData: {},
    athleteZones: {},
    units: "imperial",
    filter: "All",
    setUnits: () => { },
    setFilter: () => { }
  }
)

type StravaActivityContextProvider = {
  children: React.ReactNode
}

export default function StravaActivityContextProvider({ children }: StravaActivityContextProvider) {
  const { isAuthenticated, accessToken } = useStravaAuthContext()
  const { currentYear } = useCurrentYearContext()
  const { theme, colorPalette, setColorPalette } = useThemeContext()

  const [units, setUnits] = useState<Units>(localStorage.getItem("units") as Units || "imperial")
  const [filter, setFilter] = useState<SportType | "All">("All")

  const {
    data: activities,
    isLoading,
    error
  } = useQuery({
    queryKey: [currentYear],
    queryFn: () => stravaApi.getAllActivities(accessToken!, currentYear),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: false
  })

  const {
    data: athleteZones
  } = useQuery({
    queryKey: ["athleteZones"],
    queryFn: () => stravaApi.getAthleteZones(accessToken!),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: false
  })

  console.log(athleteZones)

  const updateSportColors = (sportTypes: SportType[], reset: boolean = false) => {
    setColorPalette(generateColorPalette(Array.from(sportTypes), theme, colorPalette, reset))
  }

  // process activities
  const activityData = useMemo(() => {
    if (!activities) return {} as ActivityData

    const sportTypes: Set<SportType> = new Set()
    const activitiesByMonth: MonthlyActivities = {}
    const activitiesByType: ActivitiesByType = {}

    Months.forEach(month => {
      activitiesByMonth[month] = []
    })

    // filter activities based on filter
    const filteredActivities = filter === "All"
      ? activities
      : activities.filter((act) => act.sport_type! === filter)

    filteredActivities.forEach(activity => {
      const sportType = activity.sport_type! as SportType
      const activityMonth = new Date(activity.start_date!).toLocaleString("default", { month: "long" })
      if (!activitiesByType[sportType]) {
        activitiesByType[sportType] = []
      }
      activitiesByMonth[activityMonth]?.push(activity)
      activitiesByType[sportType].push(activity)
      sportTypes.add(sportType)
    })

    updateSportColors(Array.from(sportTypes), false)

    return {
      all: filteredActivities,
      monthly: activitiesByMonth,
      bySportType: activitiesByType
    }
  }, [activities, filter])

  useEffect(() => {
    if (!activityData || !activityData.all || activityData!.all!.length === 0) { return }
    const sportTypes = Array.from(new Set(activityData.all!.map(a => a.sport_type! as SportType)))
    updateSportColors(sportTypes, true)
  }, [theme])

  const updateUnits = (unit: Units) => {
    localStorage.setItem("units", unit)
    setUnits(unit)
  }

  return (
    <StravaActivityContext.Provider
      value={{
        isLoading,
        error,
        activityData,
        athleteZones,
        units,
        filter,
        setUnits: updateUnits,
        setFilter
      }}
    >
      {children}
    </StravaActivityContext.Provider>
  )

}