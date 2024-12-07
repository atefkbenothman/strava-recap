import { createContext } from "react"
import { StravaAthlete } from "../types/strava"
import { ActivityData } from "../types/activity"
import { THEME, ThemeKey } from "../themes/themeConfig"


interface RecapContextType {
  isAuthenticated: boolean
  currentYear: number | null
  athlete: StravaAthlete | null
  activityData: ActivityData
  colorPalette: Record<string, string>
  theme: typeof THEME[ThemeKey]
  setThemeKey: (theme: ThemeKey) => void
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
    theme: THEME["emerald"],
    setThemeKey: () => { },
    updateYear: () => { },
    logout: () => { }
  }
)