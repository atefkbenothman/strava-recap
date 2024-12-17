import { createContext, useCallback, useEffect, useState } from "react"
import { StravaAthlete } from "../types/strava"
import { stravaApi } from "../services/api"
import { useQuery } from "@tanstack/react-query"

interface StravaAuthContextType {
  isAuthenticated: boolean
  accessToken: string | null
  athlete: StravaAthlete | null
  login: (year: number) => void
  logout: () => void
  updateStravaAthlete: (athlete: StravaAthlete) => void
}

export const StravaAuthContext = createContext<StravaAuthContextType>(
  {
    isAuthenticated: false,
    accessToken: null,
    athlete: null,
    login: () => { },
    logout: () => { },
    updateStravaAthlete: () => { }
  }
)

type StravaAuthContextProviderProps = {
  children: React.ReactNode
}

export default function StravaAuthContextProvider({ children }: StravaAuthContextProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("strava_access_token"))
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!accessToken)
  const [athlete, setAthlete] = useState<StravaAthlete | null>(localStorage.getItem("athlete") ? JSON.parse(localStorage.getItem("athlete") || "") : null)

  const {
    data: athleteData
  } = useQuery({
    queryKey: ["stravaAthlete"],
    queryFn: () => stravaApi.getAthlete(accessToken!),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: false
  })

  useEffect(() => {
    if (athleteData) {
      updateStravaAthlete(athleteData)
    }
  }, [athleteData])

  const login = useCallback((year: number) => {
    stravaApi.updateRedirectUri(year)
    window.location.href = stravaApi.generateAuthUrl()
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("strava_access_token")
    localStorage.removeItem("athlete")
    setAccessToken(null)
    setAthlete(null)
    setIsAuthenticated(false)
  }, [])

  const updateStravaAthlete = useCallback((athlete: StravaAthlete) => {
    setAthlete(athlete)
    localStorage.setItem("athlete", JSON.stringify(athlete))
  }, [])

  // handle code retrieval and token exchange after authenticating
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

  return (
    <StravaAuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        athlete,
        login,
        logout,
        updateStravaAthlete
      }}
    >
      {children}
    </StravaAuthContext.Provider>
  )
}
