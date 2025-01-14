import { useEffect, useState } from "react"
import {
  ResponsiveContainer,
  RadialBarChart,
  Legend,
  Tooltip,
  RadialBar
} from "recharts"
import { unitConversion } from "../../utils/utils"
import { Ruler } from 'lucide-react'
import Card from "../common/card"
import NoData from "../common/noData"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"
import { ActivityData, Units } from "../../types/activity"


type RadialBarChartData = {
  name: string
  activities: number
  fill: string
}

const distanceRanges = [
  { name: "0-4", min: 0, max: 5 },
  { name: "5-9", min: 5, max: 10 },
  { name: "10-19", min: 10, max: 20 },
  { name: "20-39", min: 20, max: 40 },
  { name: "40-69", min: 40, max: 70 },
  { name: "70-99", min: 40, max: 100 },
  { name: "100+", min: 100, max: Infinity },
]

const sanitizeData = (data: ActivityData, units: Units, themeColors: readonly string[]): RadialBarChartData[] => {
  if (!data || !data.all || data.all.length === 0) {
    return []
  }
  const res = distanceRanges.map((dr, idx) => {
    return { name: dr.name, activities: 0, fill: themeColors[idx] }
  })
  let hasData = false
  data.all.forEach(act => {
    if (act.distance) {
      const distance = Number(unitConversion.convertDistance(act.distance!, units).toFixed(2))
      const existingDistanceRange = distanceRanges.find(item => distance >= item.min && distance < item.max)
      if (!existingDistanceRange) return
      const existingData = res.find(item => item.name === existingDistanceRange.name)
      if (!existingData) return
      existingData.activities += 1
      hasData = true
    }
  })
  return hasData ? res : []
}

export const CustomRadialTooltip: React.FC<any> = ({ active, payload }) => {
  if (!active || !payload) {
    return null
  }
  const payloadName = payload[0].payload.name ?? ""
  return (
    <div className="bg-white dark:bg-black bg-opacity-90 p-2 rounded flex-col space-y-2">
      <p className="font-bold">{payloadName}</p>
      <div className="flex flex-col gap-1">
        {payload.map((p: any, idx: number) => {
          const dataKey = p.dataKey
          if (p.payload[dataKey] !== 0) {
            return (
              <p key={idx} style={{ color: p.payload.fill }}>{p.name}: <span className="font-semibold">{Number(p.payload[dataKey].toFixed(2))}</span></p>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}

/*
 * Number of activities that are within a certain distance range
*/
export default function DistanceRanges() {
  const { activityData, units } = useStravaActivityContext()
  const { themeColors, darkMode } = useThemeContext()

  const [data, setData] = useState<RadialBarChartData[]>([])

  useEffect(() => {
    if (!activityData) return
    try {
      const chartData = sanitizeData(activityData, units, themeColors)
      setData(chartData)
    } catch (err) {
      console.warn(err)
      setData([])
    }
  }, [activityData, themeColors, units])

  if (data.length === 0) {
    return (
      <Card
        title="Distance Ranges"
        description="number of activities within a distance range"
        icon={<Ruler size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

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
            label={{ fontSize: 12, position: "bottom", fill: darkMode ? "#ffffff" : "#000000" }}
            background={{ fill: darkMode ? "#232527" : "#e5e7eb" }}
            dataKey="activities"
            cornerRadius={4}
          />
          <Legend
            verticalAlign="bottom"
            layout="horizontal"
            align="center"
          />
          <Tooltip
            content={(props) => <CustomRadialTooltip {...props} />}
            cursor={{ opacity: 0.8, fill: darkMode ? "#1a1a1a" : "#cbd5e1" }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </Card>
  )
}