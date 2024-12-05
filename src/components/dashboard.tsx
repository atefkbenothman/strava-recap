import { useEffect, useState, useContext, ReactElement } from "react"
import { RecapContext } from "../contexts/recapContext"

import DailyActivities from "./charts/dailyActivities"
import SportTypes from "./charts/sportTypes"
import TotalHours from "./charts/totalHours"
import Distance from "./charts/distance"
import Records from "./charts/records"
import DistanceRanges from "./charts/distanceRanges"
import ActivityCount from "./charts/activityCount"
import Socials from "./charts/socials"
import StartTimes from "./charts/startTimes"
import Streaks from "./charts/streaks"
import Elevation from "./charts/elevation"
import Gear from "./charts/gear"
import BiggestActivity from "./charts/biggestActivity"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination"

import poweredByStravaLogo from "/powered-by-strava.svg"

export default function Dashboard() {
  const { athlete, currentYear, updateYear, logout } = useContext(RecapContext)

  const [shuffledComponents, setShuffledComponents] = useState<Array<ReactElement>>([]);

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
                <Pagination className="h-fit">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious className="hover:bg-transparent p-0 hover:cursor-pointer hover:underline" title={String((currentYear ?? 0) - 1)} onClick={(() => updateYear((currentYear ?? 0) - 1))} />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink className="font-semibold hover:bg-transparent mx-4">{currentYear}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext className="hover:bg-transparent p-0 hover:cursor-pointer hover:underline" title={String((currentYear ?? 0) + 1)} onClick={() => updateYear((currentYear ?? 0) + 1)} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
              <div className="">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <img src={athlete?.profile} width={28} height={28} className="rounded-full border-2 border-gray-600 hover:cursor-pointer max-w-full" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="hover:cursor-pointer focus:bg-red-500 focus:text-white">Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="">
                <img className="max-w-full" src={poweredByStravaLogo} alt="powered by strava logo" width={60} height={80} />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col h-fit w-full">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2 w-full">
              <div className="bg-[#efefef] col-span-1 sm:col-span-2 rounded">
                <DailyActivities />
              </div>
              {shuffledComponents.map((component, index) => (
                <div key={index} className="bg-[#efefef] col-span-1 rounded">
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
