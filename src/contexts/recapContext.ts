import { createContext } from "react"
import { StravaActivity, StravaAthlete } from "../types/strava"


interface RecapContextType {
  isAuthenticated: boolean
  athlete: StravaAthlete | null
  activities: StravaActivity[]
  currentYear: number | null
  logout: () => void
}

export const RecapContext = createContext<RecapContextType>({ isAuthenticated: false, athlete: null, activities: [], currentYear: null, logout: () => { } })