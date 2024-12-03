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
import { Timer } from 'lucide-react'

import Card from "../card"



export default function MonthlyActivities() {
  const { activities, colorPalette } = useContext(RecapContext)
  const monthData = [
    { "month": "January" },
    { "month": "February" },
    { "month": "March" },
    { "month": "April" },
    { "month": "May" },
    { "month": "June" },
    { "month": "July" },
    { "month": "August" },
    { "month": "September" },
    { "month": "October" },
    { "month": "November" },
    { "month": "December" }
  ]
  let totalActivities = 0
  const data = activities.reduce((acc: any[], activity: StravaActivity) => {
    const date = new Date(activity.start_date!);
    const sportType = activity.sport_type!
    const month = date.toLocaleString('default', { month: 'long' });
    let entry = acc.find(item => item.month === month);
    totalActivities += 1
    if (!entry[sportType]) {
      entry[sportType] = 0
    }
    entry[sportType] += 1
    return acc
  }, monthData)
  const uniqueSportTypes = [...new Set(data.flatMap(month =>
    Object.keys(month).filter(key => key !== 'month')
  ))]
  return (
    <Card title="Monthly Activities" description="total hours per month" total={Math.round(totalActivities / 12)} totalUnits="avg hrs/month" icon={<Timer size={16} strokeWidth={2} />}>
      <ResponsiveContainer height={350} width="90%">
        <BarChart data={data}>
          <XAxis type="category" dataKey="month" tick={{ fontSize: 12 }} />
          <Tooltip />
          {uniqueSportTypes.map((sportType) => (
            <Bar
              key={sportType}
              stackId="stack"
              dataKey={sportType}
              isAnimationActive={false}
              fill={colorPalette[sportType]}
              label={{ position: "top", fontSize: 9 }}
            />
          ))}
          <Legend />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
