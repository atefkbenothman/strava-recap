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
import { SportType } from "../../types/strava"

type AreaChartData = {
  hour: string
  [key: string]: number | string
}

const sanitizeData = (data: ActivityData): AreaChartData[] => {
  if (!data || !data.all || !data.bySportType || Object.keys(data.bySportType).length === 0) {
    return []
  }
  const sportTypes = Object.keys(data.bySportType)
  const hours: AreaChartData[] = Array(24).fill(0).map((_, idx) => {
    const hourData: AreaChartData = { hour: idx.toString() }
    sportTypes.forEach(sport => {
      hourData[sport] = 0
    })
    return hourData
  })
  data.all.forEach(act => {
    if (act.start_date && act.sport_type) {
      const startHour = new Date(act.start_date).getHours()
      const sportType = act.sport_type as SportType
      hours[startHour][sportType] = (hours[startHour][sportType] as number) + 1
    }
  })
  return hours
}

/*
 * Activity start times
*/
export default function StartTimes() {
  const { activityData } = useStravaActivityContext()
  const { darkMode, colorPalette } = useThemeContext()

  const [data, setData] = useState<AreaChartData[]>([])

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

  console.log(data)

  return (
    <Card
      title="Start Times"
      description="activity start times"
      icon={<Clock size={15} strokeWidth={2.5} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <AreaChart data={data}>
          {activityData?.bySportType &&
            Object.keys(activityData.bySportType).length > 0 &&
            Object.keys(activityData.bySportType).map(sport => (
              <Area
                key={sport}
                type="monotone"
                dataKey={sport}
                stroke={colorPalette[sport as SportType]}
                strokeWidth={3}
                fill={colorPalette[sport as SportType]}
                fillOpacity={0.3}
                isAnimationActive={false}
                label={{
                  position: "top",
                  fontSize: 9,
                  fill: darkMode ? "#c2c2c2" : "#666",
                  formatter: (value: any) => value > 0 ? value : ''
                }}
              />
            ))}
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