import { useEffect, useState, useContext, ReactElement } from "react"
import { RecapContext } from "../contexts/recapContext"

import DailyActivities from "./charts/dailyActivities"
import SportTypes from "./charts/sportTypes"
import TotalHours from "./charts/totalHours"
import TotalDistanceElevation from "./charts/totalDistanceElevation"
import BiggestActivity from "./charts/biggestActivity"
import Records from "./charts/records"
import Streaks from "./charts/streaks"
import MonthlyActivities from "./charts/monthlyActivities"

import poweredByStravaLogo from "/powered-by-strava.svg"

export default function Dashboard() {
  const { athlete, currentYear, logout } = useContext(RecapContext)
  const [shuffledComponents, setShuffledComponents] = useState<ReactElement[]>([]);

  useEffect(() => {
    const graphs = [
      // <SportTypes />,
      // <TotalHours />,
      // <TotalDistanceElevation />,
      // <BiggestActivity />,
      // <Records />,
      // <Streaks />,
      // <MonthlyActivities />,
      <p>hello</p>,
      <p>hello</p>,
      <p>hello</p>,
      <p>hello</p>,
      <p>hello</p>,
      <p>hello</p>,
      <p>hello</p>,
      <p>hello</p>,
      <p>hello my name is Kai</p>,
      <p>hello</p>,
      <p>hello my name is Kai</p>,
      <p>hello</p>,
      <p>hello</p>,
      <p>hello</p>,
      <p>hello</p>
    ]
    const shuffleArray = (array: ReactElement[]) => {
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
            <div className="">
              <p>{athlete?.firstname} {athlete?.lastname}'s {currentYear} Recap</p>
            </div>
            <div className="flex ml-auto gap-2 gap-2">
              <button className="text-xs" onClick={logout}>Sign Out</button>
              <img className="" src={poweredByStravaLogo} alt="powered by strava logo" width={60} height={80} />
            </div>
          </div>

          <div className="flex flex-col h-fit w-full bg-red-100">
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
