import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { getRandomColor, unitConversion } from "../../utils/utils"
import { ResponsiveContainer, BarChart, Bar, YAxis, XAxis, Tooltip, Legend, Cell } from "recharts"
import { Wrench } from 'lucide-react'

import Card from "../card"


type ChartData = {
  gearId: string
  time: number
}

export default function GearUsage() {
  const { activities, theme } = useContext(RecapContext)
  const data: ChartData[] = []
  activities.forEach(activity => {
    if (activity.gear_id !== null) {
      const gearId = activity.gear_id!
      const existingGear = data.find(g => g.gearId === gearId)
      const movingTime = Number(Math.round(unitConversion.convertSecondsToHours(activity.moving_time!)))
      if (existingGear) {
        existingGear.time += movingTime
      } else {
        data.push({ gearId, time: movingTime })
      }
    }
  })
  data.sort((a, b) => b.time - a.time)
  return (
    <Card title="Gear" description="total time usage for each gear" icon={<Wrench size={16} strokeWidth={2} />}>
      <ResponsiveContainer height={350} width="90%">
        <BarChart data={data} layout="vertical">
          <Bar dataKey="time" isAnimationActive={false} label={{ position: "right", fontSize: 12 }}>
            {
              data.map((entry, idx) => (
                <Cell key={idx} fill={getRandomColor(theme.colors as readonly string[])} />
              ))
            }
          </Bar>
          <YAxis type="category" dataKey="gearId" tick={{ fontSize: 12 }} />
          <XAxis type="number" hide={true} />
          <Legend />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </Card >
  )
}