import { createContext } from "react"
import { StravaActivity, StravaAthlete } from "../types/strava"


interface RecapContextType {
  athlete: StravaAthlete | null
  activities: StravaActivity[]
  currentYear: number | null
}

export const RecapContext = createContext<RecapContextType>({ athlete: null, activities: [], currentYear: null })