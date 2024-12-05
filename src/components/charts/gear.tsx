import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { getRandomColor, unitConversion } from "../../utils/utils"
import { ResponsiveContainer, BarChart, Bar, YAxis, XAxis, Tooltip, Legend, Cell } from "recharts"
import { Wrench } from 'lucide-react'

import Card from "../card"


type BarChartData = {
  gearId: string
  hours: number
}

/*
 * Total time usage for each piece of gear
*/
export default function Gear() {
  const { activityData, theme } = useContext(RecapContext)
  const data: BarChartData[] = []
  activityData.all!.forEach(act => {
    if (act.gear_id !== null) {
      const gearId = act.gear_id!
      const movingTime = Math.round(unitConversion.convertSecondsToHours(act.moving_time!))
      const existingGear = data.find(item => item.gearId === gearId)
      if (existingGear) {
        existingGear.hours += movingTime
      } else {
        data.push({ gearId: gearId, hours: movingTime })
      }
    }
  })
  data.sort((a, b) => b.hours - a.hours)
  return (
    <Card title="Gear" description="total time usage for each gear" icon={<Wrench size={16} strokeWidth={2} />}>
      <ResponsiveContainer height={350} width="90%">
        <BarChart data={data} layout="vertical">
          <Bar dataKey="hours" isAnimationActive={false} label={{ position: "right", fontSize: 12 }}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={getRandomColor(theme.colors as readonly string[])} />
            ))}
          </Bar>
          <YAxis type="category" dataKey="gearId" tick={{ fontSize: 12 }} />
          <XAxis type="number" hide={true} />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </Card >
  )
}