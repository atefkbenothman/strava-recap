import { useContext } from "react"
import { StravaActivity } from "../../types/strava"
import { RecapContext } from "../../contexts/recapContext"
import { unitConversion } from "../../utils/utils"
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip, Cell } from "recharts"

type SportType = {
  type: string
  count: number
  hours: number
}

export default function SportTypes() {
  const { activities } = useContext(RecapContext)
  let totalActivities = 0
  let data = activities.reduce((acc: SportType[], activity: StravaActivity) => {
    const type = activity.sport_type!
    const hours = unitConversion.convertSecondsToHours(activity.moving_time!)
    const existingType = acc.find((t) => t.type === type)
    totalActivities += 1
    if (existingType) {
      existingType.count++
      existingType.hours += hours
    } else {
      acc.push({ type, count: 1, hours: hours })
    }
    return acc
  }, [])
  data = data.map((sportType: SportType) => {
    return { type: sportType.type, count: sportType.count, hours: Math.round(sportType.hours) }
  })
  const colors = ["#06D6A0", "#118AB2", "#073B4C"]
  return (
    <div className="flex flex-col w-full h-full relative">
      <p className="font-semibold mx-2 mt-2">Sport Types</p>
      <p className="mx-2 text-xs font-normal text-gray-800 w-1/2">number of activities per sport</p>
      <div className="absolute top-2 right-2 rounded text-right">
        <p className="text-3xl">{totalActivities}</p>
        <p style={{ fontSize: "10px" }}>activities</p>
      </div>
      <div className="flex w-full h-full items-center justify-center p-2">
        <ResponsiveContainer height={350} width="90%">
          <PieChart>
            <Pie label={{ fontSize: 14 }} data={data} dataKey="count" nameKey="type" innerRadius={50} outerRadius={80} isAnimationActive={false}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={colors[idx % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}