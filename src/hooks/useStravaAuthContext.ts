import { useContext } from "react"
import { StravaAuthContext } from "../contexts/stravaAuthContext"

export const useStravaAuthContext = () => {
  const context = useContext(StravaAuthContext)
  if (!context) {
    throw new Error("useStravaAuthContext must be used within a provider")
  }
  return context
}