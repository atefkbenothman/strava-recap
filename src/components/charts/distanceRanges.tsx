import { useMemo } from "react"
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

type TooltipProps = {
  active?: boolean
  payload?: any[]
}

const DISTANCE_RANGES = [
  { name: "0-4", min: 0, max: 5 },
  { name: "5-9", min: 5, max: 10 },
  { name: "10-19", min: 10, max: 20 },
  { name: "20-39", min: 20, max: 40 },
  { name: "40-69", min: 40, max: 70 },
  { name: "70-99", min: 40, max: 100 },
  { name: "100+", min: 100, max: Infinity },
] as const

export const calculateDistanceRanges = (data: ActivityData, units: Units): RadialBarChartData[] => {
  if (!data?.all?.length) return []

  const ranges = DISTANCE_RANGES.map(dr => ({
    name: dr.name,
    activities: 0,
    fill: "#ffffff" // placeholder color
  }))

  const hasActivities = data.all.reduce((hasData, act) => {
    if (!act.distance) return hasData

    const distance = Number(unitConversion.convertDistance(act.distance, units).toFixed(2))
    const range = DISTANCE_RANGES.find(r => distance >= r.min && distance < r.max)

    if (range) {
      const rangeData = ranges.find(r => r.name === range.name)
      if (rangeData) {
        rangeData.activities += 1
        return true
      }
    }

    return hasData
  }, false)

  return hasActivities ? ranges : []
}

const CustomRadialTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload) return null

  const { name, fill, activities } = payload[0].payload

  return (
    <div className="bg-white dark:bg-black bg-opacity-90 p-2 rounded flex-col space-y-2">
      <p className="font-bold">{name}</p>
      <p style={{ color: fill }}>
        Activities: <span className="font-semibold">{activities}</span>
      </p>
    </div>
  )
}

/*
 * Number of activities that are within a certain distance range
*/
export default function DistanceRanges() {
  const { activitiesData, units } = useStravaActivityContext()
  const { themeColors, darkMode } = useThemeContext()

  const rawData = useMemo(() => {
    if (!activitiesData) return []

    try {
      return calculateDistanceRanges(activitiesData, units)
    } catch (err) {
      console.warn(err)
      return []
    }
  }, [activitiesData, units])

  const data = useMemo(() =>
    rawData.map((item, index) => ({
      ...item,
      fill: themeColors[index]
    }))
    , [rawData, themeColors])

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
            isAnimationActive={false}
          />
          <Legend
            verticalAlign="bottom"
            layout="horizontal"
            align="center"
          />
          <Tooltip
            content={CustomRadialTooltip}
            cursor={{ opacity: 0.8, fill: darkMode ? "#1a1a1a" : "#cbd5e1" }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </Card>
  )
}