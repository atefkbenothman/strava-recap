import { createContext } from "react"
import { StravaAthlete, SportType } from "../types/strava"
import { ActivityData, Units } from "../types/activity"
import { Theme, ThemeName } from "../themes/theme"


interface AuthContextType {
  isAuthenticated: boolean
  athlete: StravaAthlete | null
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>(
  {
    isAuthenticated: false,
    athlete: null,
    logout: () => { }
  }
)

interface ActivityDataContextType {
  currentYear: number | null
  activityData: ActivityData
  units: Units
  filter: SportType | "All"
  updateYear: (year: number) => void
  setUnits: (units: Units) => void
  setFilter: (filter: SportType | "All") => void
}

export const ActivityDataContext = createContext<ActivityDataContextType>(
  {
    currentYear: null,
    activityData: {},
    units: "imperial",
    filter: "All",
    updateYear: () => { },
    setUnits: () => { },
    setFilter: () => { }
  }
)

interface ThemeContextType {
  themeName: ThemeName
  theme: typeof Theme[ThemeName]
  colorPalette: Record<string, string>
  setThemeName: (theme: ThemeName) => void
}

export const ThemeContext = createContext<ThemeContextType>(
  {
    themeName: "Default",
    theme: Theme["Default"],
    colorPalette: {},
    setThemeName: () => { }
  }
)

interface DialogContextType {
  dialogOpen: boolean
  setDialogOpen: (status: boolean) => void
}

export const DialogContext = createContext<DialogContextType>(
  {
    dialogOpen: false,
    setDialogOpen: () => { }
  }
)