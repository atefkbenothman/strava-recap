import { useMemo, useState } from "react"
import { useStravaActivityContext } from "../hooks/useStravaActivityContext"
import Loading from "./displays/loading"
import Error from "./displays/error"
import { Analytics } from "@vercel/analytics/react"
import { useThemeContext } from "../hooks/useThemeContext"

import YearPicker from "./nav/yearPicker"
import Menu from "./nav/menu"
import DailyActivities from "./charts/dailyActivities"

import poweredByStravaLogo from "/powered-by-strava.svg"
import { useStravaAuthContext } from "../hooks/useStravaAuthContext"
import { useCurrentYearContext } from "../hooks/useCurrentYearContext"
import NoActivities from "./displays/noActivities"

import SportTypes from "./charts/sportTypes"
import TotalHours from "./charts/totalHours"
import ActivityCount from "./charts/activityCount"
import Records from "./charts/records"
import Distance from "./charts/distance"
import DistanceRanges from "./charts/distanceRanges"
import Socials from "./charts/socials"
import StartTimes from "./charts/startTimes"
import Streaks from "./charts/streaks"
import Elevation from "./charts/elevation"
import Gear from "./charts/gear"
import BiggestActivity from "./charts/biggestActivity"
import DistanceVsElevation from "./charts/distanceVsElevation"
import HeartrateVsSpeed from "./charts/heartrateVsSpeed"
import PrsOverTime from "./charts/prsOverTime"
import RestDays from "./charts/restDays"
import HeartrateZones from "./charts/heartrateZones"
import Photo from "./charts/photo"
import DistanceVsPower from "./charts/distanceVsPower"
import TemperatureVsSpeed from "./charts/tempVsSpeed"
import DistanceVsSpeed from "./charts/distanceVsSpeed"


const GRAPH_COMPONENTS: { id: string, component: React.ReactNode }[] = [
  { id: "distance", component: <Distance /> },
  { id: "elevation", component: <Elevation /> },
  { id: "activityCount", component: <ActivityCount /> },
  { id: "restDays", component: <RestDays /> },
  { id: "sportTypes", component: <SportTypes /> },
  { id: "totalHours", component: <TotalHours /> },
  { id: "records", component: <Records /> },
  { id: "streaks", component: <Streaks /> },
  { id: "socials", component: <Socials /> },
  { id: "biggestActivity", component: <BiggestActivity /> },
  { id: "photo", component: <Photo /> },
  { id: "startTimes", component: <StartTimes /> },
  { id: "prsOverTime", component: <PrsOverTime /> },
  { id: "distanceRanges", component: <DistanceRanges /> },
  { id: "gear", component: <Gear /> },
  { id: "distanceVsElevation", component: <DistanceVsElevation /> },
  { id: "heartrateVsSpeed", component: <HeartrateVsSpeed /> },
  { id: "distanceVsPower", component: <DistanceVsPower /> },
  { id: "tempVsSpeed", component: <TemperatureVsSpeed /> },
  { id: "distanceVsSpeed", component: <DistanceVsSpeed /> },
  { id: "heartrateZones", component: <HeartrateZones /> },
]


export default function Dashboard() {
  const { athlete } = useStravaAuthContext()
  const {
    activitiesData,
    activitiesLoading,
    activitiesError
  } = useStravaActivityContext()
  const { currentYear } = useCurrentYearContext()
  const { darkMode } = useThemeContext()

  const [shuffle, setShuffle] = useState<boolean>(false)

  const shuffleGraphComponents = useMemo(() => {
    return GRAPH_COMPONENTS
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }, [shuffle])

  const toggleShuffle = () => {
    setShuffle(prevState => !prevState)
  }

  if (activitiesLoading) {
    return (
      <div>
        <Loading />
        <Analytics />
      </div>
    )
  }

  if (activitiesError) {
    const errorCode = parseInt(activitiesError.message.slice(activitiesError.message.indexOf('<') + 1, activitiesError.message.indexOf('>')), 10) || null
    return (
      <div>
        <Error message={activitiesError.message} code={errorCode} />
        <Analytics />
      </div>
    )
  }

  // succesfully authenticated but user has no activities
  if (!activitiesData || activitiesData.all.length === 0) {
    return (
      <div>
        <NoActivities />
        <Analytics />
      </div>
    )
  }

  return (
    <div className={`w-screen h-screen dark:bg-[#121212] dark:text-white ${darkMode && 'dark'}`}>
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col p-2 gap-1 h-fit w-full dark:bg-[#121212] dark:text-white">
          {/* Top Bar */}
          <div className="w-full h-full grid grid-cols-2 items-center gap-2">
            {/* Left Side */}
            <div className="h-full w-full items-center flex">
              <div className="font-semibold text-xl w-full text-balance">
                <p className="text-balance">{athlete?.firstname} {athlete?.lastname}'s {currentYear} Recap</p>
              </div>
            </div>
            {/* Right Side */}
            <div className="w-fit h-full ml-auto">
              <div className="w-full h-full grid grid-rows-2 sm:grid-rows-1 grid-flow-col gap-x-6">
                <div className="flex items-center justify-center">
                  <YearPicker />
                </div>
                <div className="flex items-center justify-end">
                  <Menu shuffle={toggleShuffle} />
                </div>
                <div className="items-center hidden sm:block w-fit ml-auto">
                  <div className="flex items-center h-full">
                    <img
                      src={poweredByStravaLogo}
                      alt="powered by strava logo"
                      width={70}
                      height={80}
                      className="h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="flex flex-col h-fit w-full">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2 w-full">
              <div className="bg-[#efefef] dark:bg-[#1e2223] col-span-1 sm:col-span-2 rounded">
                <DailyActivities />
              </div>
              {shuffleGraphComponents.map(({ id, component }) => (
                <div key={id} className="bg-[#efefef] dark:bg-[#1e2223] col-span-1 rounded">
                  {component}
                </div>
              ))}
            </div>
          </div>
        </div >
      </div >
    </div >
  )
}
