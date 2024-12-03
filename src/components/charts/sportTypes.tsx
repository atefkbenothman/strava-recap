import { useContext } from "react"
import { StravaActivity } from "../../types/strava"
import { RecapContext } from "../../contexts/recapContext"
import { unitConversion } from "../../utils/utils"
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip, Cell } from "recharts"
import { Zap } from 'lucide-react'

import Card from "../card"

type SportType = {
  type: string
  count: number
  hours: number
  color?: string
}

export default function SportTypes() {
  const { activities, colorPalette } = useContext(RecapContext)
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
    return { type: sportType.type, count: sportType.count, hours: Math.round(sportType.hours), color: colorPalette[sportType.type] }
  })
  console.log(data)
  return (
    <Card title="Total Activities" description="number of activities per sport" total={totalActivities} totalUnits="activities" icon={<Zap size={16} strokeWidth={2} />}>
      <ResponsiveContainer height={350} width="90%">
        <PieChart>
          <Pie label={{ fontSize: 14 }} data={data} dataKey="count" nameKey="type" innerRadius={50} outerRadius={80} isAnimationActive={false}>
            {data.map((d, idx) => (
              <Cell key={idx} fill={d.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}