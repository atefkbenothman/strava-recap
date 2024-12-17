import { useContext } from "react"
import { StravaActivityContext } from "../contexts/stravaActivityContext"

export const useStravaActivityContext = () => {
  const context = useContext(StravaActivityContext)
  if (!context) {
    throw new Error("useStravaActivity must be used within a provider")
  }
  return context
}