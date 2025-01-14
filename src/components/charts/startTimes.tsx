import { useEffect, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
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

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload || !label) {
    return null
  }
  return (
    <div className="bg-white dark:bg-black bg-opacity-90 p-2 rounded flex-col space-y-2">
      <p className="font-bold">{label}:00</p>
      <div className="flex flex-col gap-1">
        {payload.map((p: any, idx: number) => {
          const dataKey = p.dataKey
          if (p.payload[dataKey] !== 0) {
            return (
              <p key={idx} style={{ color: p.color }}>{p.dataKey}: <span className="font-semibold">{p.payload[dataKey]}</span></p>
            )
          }
          return null
        })}
      </div>
    </div>
  )
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
                type="step"
                dataKey={sport}
                stroke={colorPalette[sport as SportType]}
                strokeWidth={3}
                fill={colorPalette[sport as SportType]}
                fillOpacity={0.3}
                label={{
                  position: "top",
                  fontSize: 9,
                  fill: darkMode ? "#c2c2c2" : "#666",
                  color: darkMode ? "#c2c2c2" : "#666",
                  formatter: (value: any) => value > 0 ? value : ""
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
          <Tooltip content={(props) => <CustomTooltip {...props} />} />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}