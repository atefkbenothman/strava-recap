import { useContext } from "react"
import { RecapContext } from "../contexts/recapContext"

import DailyActivities from "./charts/dailyActivities"
import SportTypes from "./charts/sportTypes"
import TotalHours from "./charts/totalHours"
import TotalDistanceElevation from "./charts/totalDistanceElevation"
import BiggestActivity from "./charts/biggestActivity"
import Records from "./charts/records"

import poweredByStravaLogo from "/powered-by-strava.svg"

export default function Dashboard() {
  const { athlete, currentYear, logout } = useContext(RecapContext)

  return (
    <div className="w-full h-full">
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col p-2 gap-2 h-full w-full">
          <div className="flex grid grid-cols-3 place-items-center">
            <img className="mr-auto" src={poweredByStravaLogo} alt="powered by strava logo" width={80} />
            <p className="text-2xl font-semibold">{athlete?.firstname} {athlete?.lastname}'s {currentYear} Recap</p>
            <button className="ml-auto border-2 border-black p-1 rounded" onClick={logout}>Sign Out</button>
          </div>
          <div className="flex flex-col h-full w-full">
            <div className="flex grid grid-cols-4 gap-2 h-full w-full">
              <div className="bg-[#efefef] rounded p-1 col-span-2 gap-2 flex flex-col w-full h-full overflow-auto">
                <DailyActivities />
              </div>
              <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full overflow-auto">
                <SportTypes />
              </div>
              <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full overflow-auto">
                <TotalHours />
              </div>
              <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full overflow-auto">
                <TotalDistanceElevation />
              </div>
              <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full overflow-auto">
                <BiggestActivity />
              </div>
              <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full overflow-auto">
                <Records />
              </div>
              <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full overflow-auto">
                <p>hello</p>
              </div>
              <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full overflow-auto">
                <p>hello</p>
              </div>
              <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full overflow-auto">
                <p>hello</p>
              </div>
              <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full overflow-auto">
                <p>hello</p>
              </div>
              <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full overflow-auto">
                <p>hello</p>
              </div>
              <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full overflow-auto">
                <p>hello</p>
              </div>
              <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full overflow-auto">
                <p>hello</p>
              </div>
              <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full overflow-auto">
                <p>hello</p>
              </div>
              <div className="bg-[#efefef] rounded p-1 gap-2 flex flex-col w-full h-full overflow-auto">
                <p>hello</p>
              </div>
            </div>
          </div>
        </div >
      </div >
    </div >
  )
}
