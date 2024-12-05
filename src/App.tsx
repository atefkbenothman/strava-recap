import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"

import { useStravaAuth } from "./hooks/useStravaAuth"
import { stravaApi } from "./services/api"
import { StravaActivity, SportType } from "./types/strava"
import { ActivitiesByType, ActivityData, MonthlyActivities, Months } from "./types/activity"
import { RecapContext } from "./contexts/recapContext"
import { THEME, ThemeKey } from "./themes/themeConfig"

import Dashboard from "./components/dashboard"

import connectWithStravaLogo from "/connect-with-strava.svg"

import "./App.css"


function App() {
  const { isAuthenticated, accessToken, athlete, login, logout } = useStravaAuth()

  const [activityData, setActivityData] = useState<ActivityData>({})
  const [currentYear, setCurrentYear] = useState<number>(Number(window.location.pathname.split("/")[1]) || 0)
  const [themeKey, setThemeKey] = useState<ThemeKey>("emerald")
  const [colorPalette, setColorPalette] = useState<Record<string, string>>({})

  const { data, isLoading, error } = useQuery({
    queryKey: [currentYear],
    queryFn: () => stravaApi.getAllActivities(accessToken!, currentYear),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: false
  })

  useEffect(() => {
    if (data) {
      const activitiesByMonth: MonthlyActivities = {}
      Months.reduce((acc: MonthlyActivities, month: string) => {
        acc[month] = []
        return acc
      }, activitiesByMonth)
      const activitiesByType: ActivitiesByType = {}
      data.forEach(activity => {
        const sportType = activity.sport_type! as SportType
        const activityMonth = new Date(activity.start_date!).toLocaleString("default", { month: "long" })
        if (!activitiesByType[sportType]) {
          activitiesByType[sportType] = []
        }
        activitiesByMonth[activityMonth]?.push(activity)
        activitiesByType[sportType].push(activity)
      })
      setActivityData({ all: data, monthly: activitiesByMonth, bySportType: activitiesByType })
      generateColorPalette(data, themeKey)
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


  function generateColorPalette(activities: StravaActivity[], themeKey: ThemeKey) {
    const uniqueActivityTypes = [...new Set(
      activities.map(activity => activity.sport_type!)
    )]
    const colors = THEME[themeKey].colors;
    const colorPallete = uniqueActivityTypes.reduce((palette: Record<string, string>, sportType, index) => {
      const chosenColor = colors[index % colors.length]
      palette[sportType] = chosenColor
      return palette
    }, {})
    setColorPalette(colorPallete)
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
    const thisYear = new Date().getFullYear()
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 text-lg mx-[30%]">
          <div className="flex gap-2">
            <p className="text-red-500 font-bold">Error: </p>
            <p>{error.message}</p>
          </div>
          <div className="flex gap-6">
            <p className="text-blue-500 underline hover:cursor-pointer w-fit" onClick={logout}>Reauthenticate</p>
            <p>or</p>
            <a className="underline text-left hover:cursor-pointer w-fit text-blue-500" onClick={() => updateYear(thisYear)}>Go to {thisYear}</a>
          </div>
        </div>
      </div>
    )
  }

  if (Object.keys(activityData).length === 0) {
    const thisYear = new Date().getFullYear()
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col gap-4 text-lg">
          <p>No activities from <span className="font-bold text-xl">{currentYear}</span></p>
          <a className="underline text-left hover:cursor-pointer w-fit text-blue-500" onClick={() => updateYear(thisYear)}>Go to {thisYear}</a>
        </div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen">
      <RecapContext.Provider value={{ isAuthenticated, currentYear, athlete, activityData, colorPalette, theme: THEME[themeKey], updateYear, logout }}>
        <Dashboard />
      </RecapContext.Provider>
    </div >
  )
}

export default App
