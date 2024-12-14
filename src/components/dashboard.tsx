import { useContext, ReactElement } from "react"
import { ActivityDataContext, AuthContext, ThemeContext } from "../contexts/context"

import DailyActivities from "./charts/dailyActivities"
import YearPicker from "./yearPicker"
import Menu from "./menu"

import poweredByStravaLogo from "/powered-by-strava.svg"

type Props = {
  graphs: ReactElement[]
}

export default function Dashboard({ graphs }: Props) {
  const { athlete } = useContext(AuthContext)
  const { currentYear } = useContext(ActivityDataContext)
  const { darkMode } = useContext(ThemeContext)

  return (
    <div className={`w-full h-full dark:bg-[#121212] dark:text-white ${darkMode && 'dark'}`}>
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col p-2 gap-1 h-fit w-full dark:bg-[#121212] dark:text-white">

          {/* Top Bar */}
          <div className="w-full h-full grid grid-cols-2 items-center">
            {/* Left Side */}
            <div className="h-full w-full items-center flex">
              <div className="font-semibold text-xl w-full brak-words">
                <p className="break-words">{athlete?.firstname} {athlete?.lastname}'s {currentYear} Recap</p>
              </div>
            </div>
            {/* Right Side */}
            <div className="w-fit h-full ml-auto">
              <div className="w-full h-full grid grid-rows-2 sm:grid-rows-1 grid-flow-col gap-x-6">
                <div className="flex items-center justify-center">
                  <YearPicker />
                </div>
                <div className="flex items-center justify-end">
                  <Menu />
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

              {graphs.map((graph, index) => (
                <div key={index} className="bg-[#efefef] dark:bg-[#1e2223] col-span-1 rounded">
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
