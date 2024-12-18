import { createContext, useState } from "react"
import { SportType } from "../types/strava"

export type ColorPalette = {
  [key in SportType]?: string
}

export const Themes = {
  Default: ["#06d6a0", "#20aaa1", "#198190", "#0e5d72", "#073b4c"],
  Sunset: ["#0055FFFF", "#3399FFFF", "#66CCFFFF", "#99EEFFFF", "#CCFFFFFF", "#FFFFCCFF", "#FFEE99FF", "#FFCC66FF", "#FF9933FF", "#FF5500FF"],
  Red: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"],
  Ocean: ["#235D72FF", "#3A7C89FF", "#559C9EFF", "#7BBCB0FF", "#A5DBC2FF", "#D2FBD4FF"],
  Orange: ["#990000", "#d7301f", "#ef6548", "#fc8d59", "#fdbb84", "#fdd49e"],
  // Blue: ["#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494"],
  // Light: ["#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"],
  // Test: ["#fc4c02", "#ff0030", "#ff0054", "#ff007b", "#e500a7", "#b200d3", "#3c02fc"],
  // New: ["#ffd700", "#ffb14e", "#fa8775", "#ea5f94", "#cd34b5", "#9d02d7", "#0000ff"],
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
  const [theme, setTheme] = useState<Theme>(localStorage.getItem("theme") as Theme || "Default")
  const [darkMode, setDarkMode] = useState<boolean>(JSON.parse(localStorage.getItem("dark") || "true"))
  const [colorPalette, setColorPalette] = useState<ColorPalette>({})

  const toggleDarkMode = (mode: boolean) => {
    localStorage.setItem("dark", JSON.stringify(mode))
    setDarkMode(mode)
  }

  const updateTheme = (newTheme: Theme) => {
    localStorage.setItem("theme", newTheme)
    setTheme(newTheme)
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
