import { useContext, useEffect, useState } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { StravaActivity } from "../../types/strava"
import { unitConversion } from "../../utils/utils"
import { Trophy } from 'lucide-react'
import Card from "../card"
import NoData from "../noData"

import polyline from "@mapbox/polyline"


const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

type MetricProps = {
  label: string
  value: string
  unit: string
}

function Metric({ label, value, unit }: MetricProps) {
  return (
    <div className="flex flex-col rounded p-1 gap-1">
      <p className="text-xs flex justify-center">{label}</p>
      <div className="flex flex-col w-full h-full items-center justify-center">
        <p className="font-semibold text-lg">
          {value}
        </p>
        <p className="text-xs"> {unit}</p>
      </div>
    </div>
  )
}

/*
 * Biggest Activity by distance
*/
export default function BiggestActivity() {
  const { activityData } = useContext(RecapContext)

  const [biggestActivity, setBiggestActivity] = useState<StravaActivity>()
  const [route, setRoute] = useState<[number, number][] | null>()

  useEffect(() => {
    if (!activityData || activityData.all!.length === 0) return
    function getBiggestActivity() {
      const biggestAct = activityData.all!.reduce((acc, activity) => {
        return activity.distance! > acc.distance! ? activity : acc
      }, activityData.all![0])
      setBiggestActivity(biggestAct)
      if (biggestAct.map?.summary_polyline) {
        const route = polyline.decode(biggestAct.map!.summary_polyline!)
        setRoute(route)
      }
    }
    getBiggestActivity()
  }, [activityData])

  return (
    <Card
      title="Biggest Activity"
      description=""
      icon={<Trophy size={16} strokeWidth={2} />}
    >
      <div className="flex justify-center">
        {!biggestActivity || activityData.all!.length === 0 ? (
          <NoData />
        ) : (
          <div className="grid grid-rows-[repeat(3,min-content)_1fr] h-full gap-4 rounded p-1">
            <div className="flex justify-center">
              <p>{biggestActivity.name}</p>
            </div>
            <div className="flex items-center justify-center">
              {route ? (
                <img
                  src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s-a+9ed4bd(${biggestActivity.start_latlng![1]
                    },${biggestActivity.start_latlng![0]}),pin-s-b+000(${biggestActivity.end_latlng![1]
                    },${biggestActivity.end_latlng![0]}),path-5+f44-0.5(${encodeURIComponent(
                      polyline.encode(route)
                    )})/auto/500x500?access_token=${token}&zoom=14`}
                  alt="map"
                  height="80%"
                  width="80%"
                  className="rounded shadow-md"
                />
              ) : null}
            </div>
            <div className="flex gap-8 mx-2 items-center justify-center">
              <Metric
                label="Distance"
                value={unitConversion.convertFromMetersToMi(biggestActivity.distance!).toFixed(1)}
                unit="mi"
              />
              <Metric
                label="Elevation"
                value={unitConversion.convertFromMetersToFeet(biggestActivity.total_elevation_gain!).toFixed(0)}
                unit="ft"
              />
              <Metric
                label="Time"
                value={unitConversion.convertSecondsToHours(biggestActivity.moving_time!).toFixed(1)}
                unit="hrs"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
