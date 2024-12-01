import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { StravaActivity } from "../../types/strava"
import { unitConversion } from "../../utils/utils"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts"

type SportType = {
  type: string
  distance: number
  elevation: number
}

export default function TotalDistanceElevation() {
  const { activities } = useContext(RecapContext)
  let totalDistance = 0
  let totalElevation = 0
  let data = activities.reduce((acc: SportType[], activity: StravaActivity) => {
    const type = activity.sport_type!
    const existingType = acc.find((t) => t.type === type)
    totalDistance += unitConversion.convertFromMetersToMi(activity.distance!)
    totalElevation += unitConversion.convertFromMetersToFeet(activity.total_elevation_gain!)
    if (existingType) {
      existingType.distance += activity.distance!
      existingType.elevation += activity.total_elevation_gain!
    } else {
      acc.push({ type, distance: activity.distance!, elevation: activity.total_elevation_gain! })
    }
    return acc
  }, [])
  data = data.map((sportType: SportType) => {
    return { type: sportType.type, distance: Math.round(unitConversion.convertFromMetersToMi(sportType.distance)), elevation: Math.round(unitConversion.convertFromMetersToFeet(sportType.elevation)) }
  })
  const COLORS = ["#486092", "#8884D8"]
  return (
    <div className="flex flex-col w-full h-full">
      <p className="text-lg font-semibold m-1 underline">Total Distance + Elevation</p>
      {/* <div className="flex grid grid-cols-2 justify-center font-semibold place-items-center">
        <p className="text-3xl bg-gray-300 p-1 rounded w-fit">{totalDistance.toFixed(0)}<span className="text-sm"> mi</span></p>
        <p className="text-3xl bg-gray-300 p-1 rounded w-fit">{totalElevation.toFixed(0)}<span className="text-sm"> ft</span></p>
      </div> */}
      <div className="flex w-full h-full items-center justify-center p-2">
        <ResponsiveContainer height="99%">
          <BarChart data={data}>
            <Bar dataKey="distance" fill={COLORS[0]} isAnimationActive={false} label={{ position: "top" }} />
            <Bar dataKey="elevation" fill={COLORS[1]} isAnimationActive={false} label={{ position: "top" }} />
            <XAxis type="category" dataKey="type" />
            {/* <YAxis type="number" /> */}
            <Tooltip />
            {/* <Legend verticalAlign="bottom" align="center" /> */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
