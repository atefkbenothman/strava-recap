import { useContext } from "react"
import { StravaActivity } from "../../types/strava"
import { RecapContext } from "../../contexts/recapContext"
import { unitConversion } from "../../utils/utils"
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip, Cell } from "recharts"

import Card from "../card"

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
    <Card title="Total Activities" description="number of activities per sport" total={totalActivities} totalUnits="activities">
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
    </Card>
  )
}