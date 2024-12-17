import { useContext } from "react"
import { ThemeContext } from "../contexts/themeContext"

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useThemeContext must be used within a provider")
  }
  return context
}