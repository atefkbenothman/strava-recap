import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { StravaActivity } from "../../types/strava"
import { unitConversion } from "../../utils/utils"
import { Trophy } from 'lucide-react'

import polyline from "@mapbox/polyline"

import Card from "../card"


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
        <p className="font-semibold text-xl">
          {value}
        </p>
        <p className="text-xs"> {unit}</p>
      </div>
    </div>
  )
}

export default function BiggestActivity() {
  const { activities } = useContext(RecapContext)
  if (activities.length < 1) {
    return
  }
  const biggestActivity = activities.reduce((biggestActivity: StravaActivity, activity: StravaActivity) => {
    return activity.distance! > biggestActivity.distance! ? activity : biggestActivity
  }, activities[0])
  const route = polyline.decode(biggestActivity.map?.summary_polyline!)
  return (
    <Card title="Biggest Activity" icon={<Trophy size={16} strokeWidth={2} />}>
      <div className="grid grid-rows-[repeat(3,min-content)_1fr] h-full gap-2">
        <div className="flex justify-center">
          <p>{biggestActivity.name}</p>
        </div>
        <div className="flex items-center justify-center">
          <img
            src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s-a+9ed4bd(${biggestActivity.start_latlng![1]
              },${biggestActivity.start_latlng![0]}),pin-s-b+000(${biggestActivity.end_latlng![1]
              },${biggestActivity.end_latlng![0]}),path-5+f44-0.5(${encodeURIComponent(
                polyline.encode(route)
              )})/auto/500x500?access_token=${token}&zoom=14`}
            alt="map"
            height="90%"
            width="90%"
            className="rounded shadow-md"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
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
    </Card>
  )
}
