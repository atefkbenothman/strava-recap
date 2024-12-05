import { useState, useEffect, ReactElement } from "react"
import { useQuery } from "@tanstack/react-query"

import { useStravaAuth } from "./hooks/useStravaAuth"
import { stravaApi } from "./services/api"
import { StravaActivity, SportType } from "./types/strava"
import { ActivitiesByType, ActivityData, MonthlyActivities, Months } from "./types/activity"
import { RecapContext } from "./contexts/recapContext"
import { THEME, ThemeKey } from "./themes/themeConfig"

import SportTypes from "./components/charts/sportTypes"
import TotalHours from "./components/charts/totalHours"
import Distance from "./components/charts/distance"
import Records from "./components/charts/records"
import DistanceRanges from "./components/charts/distanceRanges"
import ActivityCount from "./components/charts/activityCount"
import Socials from "./components/charts/socials"
import StartTimes from "./components/charts/startTimes"
import Streaks from "./components/charts/streaks"
import Elevation from "./components/charts/elevation"
import Gear from "./components/charts/gear"
import BiggestActivity from "./components/charts/biggestActivity"

import Dashboard from "./components/dashboard"

import connectWithStravaLogo from "/connect-with-strava.svg"

import "./App.css"


function App() {
  const { isAuthenticated, accessToken, athlete, login, logout } = useStravaAuth()

  const [activityData, setActivityData] = useState<ActivityData>({})
  const [currentYear, setCurrentYear] = useState<number>(Number(window.location.pathname.split("/")[1]) || 0)
  const [themeKey, setThemeKey] = useState<ThemeKey>("divergent")
  const [colorPalette, setColorPalette] = useState<Record<string, string>>({})
  const [shuffledComponents, setShuffledComponents] = useState<Array<ReactElement>>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: [currentYear],
    queryFn: () => stravaApi.getAllActivities(accessToken!, currentYear),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: false
  })

  useEffect(() => {
    const graphs = [
      <SportTypes />,
      <TotalHours />,
      <Distance />,
      <Records />,
      <DistanceRanges />,
      <ActivityCount />,
      <Socials />,
      <StartTimes />,
      <Streaks />,
      <Elevation />,
      <Gear />,
      <BiggestActivity />
    ]
    const shuffleArray = (array: Array<ReactElement>) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    setShuffledComponents(shuffleArray(graphs));
  }, [])

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
    const uniqueNewActivityTypes = [...new Set(
      activities.map(activity => activity.sport_type!)
    )]

    const updatedColorPalette = { ...colorPalette }
    const colors = THEME[themeKey].colors

    uniqueNewActivityTypes.forEach(sport => {
      if (!updatedColorPalette[sport]) {
        const usedColors = new Set(Object.values(updatedColorPalette))
        const availableColor = colors.find(color => !usedColors.has(color))
        if (availableColor) {
          updatedColorPalette[sport] = availableColor
        }
      }
    })
    setColorPalette(updatedColorPalette)
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

  if (Object.keys(activityData).length === 0 || Object.keys(activityData.all!).length === 0) {
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
        <Dashboard graphs={shuffledComponents} />
      </RecapContext.Provider>
    </div >
  )
}

export default App
