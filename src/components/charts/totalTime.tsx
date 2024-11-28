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
  hours: number
}

export default function TotalTime() {
  const { activities } = useContext(RecapContext)
  let totalHours = 0
  let data = activities.reduce((acc: SportType[], activity: StravaActivity) => {
    const type = activity.sport_type!
    const existingType = acc.find((t) => t.type === type)
    totalHours += unitConversion.convertSecondsToHours(activity.moving_time!)
    if (existingType) {
      existingType.hours += activity.moving_time!
    } else {
      acc.push({ type, hours: activity.moving_time! })
    }
    return acc
  }, [])
  data = data.map((sportType: SportType) => {
    return { type: sportType.type, hours: Math.round(unitConversion.convertSecondsToHours(sportType.hours)) }
  })
  return (
    <div className="flex flex-col w-full h-full">
      <p className="text-lg font-semibold m-1">Total Time</p>
      <div className="flex justify-center font-semibold">
        <p className="text-3xl bg-gray-300 p-1 rounded">{totalHours.toFixed(0)}<span className="text-sm"> hours</span></p>
      </div>
      <div className="flex w-full h-full items-center justify-center px-4">
        <ResponsiveContainer width="90%" height="80%">
          <BarChart data={data} layout="vertical">
            <Bar dataKey="hours" fill="#8884d8" />
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