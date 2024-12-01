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
  Cell,
  Legend
} from "recharts"

type SportType = {
  type: string
  hours: number
}

export default function TotalHours() {
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
  const COLORS = ["#E4572E", "#E7741F", "#EA9010"]
  return (
    <div className="flex flex-col w-full h-full">
      <p className="text-lg font-semibold m-1 underline">Total Hours</p>
      {/* <div className="flex justify-center font-semibold">
        <p className="text-3xl bg-gray-300 p-1 rounded">{totalHours.toFixed(0)}<span className="text-sm"> hours</span></p>
      </div> */}
      <div className="flex w-full h-full items-center justify-center p-2">
        <ResponsiveContainer height="99%">
          <BarChart data={data} layout="vertical">
            <Bar dataKey="hours" isAnimationActive={false} label={{ position: "right" }}>
              {data.map((_, idx) => {
                return <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              })}
            </Bar>
            <YAxis type="category" dataKey="type" />
            <Tooltip />
            <XAxis type="number" hide={true} />
            {/* <Legend verticalAlign="bottom" align="center" /> */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
{/* <PieChart>
  <Pie label data={data} dataKey="count" nameKey="type" innerRadius={60} outerRadius={80} isAnimationActive={false}>
    {data.map((_, idx) => (
      <Cell key={idx} fill={colors[idx % colors.length]} />
    ))}
  </Pie> */}