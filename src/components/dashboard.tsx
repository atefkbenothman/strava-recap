import { useMemo, useState } from "react"
import { useStravaActivityContext } from "../hooks/useStravaActivityContext"
import Loading from "./displays/loading"
import Error from "./displays/error"
import { Analytics } from "@vercel/analytics/react"
import { useThemeContext } from "../hooks/useThemeContext"
import { track } from "@vercel/analytics"

import DailyActivities from "./charts/dailyActivities"
import Navbar from "./nav/navbar"

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
  const {
    activitiesData,
    activitiesLoading,
    activitiesError
  } = useStravaActivityContext()
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
    track("shuffled graphs")
  }

  if (activitiesLoading) {
    return (
      <div>
        <Loading />
        <Analytics mode="production" />
      </div>
    )
  }

  if (activitiesError) {
    const errorCode = parseInt(activitiesError.message.slice(activitiesError.message.indexOf('<') + 1, activitiesError.message.indexOf('>')), 10) || null
    track("activitiesError", {
      error: String(activitiesError),
      errorCode: errorCode,
    })
    return (
      <div>
        <Error message={activitiesError.message} code={errorCode} />
        <Analytics mode="production" />
      </div>
    )
  }

  // succesfully authenticated but user has no activities
  if (!activitiesData || activitiesData.all.length === 0) {
    return (
      <div>
        <NoActivities />
        <Analytics mode="production" />
      </div>
    )
  }

  return (
    <div
      className={`w-screen h-screen dark:bg-[#121212] dark:text-white ${
        darkMode && "dark"
      }`}
    >
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col px-2 pt-1 pb-2 gap-1 h-fit w-full dark:bg-[#121212] dark:text-white">
          <Navbar toggleShuffle={toggleShuffle} />

          <div className="flex flex-col h-fit w-full">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2 w-full">
              <div className="bg-[#efefef] dark:bg-[#1e2223] col-span-1 sm:col-span-2 rounded">
                <DailyActivities />
              </div>
              {shuffleGraphComponents.map(({ id, component }) => (
                <div
                  key={id}
                  className="bg-[#efefef] dark:bg-[#1e2223] col-span-1 rounded"
                >
                  {component}
                </div>
              ))}
            </div>
            </div>
          </div>

        <div className="mt-auto pb-4 pt-2 text-center text-sm text-gray-500 dark:text-white/60">
          Made by{" "}
          <a
            href="https://kaib.vercel.app/"
            className="underline underline-offset-4"
            target="_blank"
          >
            Kai
          </a>
        </div>
      </div>
    </div>
  );
}
