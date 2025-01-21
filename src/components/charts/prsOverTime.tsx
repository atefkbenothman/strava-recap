import { useMemo } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Medal } from 'lucide-react'
import Card from "../common/card"
import NoData from "../common/noData"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"
import { SportType } from "../../types/strava"
import { ActivityData, MONTHS } from "../../types/activity"

type AreaChartData = {
  month: string
  [key: string]: number | string
}

type TooltipProps = {
  active?: boolean
  payload?: any[]
  label?: string
}

export const calculatePRsOverTime = (data: ActivityData): { chartData: AreaChartData[], total: number } => {
  if (!data?.byMonth) {
    return { chartData: [], total: 0 }
  }

  const sportTypes = Object.keys(data.byType)
  const monthsData: AreaChartData[] = MONTHS.map(month => ({
    month,
    ...Object.fromEntries(sportTypes.map(sport => [sport, 0]))
  }))

  const { chartData, totalPrs } = Object.entries(data.byMonth).reduce((acc, [month, activities]) => {
    if (!activities) return acc

    activities.forEach(act => {
      if (act.pr_count && act.pr_count > 0 && act.sport_type) {
        const monthData = acc.chartData.find(item => item.month === month)
        if (monthData) {
          monthData[act.sport_type] = (monthData[act.sport_type] as number || 0) + act.pr_count
          acc.totalPrs += act.pr_count
        }
      }
    })

    return acc
  }, { chartData: monthsData, totalPrs: 0 })

  return totalPrs > 0 ? { chartData, total: totalPrs } : { chartData: [], total: 0 }
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload || !label) return null

  return (
    <div className="bg-white dark:bg-black bg-opacity-90 p-2 rounded flex-col space-y-2">
      <p className="font-bold">{label}</p>
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
 * PRs achieved per month
 */
export default function PrsOverTime() {
  const { activitiesData } = useStravaActivityContext()
  const { darkMode, colorPalette } = useThemeContext()

  const { data, totalPrs } = useMemo(() => {
    if (!activitiesData) {
      return { data: [], totalPrs: 0 }
    }

    try {
      const { chartData, total } = calculatePRsOverTime(activitiesData)
      return { data: chartData, totalPrs: total }
    } catch (err) {
      console.warn(err)
      return { data: [], totalPrs: 0 }
    }
  }, [activitiesData])

  if (data.length === 0) {
    return (
      <Card
        title="Personal Records"
        description="prs achieved per month"
        icon={<Medal size={16} strokeWidth={2.5} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Personal Records"
      description="prs achieved per month"
      total={totalPrs}
      totalUnits="prs"
      icon={<Medal size={16} strokeWidth={2.5} />}
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
                  color: darkMode ? "#c2c2c2" : "#666",
                  fill: darkMode ? "#c2c2c2" : "#666",
                  formatter: (value: any) => value > 0 ? value : ""
                }}
                isAnimationActive={false}
              />
            ))}
          <XAxis
            type="category"
            dataKey="month"
            interval="equidistantPreserveStart"
            tick={{
              fontSize: 12,
              color: darkMode ? "#c2c2c2" : "#666",
              fill: darkMode ? "#c2c2c2" : "#666",
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