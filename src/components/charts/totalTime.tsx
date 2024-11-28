import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { StravaActivity } from "../../types/strava"
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
  time: number
}

export default function TotalTime() {
  const { activities } = useContext(RecapContext)
  const data = activities.reduce((acc: SportType[], activity: StravaActivity) => {
    const type = activity.sport_type!
    const existingType = acc.find((t) => t.type === type)
    if (existingType) {
      existingType.time += activity.moving_time!
    } else {
      acc.push({ type, time: activity.moving_time! })
    }
    return acc
  }, [])
  return (
    <div className="flex flex-col w-full h-full">
      <p className="text-lg font-semibold m-1">Total Time</p>
      <div className="flex w-full h-full items-center justify-center px-4">
        <ResponsiveContainer width="90%" height="80%">
          <BarChart data={data} layout="vertical">
            <Bar dataKey="time" fill="#8884d8" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="type" />
            <Tooltip />
            <Legend verticalAlign="bottom" align="center" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}