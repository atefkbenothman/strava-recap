import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Clock } from 'lucide-react'
import { getRandomColor } from "../../utils/utils"

import Card from "../card"

type AreaChartData = {
  hour: string
  activities: number
}

/*
 * Activity start times
*/
export default function StartTimes() {
  const { activityData, theme } = useContext(RecapContext)
  const data = Array(24).fill(0).map((_, index) => {
    return { hour: index.toString(), activities: 0 } as AreaChartData
  })
  activityData.all!.forEach(activity => {
    const startHour = new Date(activity.start_date!).getHours()
    const existingHour = data.find(item => item.hour === startHour.toString())
    if (existingHour) {
      existingHour.activities += 1
    }
  })
  data.sort((a, b) => Number(a.hour) - Number(b.hour))
  const color = getRandomColor(theme.colors as readonly string[])
  return (
    <Card title="Start Times" description="activity start times" icon={<Clock size={15} strokeWidth={2.5} />}>
      <ResponsiveContainer height={350} width="90%">
        <AreaChart data={data}>
          <Area type="monotone" dataKey="activities" stroke={color} strokeWidth={2} fill={color} isAnimationActive={false} label={{ position: "top", fontSize: 9 }} />
          <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}