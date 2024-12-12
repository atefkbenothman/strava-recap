import { useContext, useEffect, useState } from "react"
import { RecapContext } from "../../contexts/recapContext"
import {
  ResponsiveContainer,
  RadialBarChart,
  Legend,
  Tooltip,
  RadialBar
} from "recharts"
import { unitConversion } from "../../utils/utils"
import { Ruler } from 'lucide-react'
import Card from "../card"


type RadialBarChartData = {
  name: string
  activities: number
  fill: string
}

const getDistanceRanges = (units: string) => {
  if (units === "imperial") {
    return [
      { name: "1-20", min: 1, max: 20 },
      { name: "21-40", min: 21, max: 40 },
      { name: "41-70", min: 41, max: 70 },
      { name: "70-100", min: 70, max: 100 },
      { name: "100+", min: 100, max: Infinity },
    ]
  } else {
    return [
      { name: "1-32", min: 1, max: 32 },
      { name: "33-64", min: 33, max: 64 },
      { name: "65-112", min: 65, max: 112 },
      { name: "113-160", min: 113, max: 160 },
      { name: "160+", min: 160, max: Infinity },
    ]
  }
}

/*
 * Number of activities that are within a certain distance range
*/
export default function DistanceRanges() {
  const { activityData, theme, units } = useContext(RecapContext)

  const [data, setData] = useState<RadialBarChartData[]>([])

  useEffect(() => {
    if (!activityData) return
    function formatData() {
      const currentRanges = getDistanceRanges(units)
      const res = currentRanges.map((range, index) => {
        const activitiesInRange = activityData.all!.filter(activity => {
          const distance = unitConversion.convertDistance(activity.distance!, units)
          return distance >= range.min && distance < range.max
        })
        return { name: range.name, activities: activitiesInRange.length, fill: theme[index] } as RadialBarChartData
      })
      setData(res)
    }
    formatData()
  }, [activityData, theme, units])

  return (
    <Card
      title="Distance Ranges"
      description="number of activities within a distance range"
      icon={<Ruler size={16} strokeWidth={2} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <RadialBarChart
          height={350}
          innerRadius="10%"
          outerRadius="80%"
          data={data}
          startAngle={180}
          endAngle={-180}
        >
          <RadialBar
            label={{ fontSize: 12, position: "bottom", fill: "#000000" }}
            background={{ fill: "#e5e7eb" }}
            dataKey="activities"
          />
          <Legend
            verticalAlign="bottom"
            layout="horizontal"
            align="center"
          />
          <Tooltip />
        </RadialBarChart>
      </ResponsiveContainer>
    </Card>
  )
}