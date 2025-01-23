import { createContext, useState } from "react"
import { SportType } from "../types/strava"
import { storage } from "../utils/utils"
import { track } from '@vercel/analytics'

export type ColorPalette = {
  [key in SportType]?: string
}

export const Themes = {
  Default: ["#06d6a0", "#20aaa1", "#198190", "#0e5d72", "#073b4c", "#456c78", "#739099", "#96abb2", "#b1c0c5", "#c4d0d3", "#d6dfe1", "#e0e7e8", "#e8edee"],
  Sky: ["#0055ff", "#3399ff", "#66ccff", "#99eeff", "#ccffff", "#ffffcc", "#ffee99", "#ffcc66", "#ff9933", "#ff5500", "#ff7f3f", "#ffa06e", "#ffb892"],
  Crimson: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#486cb0", "#5e4fa2", "#867bb9"],
  Lagoon: ["#18404e", "#1d4d5e", "#235d72", "#327181", "#3a7C89", "#559C9e", "#7BBcb0", "#9bd4be", "#a5dbc2", "#d2fbd4", "#e0fbe2", "#eafbeb", "#f1fbf1"],
  Ember: ["#690000", "#990000", "#b81810", "#d7301f", "#ef6548", "#bd6943", "#dd7b4e", "#fc8d59", "#fdbb84", "#fdd49e", "#fde2bd", "#fdebd2", "#fdf1e0"],
  Forest: ["#08302e", "#06413a", "#03594a", "#007b5e", "#03a071", "#15c182", "#28f699", "#65ffab", "#9effc5", "#cafcdc"],
  Lilac: ["#1e1c4a", "#24216b", "#35319d", "#4e49e2", "#666cee", "#8391f6", "#a7b7fa", "#c8d4fd", "#e1e8fe", "#eef2ff"],
  Amber: ["#fc6d11", "#f45616", "#eb3f1b", "#bc3b25", "#2d2e40", "#3d3144", "#4c3348", "#69223b", "#771a35", "#85112e"]
} as const

export type Theme = keyof typeof Themes

type ThemeContextType = {
  theme: Theme
  themeColors: readonly string[]
  darkMode: boolean
  colorPalette: ColorPalette
  setDarkMode: (mode: boolean) => void
  updateTheme: (theme: Theme) => void
  setColorPalette: (newColorPalette: ColorPalette) => void
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "Default",
  themeColors: Themes["Default"],
  darkMode: true,
  colorPalette: {},
  updateTheme: () => { },
  setDarkMode: () => { },
  setColorPalette: () => { }
})

type ThemeContextProviderProps = {
  children: React.ReactNode
}

export default function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  const storedTheme = storage.get("theme", "Default" as Theme)
  const [theme, setTheme] = useState<Theme>(
    Object.keys(Themes).includes(storedTheme as string)
      ? storedTheme as Theme
      : "Default"
  )
  const [darkMode, setDarkMode] = useState<boolean>(storage.get("dark", "true") === "true")
  const [colorPalette, setColorPalette] = useState<ColorPalette>({})

  const toggleDarkMode = (mode: boolean) => {
    setDarkMode(mode)
    storage.set<string>("dark", String(mode))
    track("changed darkmode", {
      mode: mode
    })
  }

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    storage.set<string>("theme", newTheme)
    track("changed theme", {
      theme: newTheme
    })
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeColors: Themes[theme],
        darkMode,
        colorPalette,
        updateTheme,
        setDarkMode: toggleDarkMode,
        setColorPalette
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
