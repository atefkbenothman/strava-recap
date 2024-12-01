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
  const { isAuthenticated, accessToken, athlete, login, logout } = useStravaAuth()

  const [activities, setActivities] = useState<StravaActivity[]>([])
  const [currentYear, setCurrentYear] = useState<number>(Number(window.location.pathname.split("/")[1]) || 0)

  const { data, isLoading, error } = useQuery({
    queryKey: [currentYear],
    queryFn: () => stravaApi.getAllActivities(accessToken!, currentYear),
    enabled: isAuthenticated,
    retry: false
  })

  useEffect(() => {
    if (data) {
      setActivities(data)
    }
  }, [data])

  useEffect(() => {
    if (window.location.pathname === "/") {
      const year = new Date().getFullYear()
      updateYear(year)
    }
  }, [])

  function updateYear(year: number) {
    setCurrentYear(year)
    window.history.pushState({}, "", `/${year}`)
  }

  const COLORS = {
    "purple_dark": "#40407a",
    "purple_light": "#40407a",
    "tan": "#f7f1e3",
  }

  if (!isAuthenticated) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-semibold">Strava {currentYear} Recap</p>
          <img
            className="hover:cursor-pointer"
            width={160}
            src={connectWithStravaLogo}
            alt="login with strava"
            onClick={() => login(currentYear)}
          />
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 text-lg">
          <p>Retrieving <span className="font-bold text-xl">{currentYear}</span> activities...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 text-lg mx-[30%]">
          <div className="flex gap-2">
            <p className="text-red-500 font-bold">Error: </p>
            <p>{error.message}</p>
          </div>
          <p className="text-blue-500 underline hover:cursor-pointer w-fit" onClick={logout}>Reauthorize</p>
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    const thisYear = new Date().getFullYear()
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col gap-4 text-lg">
          <p>No activities from <span className="font-bold text-xl">{currentYear}</span></p>
          <a className="underline text-left hover:cursor-pointer w-fit text-blue-500" onClick={() => updateYear(new Date().getFullYear())}>Go to {thisYear}</a>
        </div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen">
      <RecapContext.Provider value={{ isAuthenticated, athlete, activities, currentYear, logout }}>
        <Dashboard />
      </RecapContext.Provider>
    </div>
  )
}

export default App
