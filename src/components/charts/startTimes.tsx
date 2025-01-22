import { useMemo } from "react"
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
import { SportType } from "../../types/strava"
import { ActivityData } from "../../types/activity"
import * as Sentry from "@sentry/browser"


type AreaChartData = {
  hour: string
  [key: string]: number | string
}

type TooltipProps = {
  active?: boolean
  payload?: any[]
  label?: string
}

export const calculateStartTimes = (data: ActivityData): AreaChartData[] => {
  if (Object.keys(data.byType).length === 0) {
    return []
  }

  const sportTypes = Object.keys(data.byType)
  const hours: AreaChartData[] = Array(24).fill(0).map((_, idx) => ({
    hour: idx.toString(),
    ...Object.fromEntries(sportTypes.map(sport => [sport, 0]))
  }))

  data.all.forEach(act => {
    if (act.start_date && act.sport_type) {
      const startHour = new Date(act.start_date).getHours()
      const sportType = act.sport_type as SportType
      hours[startHour][sportType] = (hours[startHour][sportType] as number) + 1
    }
  })

  return hours
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload || !label) return null

  return (
    <div className="bg-white dark:bg-black bg-opacity-90 p-2 rounded flex-col space-y-2">
      <p className="font-bold">{label}:00</p>
      <div className="flex flex-col gap-1">
        {payload.map((p: any, idx: number) => {
          const value = p.payload[p.dataKey]
          if (value === 0) return null

          return (
            <p key={idx} style={{ color: p.color }}>
              {p.dataKey}: <span className="font-semibold">{value}</span>
            </p>
          )
        })}
      </div>
    </div>
  )
}

/*
 * Activity start times
*/
export default function StartTimes() {
  const { activitiesData } = useStravaActivityContext()
  const { darkMode, colorPalette } = useThemeContext()

  const data = useMemo(() => {
    if (!activitiesData) return []
    try {
      return calculateStartTimes(activitiesData)
    } catch (err) {
      console.warn(err)
      Sentry.captureException(err)
      return []
    }
  }, [activitiesData])

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
          {activitiesData?.byType &&
            Object.keys(activitiesData.byType).map(sport => (
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
                isAnimationActive={false}
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
          <Tooltip content={CustomTooltip} />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}