import { useContext } from "react"
import { CurrentYearContext } from "../contexts/currentYearContext"

export const useCurrentYearContext = () => {
  const context = useContext(CurrentYearContext)
  if (!context) {
    throw new Error("useCurrentYearContext must be used within a provider")
  }
  return context
}