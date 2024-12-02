import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { ResponsiveContainer, RadialBarChart, Legend, Tooltip, RadialBar } from "recharts"
import { unitConversion } from "../../utils/utils"
import { Ruler } from 'lucide-react'

import Card from "../card"


const distanceRanges = [
  { name: "-", min: 0, max: 0 },
  { name: "1-20", min: 1, max: 20 },
  { name: "21-40", min: 21, max: 40 },
  { name: "41-70", min: 41, max: 70 },
  { name: "70-100", min: 70, max: 100 },
  { name: "100+", min: 100, max: Infinity }
]

export default function Distances() {
  const { activities, theme } = useContext(RecapContext)
  const data = distanceRanges.map((range, index) => {
    const activitiesInRange = activities.filter(activity => {
      const distance = unitConversion.convertFromMetersToMi(activity.distance!)
      return distance >= range.min && distance < range.max
    })
    return {
      name: range.name,
      count: activitiesInRange.length,
      fill: theme.colors[index]
    }
  })
  return (
    <Card title="Distances" description="number of activities per distance" icon={<Ruler size={16} strokeWidth={2} />}>
      <ResponsiveContainer height={350} width="90%">
        <RadialBarChart
          height={350}
          innerRadius="10%"
          outerRadius="80%"
          data={data}
          startAngle={180}
          endAngle={-180}
        >
          <RadialBar label={{ fontSize: 12, position: "bottom", fill: "#000000" }} background={{ fill: "#e5e7eb" }} dataKey="count" />
          <Legend verticalAlign="bottom" layout="horizontal" align="center" />
          <Tooltip />
        </RadialBarChart>
      </ResponsiveContainer>
    </Card>
  )
}