import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { StravaActivity } from "../../types/strava"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
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
  const data = activities.reduce((acc: SportType[], activity: StravaActivity) => {
    const type = activity.sport_type!
    const existingType = acc.find((t) => t.type === type)
    if (existingType) {
      existingType.distance += activity.distance!
      existingType.elevation += activity.total_elevation_gain!
    } else {
      acc.push({ type, distance: activity.distance!, elevation: activity.total_elevation_gain! })
    }
    return acc
  }, [])
  return (
    <div className="flex flex-col w-full h-full">
      <p className="text-lg font-semibold m-1">Total Distance + Elevation</p>
      <div className="flex w-full h-full items-center justify-center px-4">
        <ResponsiveContainer width="90%" height="80%">
          <BarChart data={data}>
            <Bar dataKey="distance" fill="#8884d8" />
            <Bar dataKey="elevation" fill="#8884d8" />
            <XAxis type="category" dataKey="type" />
            <Tooltip />
            <Legend verticalAlign="bottom" align="center" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
