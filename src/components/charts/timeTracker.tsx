import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Clock } from 'lucide-react'

import Card from "../card"

export default function TimeTracker() {
  const { activities } = useContext(RecapContext)
  const data = Array(24).fill(0).map((_, index) => ({ name: index.toString(), count: 0 }))
  activities.forEach(activity => {
    const hour = new Date(activity.start_date!).getHours()
    const existingHour = data.find(item => item.name === hour.toString())
    if (existingHour) {
      existingHour.count += 1
    }
  })
  data.sort((a, b) => Number(a.name) - Number(b.name))
  return (
    <Card title="Start Time" description="activity start time" icon={<Clock size={15} strokeWidth={2.5} />}>
      <ResponsiveContainer height={350} width="90%">
        <AreaChart data={data}>
          <Area type="monotone" dataKey="count" stroke="#0369a1" strokeWidth={2} fill="#0284c7" isAnimationActive={false} label={{ position: "top", fontSize: 9 }} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}