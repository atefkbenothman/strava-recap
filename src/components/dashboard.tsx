import { useContext } from "react"
import { RecapContext } from "../contexts/recapContext"

import DailyActivities from "./charts/dailyActivities"
import SportTypes from "./charts/sportTypes"
import TotalTime from "./charts/totalTime"
import TotalDistanceElevation from "./charts/totalDistanceElevation"
import BiggestActivity from "./charts/biggestActivity"
import Records from "./charts/records"

import poweredByStravaLogo from "/powered-by-strava.svg"

export default function Dashboard() {
  const { isLoading } = useContext(RecapContext)

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <div className="flex w-full h-full items-center justify-center">
          <p>retrieving activities...</p>
        </div>
      ) : (
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col p-2 gap-2 h-full w-full">
            <div className="flex items-center">
              <p className="text-2xl font-semibold">2024 Recap</p>
              <img src={poweredByStravaLogo} alt="powered by strava logo" width={80} className="ml-auto" />
            </div>
            <div className="flex flex-col h-full w-full">
              <div className="flex grid grid-cols-4 gap-2 h-full w-full">
                <div className="bg-[#efefef] rounded p-1 col-span-2 gap-2 flex flex-col w-full h-full">
                  <DailyActivities />
                </div>
                <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full">
                  <SportTypes />
                </div>
                <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full">
                  <TotalTime />
                </div>
                <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full">
                  <TotalDistanceElevation />
                </div>
                <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full">
                  <BiggestActivity />
                </div>
                <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full">
                  <Records />
                </div>
                <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full">
                  <p>hello</p>
                </div>
                <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full">
                  <p>hello</p>
                </div>
                <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full">
                  <p>hello</p>
                </div>
                <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full">
                  <p>hello</p>
                </div>
                <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full">
                  <p>hello</p>
                </div>
                <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full">
                  <p>hello</p>
                </div>
                <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full">
                  <SportTypes />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
