import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"

import { useStravaAuth } from "./hooks/useStravaAuth"
import { stravaApi } from "./services/api"
import { StravaActivity } from "./types/strava"
import { RecapContext } from "./contexts/recapContext"

import Dashboard from "./components/dashboard"

import connectWithStravaLogo from "/connect-with-strava.svg"

import "./App.css"


function App() {
  const { isAuthenticated, accessToken, login, logout } = useStravaAuth()

  const [activities, setActivities] = useState<StravaActivity[]>([])

  const { data, isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: () => stravaApi.getActivities(accessToken!),
    enabled: isAuthenticated
  })

  useEffect(() => {
    if (data) {
      setActivities(data)
    }
  }, [data])

  return (
    <div className="w-screen h-screen">
      {isAuthenticated ? (
        <RecapContext.Provider value={{ activities, isLoading }}>
          <Dashboard />
        </RecapContext.Provider>
      ) : (
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col w-full h-full items-center justify-center">
            <div className="flex flex-col gap-2">
              <p className="text-2xl font-semibold">Strava Recap</p>
              <img
                className="hover:cursor-pointer"
                width={160}
                src={connectWithStravaLogo}
                alt="login with strava"
                onClick={login}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App