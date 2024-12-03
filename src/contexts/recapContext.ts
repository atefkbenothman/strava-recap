import { createContext } from "react"
import { StravaActivity, StravaAthlete } from "../types/strava"
import { THEME, ThemeKey } from "../themes/themeConfig"


interface RecapContextType {
  isAuthenticated: boolean
  currentYear: number | null
  athlete: StravaAthlete | null
  activities: StravaActivity[]
  colorPalette: Record<string, string>
  theme: typeof THEME[ThemeKey]
  updateYear: (year: number) => void
  logout: () => void
}

export const RecapContext = createContext<RecapContextType>(
  {
    isAuthenticated: false,
    athlete: null,
    activities: [],
    currentYear: null,
    colorPalette: {},
    theme: THEME["emerald"],
    updateYear: () => { },
    logout: () => { }
  }
)