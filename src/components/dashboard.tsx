import { useState, useContext, ReactElement } from "react"
import { RecapContext } from "../contexts/recapContext"

import DailyActivities from "./charts/dailyActivities"
import YearPicker from "./yearPicker"
import Menu from "./menu"

import poweredByStravaLogo from "/powered-by-strava.svg"

type Props = {
  graphs: ReactElement[]
}

export default function Dashboard({ graphs }: Props) {
  const { athlete, currentYear } = useContext(RecapContext)

  return (
    <div className="w-full h-full">
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col p-2 gap-1 h-fit w-full">

          {/* Top Bar */}
          <div className="grid grid-cols-2">

            {/* Left Side */}
            <div className="font-semibold text-xl flex items-center">
              <p>{athlete?.firstname} {athlete?.lastname}'s {currentYear} Recap</p>
            </div>

            {/* Right Side */}
            <div className="flex flex-wrap w-full gap-6 items-center h-full justify-end">
              <div className="flex items-center hidden sm:block">
                <YearPicker />
              </div>
              <div>
                <Menu />
              </div>
              <div>
                <img
                  className="max-w-full"
                  src={poweredByStravaLogo}
                  alt="powered by strava logo"
                  width={60}
                  height={80}
                />
              </div>
            </div>

          </div>

          {/* Main Content */}
          <div className="flex flex-col h-fit w-full">

            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2 w-full">

              <div className="bg-[#efefef] col-span-1 sm:col-span-2 rounded">
                <DailyActivities />
              </div>

              {graphs.map((graph, index) => (
                <div key={index} className="bg-[#efefef] col-span-1 rounded">
                  {graph}
                </div>
              ))}

            </div>

          </div>

        </div >
      </div >
    </div >
  )
}
