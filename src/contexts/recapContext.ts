import { createContext } from "react"
import { StravaAthlete } from "../types/strava"
import { ActivityData, Units } from "../types/activity"
import { Theme, ThemeName } from "../themes/theme"


interface RecapContextType {
  isAuthenticated: boolean
  currentYear: number | null
  athlete: StravaAthlete | null
  activityData: ActivityData
  colorPalette: Record<string, string>
  theme: typeof Theme[ThemeName]
  units: Units
  setUnits: (units: Units) => void
  setThemeName: (theme: ThemeName) => void
  updateYear: (year: number) => void
  logout: () => void
}

export const RecapContext = createContext<RecapContextType>(
  {
    isAuthenticated: false,
    currentYear: null,
    athlete: null,
    activityData: {},
    colorPalette: {},
    theme: Theme["emerald"],
    units: "imperial",
    setUnits: () => { },
    setThemeName: () => { },
    updateYear: () => { },
    logout: () => { }
  }
)