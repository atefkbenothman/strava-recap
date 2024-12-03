import { useEffect, useState, useContext, ReactElement } from "react"
import { RecapContext } from "../contexts/recapContext"

import DailyActivities from "./charts/dailyActivities"
import SportTypes from "./charts/sportTypes"
import TotalHours from "./charts/totalHours"
import TotalDistanceElevation from "./charts/totalDistanceElevation"
// import BiggestActivity from "./charts/biggestActivity"
import Records from "./charts/records"
import Distances from "./charts/distances"
import MonthlyActivities from "./charts/monthlyActivities"
import Socials from "./charts/socials"
import TimeTracker from "./charts/timeTracker"
import LongestStreaks from "./charts/longestStreaks"
import MonthlyElevation from "./charts/monthlyElevation"
import GearUsage from "./charts/gearUsage"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

import poweredByStravaLogo from "/powered-by-strava.svg"

export default function Dashboard() {
  const { athlete, currentYear, logout } = useContext(RecapContext)
  const [shuffledComponents, setShuffledComponents] = useState<Array<{ colSpan: number; component: ReactElement }>>([]);

  useEffect(() => {
    const graphs = [
      {
        colSpan: 1,
        component: <GearUsage />
      },
      {
        colSpan: 1,
        component: <MonthlyElevation />
      },
      {
        colSpan: 1,
        component: <TotalHours />
      },
      {
        colSpan: 1,
        component: <LongestStreaks />
      },
      {
        colSpan: 1,
        component: <SportTypes />
      },
      {
        colSpan: 1,
        component: <TotalDistanceElevation />
      },
      // {
      //   colSpan: 2,
      //   component: <BiggestActivity />
      // },
      {
        colSpan: 1,
        component: <Records />
      },
      {
        colSpan: 1,
        component: <Distances />
      },
      {
        colSpan: 1,
        component: <MonthlyActivities />
      },
      {
        colSpan: 1,
        component: <Socials />
      },
      {
        colSpan: 1,
        component: <TimeTracker />
      }
    ]
    const shuffleArray = (array: Array<{ colSpan: number; component: ReactElement }>) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    setShuffledComponents(shuffleArray(graphs));
  }, [])

  return (
    <div className="w-full h-full">
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col p-2 gap-2 h-fit w-full">

          <div className="grid grid-cols-2 gap-2">
            <div className="font-semibold text-xl flex items-center gap-2">
              <p>{athlete?.firstname} {athlete?.lastname}'s {currentYear} Recap</p>
            </div>
            <div className="flex ml-auto gap-4 h-full items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <img src={athlete?.profile} width={28} height={28} className="rounded-full border-2 border-black hover:cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="hover:cursor-pointer">Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <img className="h-full" src={poweredByStravaLogo} alt="powered by strava logo" width={60} height={80} />
            </div>
          </div>

          <div className="flex flex-col h-fit w-full">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2 w-full">

              <div className="bg-[#efefef] col-span-1 sm:col-span-2 rounded">
                <DailyActivities />
              </div>

              {shuffledComponents.map(({ component, colSpan }, index) => (
                <div key={index} className={`bg-[#efefef] col-span-${colSpan} rounded`}>
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
