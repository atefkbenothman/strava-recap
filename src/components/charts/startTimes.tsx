import { useEffect, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts'
import { Clock } from 'lucide-react'
import Card from "../common/card"
import NoData from "../common/noData"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"
import { ActivityData } from "../../types/activity"

type AreaChartData = {
  hour: string
  activities: number
}

const sanitizeData = (data: ActivityData): AreaChartData[] => {
  if (!data || !data.all || Object.keys(data.all).length === 0) {
    return []
  }
  const hours = Array(24).fill(0)
  data.all.forEach(act => {
    if (act.start_date) {
      const startHour = new Date(act.start_date!).getHours()
      hours[startHour] += 1
    }
  })
  return hours.map((count, idx) => (
    { hour: idx.toString(), activities: count }
  ))
}

/*
 * Activity start times
*/
export default function StartTimes() {
  const { activityData } = useStravaActivityContext()
  const { darkMode, themeColors, colorPalette } = useThemeContext()

  const [data, setData] = useState<AreaChartData[]>([])
  const [chartColor, setChartColor] = useState<string>("")

  useEffect(() => {
    if (!activityData) return
    try {
      const chartData = sanitizeData(activityData)
      setData(chartData)
    } catch (err) {
      console.warn(err)
      setData([])
    }
  }, [activityData])

  useEffect(() => {
    setChartColor(themeColors[Math.floor(themeColors.length / 2)])
  }, [colorPalette])

  if (data.length === 0) {
    return (
      <Card
        title="Start Times"
        description="activity start times"
        icon={<Clock size={15} strokeWidth={2.5} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Start Times"
      description="activity start times"
      icon={<Clock size={15} strokeWidth={2.5} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <AreaChart data={data}>
          <Area
            type="monotone"
            dataKey="activities"
            stroke={chartColor}
            strokeWidth={2}
            fill={chartColor}
            fillOpacity={100}
            isAnimationActive={false}
            label={{
              position: "top",
              fontSize: 9,
              color: darkMode ? "#c2c2c2" : "#666",
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
          />
          <XAxis
            dataKey="hour"
            tick={{
              fontSize: 12,
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
          />
          <ReferenceLine
            x="12"
            stroke={darkMode ? "#c2c2c2" : "black"}
            strokeDasharray="10 10"
            strokeOpacity={0.6}
          />
          <Tooltip />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}