import { createContext, useState } from "react"
import { SportType } from "../types/strava"

export type ColorPalette = {
  [key in SportType]?: string
}

export const Themes = {
  Default: ["#06d6a0", "#20aaa1", "#198190", "#0e5d72", "#073b4c", "#456C78", "#739099", "#96ABB2", "#B1C0C5", "#C4D0D3", "#D6DFE1", "#E0E7E8", "#E8EDEE"],
  Sunset: ["#0055ff", "#3399ff", "#66ccff", "#99eeff", "#ccffff", "#ffffcc", "#ffee99", "#ffcc66", "#ff9933", "#ff5500", "#ff7f3f", "#ffa06e", "#ffb892"],
  Red: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#486cb0", "#5e4fa2", "#867bb9"],
  Ocean: ["#18404e", "#1d4d5e", "#235d72", "#327181", "#3a7C89", "#559C9e", "#7BBcb0", "#9bd4be", "#a5dbc2", "#d2fbd4", "#e0fbe2", "#eafbeb", "#f1fbf1"],
  Orange: ["#690000", "#990000", "#b81810", "#d7301f", "#ef6548", "#bd6943", "#dd7b4e", "#fc8d59", "#fdbb84", "#fdd49e", "#fde2bd", "#fdebd2", "#fdf1e0"],
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
  const storedTheme = localStorage.getItem("theme")

  const [theme, setTheme] = useState<Theme>(
    Object.keys(Themes).includes(storedTheme as string)
      ? storedTheme as Theme
      : "Default"
  )
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
