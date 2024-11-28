import { createContext } from "react"
import { StravaActivity } from "../types/strava"


interface RecapContextType {
  activities: StravaActivity[]
  isLoading: boolean
}

export const RecapContext = createContext<RecapContextType>({ activities: [], isLoading: false })