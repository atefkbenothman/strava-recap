import { useEffect, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Clock } from 'lucide-react'
import Card from "../common/card"
import NoData from "../common/noData"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"

type AreaChartData = {
  hour: string
  activities: number
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
    function calculateStartTimes() {
      if (!activityData) return
      setChartColor(themeColors[themeColors.length - 1])
      const res = Array(24).fill(0).map((_, index) => {
        return { hour: index.toString(), activities: 0 } as AreaChartData
      })
      activityData.all!.forEach(activity => {
        const startHour = new Date(activity.start_date!).getHours()
        const existingHour = res.find(item => item.hour === startHour.toString())
        if (existingHour) {
          existingHour.activities += 1
        }
      })
      res.sort((a, b) => Number(a.hour) - Number(b.hour))
      setData(res)
    }
    calculateStartTimes()
  }, [activityData, colorPalette])

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
          <Tooltip />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}