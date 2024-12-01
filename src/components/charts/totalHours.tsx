import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { StravaActivity } from "../../types/strava"
import { unitConversion } from "../../utils/utils"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
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
    const hours = unitConversion.convertSecondsToHours(activity.moving_time!)
    totalHours += hours
    if (existingType) {
      existingType.hours += hours
    } else {
      acc.push({ type, hours: hours })
    }
    return acc
  }, [])
  data = data.map((sportType: SportType) => {
    return { type: sportType.type, hours: Math.round(sportType.hours) }
  })
  const colors = ["#06D6A0", "#118AB2", "#073B4C"]
  return (
    <div className="flex flex-col w-full h-full overflow-hidden relative">
      <p className="font-semibold mt-2 mx-2">Sport Types</p>
      <p className="mx-2 text-xs font-normal text-gray-800 w-1/2">number of hours per sport</p>
      <div className="absolute top-2 right-2 rounded text-right">
        <p className="text-3xl">{Math.round(totalHours)}</p>
        <p style={{ fontSize: "10px" }}>hours</p>
      </div>
      <div className="flex w-full h-full items-center justify-center p-2">
        <ResponsiveContainer height={350} width="90%">
          <PieChart>
            <Pie label={{ fontSize: 14 }} data={data} dataKey="hours" nameKey="type" innerRadius={50} outerRadius={80} isAnimationActive={false}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={colors[idx % colors.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" align="center" />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div >
    </div >
  )
}
