import { useState, useMemo, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Analytics } from "@vercel/analytics/react"

import { useStravaAuth } from "./hooks/useStravaAuth"
import { stravaApi } from "./services/api"
import { SportType } from "./types/strava"
import { ActivitiesByType, ActivityData, MonthlyActivities, Months, Units } from "./types/activity"
import { ActivityDataContext, AuthContext, ThemeContext } from "./contexts/context"
import { Theme, ThemeName, generateColorPalette, SportColors } from "./themes/theme"
import { Info } from "lucide-react"

import Dashboard from "./components/dashboard"
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
import DistanceVsElevation from "./components/charts/distanceVsElevation"
import HeartrateVsSpeed from "./components/charts/heartrateVsSpeed"
import PrsOverTime from "./components/charts/prsOverTime"
import RestDays from "./components/charts/restDays"

import { AboutDialog } from "./components/aboutDialog"

import connectWithStravaLogo from "/connect-with-strava.svg"

import "./App.css"


const GRAPH_COMPONENTS = [
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
  <BiggestActivity />,
  <DistanceVsElevation />,
  <HeartrateVsSpeed />,
  <PrsOverTime />,
  <RestDays />,
  // <HeatMap />
]

function App() {
  const {
    isAuthenticated,
    accessToken,
    athlete,
    login,
    logout,
    updateStravaAthlete
  } = useStravaAuth()

  const [currentYear, setCurrentYear] = useState<number>(Number(window.location.pathname.split("/")[1]) || 0)
  const [colorPalette, setColorPalette] = useState<SportColors>({})
  const [themeName, setThemeName] = useState<ThemeName>("Default")
  const [units, setUnits] = useState<Units>(localStorage.getItem("units") as Units || "imperial")
  const [filter, setFilter] = useState<SportType | "All">("All")
  const [darkMode, setDarkMode] = useState<boolean>(JSON.parse(localStorage.getItem("dark") || "true"))

  const {
    data: activities,
    isLoading,
    error
  } = useQuery({
    queryKey: [currentYear],
    queryFn: () => stravaApi.getAllActivities(accessToken!, currentYear),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: false
  })

  // update background color
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const setUnit = (unit: Units) => {
    localStorage.setItem("units", unit)
    setUnits(unit)
  }

  const setDark = (status: boolean) => {
    localStorage.setItem("dark", JSON.stringify(status))
    setDarkMode(status)
  }

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

  // const {
  //   data: athleteZones
  // } = useQuery({
  //   queryKey: ["athleteZones"],
  //   queryFn: () => stravaApi.getAthleteZones(accessToken!),
  //   enabled: isAuthenticated,
  //   staleTime: 1000 * 60 * 60,
  //   gcTime: 1000 * 60 * 60 * 24,
  //   retry: false
  // })

  // shuffle graphs
  const shuffledGraphComponents = useMemo(() => {
    return GRAPH_COMPONENTS
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }, [])

  // process activities
  const activityData = useMemo(() => {
    if (!activities) return {} as ActivityData

    const sportTypes: SportType[] = []
    const activitiesByMonth: MonthlyActivities = {}
    const activitiesByType: ActivitiesByType = {}

    Months.forEach(month => {
      activitiesByMonth[month] = []
    })

    // filter activities based on filter
    const filteredActivities = filter === "All"
      ? activities
      : activities.filter((act) => act.sport_type! === filter)

    filteredActivities.forEach(activity => {
      const sportType = activity.sport_type! as SportType
      const activityMonth = new Date(activity.start_date!).toLocaleString("default", { month: "long" })
      if (!activitiesByType[sportType]) {
        activitiesByType[sportType] = []
      }
      activitiesByMonth[activityMonth]?.push(activity)
      activitiesByType[sportType].push(activity)
      sportTypes.push(activity.sport_type! as SportType)
    })

    setColorPalette(generateColorPalette(sportTypes, themeName, colorPalette))

    return {
      all: filteredActivities,
      monthly: activitiesByMonth,
      bySportType: activitiesByType
    }

  }, [activities, filter])

  // update athlete data with bike and shoes data
  useEffect(() => {
    if (athleteData) {
      updateStravaAthlete(athleteData)
    }
  }, [athleteData])

  // update theme set by user
  useEffect(() => {
    if (!activities) return
    const sportTypes = activities.map(a => a.sport_type! as SportType)
    setColorPalette(generateColorPalette(sportTypes, themeName, colorPalette, true))
  }, [themeName])

  // auto redirect to current year if no year was specified
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

  if (!isAuthenticated) {
    return (
      <ThemeContext.Provider value={{
        darkMode,
        themeName,
        theme: Theme[themeName],
        colorPalette,
        setThemeName,
        setDarkMode: setDark
      }}>
        <div className={darkMode ? "dark" : ""}>
          <div className="w-screen h-screen flex flex-col items-center justify-center dark:bg-[#121212] dark:text-white">
            <div className="flex flex-col gap-4 px-8">
              <div className="flex flex-col gap-2 grow-0">
                <div className="flex items-center gap-6">
                  <p className="text-2xl font-semibold flex">{currentYear} Fitness Recap</p>
                  <AboutDialog
                    trigger={
                      <Info
                        size={18}
                        strokeWidth={2}
                        color={darkMode ? "#ebebeb" : "#525252"}
                        className="hover:cursor-pointer hover:scale-125"
                      />
                    }
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-white/80">Explore yearly recaps of your Strava activities</p>
                </div>
              </div>
              <img
                className="hover:cursor-pointer"
                width={160}
                src={connectWithStravaLogo}
                alt="login with strava"
                onClick={() => login(currentYear)}
              />
            </div>
          </div>
        </div>
        <Analytics />
      </ThemeContext.Provider>
    )
  }

  if (isLoading) {
    return (
      <ThemeContext.Provider value={{
        darkMode,
        themeName,
        theme: Theme[themeName],
        colorPalette,
        setThemeName,
        setDarkMode: setDark
      }}>
        <div className={darkMode ? "dark" : ""}>
          <div className="w-screen h-screen flex flex-col items-center justify-center dark:bg-[#121212] dark:text-white">
            <div className="flex flex-col gap-2 text-lg">
              <p>Retrieving <span className="font-bold text-xl">{currentYear}</span> activities...</p>
            </div>
          </div>
        </div>
      </ThemeContext.Provider>
    )
  }

  if (error) {
    const thisYear = new Date().getFullYear()
    return (
      <ThemeContext.Provider value={{
        darkMode,
        themeName,
        theme: Theme[themeName],
        colorPalette,
        setThemeName,
        setDarkMode: setDark
      }}>
        <div className={darkMode ? "dark" : ""}>
          <div className="w-screen h-screen flex flex-col items-center justify-center dark:bg-[#121212] dark:text-white">
            <div className="flex flex-col gap-2 text-lg mx-[30%]">
              <div className="flex gap-2">
                <p className="text-red-500 font-bold">Error: </p>
                <p>{error.message}</p>
              </div>
              <div className="flex gap-6">
                <p className="text-blue-500 underline hover:cursor-pointer w-fit" onClick={logout}>Reauthenticate</p>
                <p>or</p>
                <a className="underline text-left hover:cursor-pointer w-fit text-blue-500" onClick={() => updateYear(thisYear)}>/{thisYear}</a>
              </div>
            </div>
          </div>
        </div>
        <Analytics />
      </ThemeContext.Provider>
    )
  }

  if (Object.keys(activityData).length === 0 || Object.keys(activityData.all!).length === 0) {
    const thisYear = new Date().getFullYear()
    return (
      <ThemeContext.Provider value={{
        darkMode,
        themeName,
        theme: Theme[themeName],
        colorPalette,
        setThemeName,
        setDarkMode: setDark
      }}>
        <div className={darkMode ? "dark" : ""}>
          <div className="w-screen h-screen flex flex-col items-center justify-center dark:text-white dark:bg-[#121212]">
            <div className="flex flex-col gap-4 text-lg">
              {filter !== "All" ? (
                <>
                  <p>No activities ({filter}) from <span className="font-bold text-xl">{currentYear}</span></p>
                  <div className="flex gap-6">
                    <a className="underline text-left hover:cursor-pointer w-fit text-blue-500" onClick={() => updateYear(thisYear)}>/{thisYear}</a>
                    <p>or</p>
                    <a className="underline text-left hover:cursor-pointer w-fit text-blue-500" onClick={() => setFilter("All")}>reset filter</a>
                  </div>
                </>
              ) : (
                <>
                  <p>No activities from <span className="font-bold text-xl">{currentYear}</span></p>
                  <div className="flex gap-6">
                    <a className="underline text-left hover:cursor-pointer w-fit text-blue-500" onClick={() => updateYear(thisYear)}>/{thisYear}</a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <Analytics />
      </ThemeContext.Provider>
    )
  }

  return (
    <div className="w-screen h-screen">
      <AuthContext.Provider value={{
        isAuthenticated,
        athlete,
        logout
      }}>
        <ActivityDataContext.Provider value={{
          currentYear,
          activityData,
          units,
          filter,
          setFilter,
          updateYear,
          setUnits: setUnit
        }}>
          <ThemeContext.Provider value={{
            darkMode,
            themeName,
            theme: Theme[themeName],
            colorPalette,
            setThemeName,
            setDarkMode: setDark
          }}>
            <div className={darkMode ? "dark" : ""}>
              <Dashboard graphs={shuffledGraphComponents} />
            </div>
          </ThemeContext.Provider>
        </ActivityDataContext.Provider>
      </AuthContext.Provider>
      <Analytics />
    </div>
  )
}

export default App