import { useState, useEffect, useCallback } from "react"
import { stravaApi } from "../services/api"

interface StravaAuthHook {
  isAuthenticated: boolean
  accessToken: string | null
  login: () => void
  logout: () => void
}

export const useStravaAuth = (): StravaAuthHook => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("strava_access_token"))
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!accessToken)
  const login = useCallback(() => {
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
        const token = await stravaApi.exchangeToken(code)
        if (token) {
          localStorage.setItem("strava_access_token", token)
          setAccessToken(token)
          setIsAuthenticated(true)
        }
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
    handleAuthRedirect()
  }, [])
  return { isAuthenticated, accessToken, login, logout }
}