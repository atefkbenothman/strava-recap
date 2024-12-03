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
import { Watch } from 'lucide-react'
import Card from "../card"


type SportType = {
  type: string
  hours: number
  color?: string
}

export default function TotalHours() {
  const { activities, colorPalette } = useContext(RecapContext)
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
    return { type: sportType.type, hours: Math.round(sportType.hours), color: colorPalette[sportType.type] }
  })
  return (
    <Card title="Total Hours" description="number of hours per sport" total={Math.round(totalHours)} totalUnits="hours" icon={<Watch size={17} strokeWidth={2} />}>
      <ResponsiveContainer height={350} width="90%">
        <PieChart>
          <Pie label={{ fontSize: 14 }} data={data} dataKey="hours" nameKey="type" innerRadius={50} outerRadius={80} isAnimationActive={false}>
            {data.map((d, idx) => (
              <Cell key={idx} fill={d.color} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" align="center" />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}
