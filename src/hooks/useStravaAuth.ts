import { useState, useEffect, useCallback } from "react"
import { stravaApi } from "../services/api"
import { StravaAthlete } from "../types/strava"

interface StravaAuthHook {
  isAuthenticated: boolean
  accessToken: string | null
  athlete: StravaAthlete | null
  login: (year: number) => void
  logout: () => void
}

export const useStravaAuth = (): StravaAuthHook => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("strava_access_token"))
  const [athlete, setAthlete] = useState<StravaAthlete | null>(
    localStorage.getItem("athlete") ? JSON.parse(localStorage.getItem("athlete") || "") : null
  )
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!accessToken)

  const login = useCallback((year: number) => {
    stravaApi.updateRedirectUri(year)
    const authUrl = stravaApi.generateAuthUrl()
    window.location.href = authUrl
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("strava_access_token")
    setAccessToken(null)
    setIsAuthenticated(false)
    window.location.reload()
  }, [])

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get("code")
      if (code) {
        const data = await stravaApi.exchangeToken(code)
        if (data) {
          const { accessToken: token, athlete: user } = data
          localStorage.setItem("strava_access_token", token)
          localStorage.setItem("athlete", JSON.stringify(user))
          setAccessToken(token)
          setAthlete(user)
          setIsAuthenticated(true)
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      }
    }
    handleAuthRedirect()
  }, [])

  return { isAuthenticated, accessToken, athlete, login, logout }
}