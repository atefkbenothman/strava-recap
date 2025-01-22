import { useMemo } from "react"
import { SportType } from "../../types/strava"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend
} from "recharts"
import { BicepsFlexed } from 'lucide-react'
import Card from "../common/card"
import { ActivitiesByMonth } from "../../types/activity"
import NoData from "../common/noData"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"
import { CustomBarTooltip } from "../common/customBarTooltip"
import { BarChartData } from "../../utils/utils"
import * as Sentry from "@sentry/browser"


export const calculateMonthlyActivities = (monthlyData: ActivitiesByMonth): { chartData: BarChartData[], total: number } => {
  const res = Object.entries(monthlyData).reduce((acc, [month, acts]) => {
    let totalActivitiesBySport = 0
    const activitiesBySport = acts.reduce((acc, act) => {
      const sportType = act.sport_type! as SportType
      if (!acc[sportType]) {
        acc[sportType] = 1
      } else {
        acc[sportType] += 1
      }
      totalActivitiesBySport += 1
      return acc
    }, {} as Partial<Record<SportType, number>>)
    acc.chartData.push({ month, ...activitiesBySport })
    acc.total = acc.total + totalActivitiesBySport
    return acc
  }, { chartData: [] as BarChartData[], total: 0 })
  return res.total > 0 ? res : { chartData: [], total: 0 }
}

/*
 * Number of activities per month
*/
export default function ActivityCount() {
  const { activitiesData } = useStravaActivityContext()
  const { darkMode, colorPalette } = useThemeContext()

  const { data, totalActivities } = useMemo(() => {
    if (!activitiesData.byMonth) {
      return { data: [], totalActivities: 0 }
    }
    try {
      const { chartData, total } = calculateMonthlyActivities(activitiesData.byMonth)
      return { data: chartData, totalActivities: total }
    } catch (err) {
      console.warn(err)
      Sentry.captureException(err)
      return { data: [], totalActivities: 0 }
    }
  }, [activitiesData])

  if (totalActivities === 0) {
    return (
      <Card
        title="Activity Count"
        description="number of activities per month"
        icon={<BicepsFlexed size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Activity Count"
      description="number of activities per month"
      total={totalActivities}
      totalUnits="activities"
      icon={<BicepsFlexed size={16} strokeWidth={2} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <BarChart data={data}>
          <XAxis
            type="category"
            dataKey="month"
            interval="equidistantPreserveStart"
            tick={{
              fontSize: 12,
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
          />
          <Tooltip
            content={(props) => <CustomBarTooltip {...props} />}
            cursor={{ opacity: 0.8, fill: darkMode ? "#1a1a1a" : "#cbd5e1" }}
          />
          {activitiesData?.byType &&
            Object.keys(activitiesData.byType).length > 0 &&
            Object.keys(activitiesData.byType).map(sport => (
              <Bar
                key={sport}
                radius={[4, 4, 4, 4]}
                stackId="stack"
                dataKey={sport}
                fill={colorPalette[sport as SportType]}
                label={{
                  position: "top",
                  fontSize: 9,
                  color: darkMode ? "#c2c2c2" : "#666",
                  fill: darkMode ? "#c2c2c2" : "#666",
                  formatter: (value: number) => value > 0 ? Number(value).toFixed(0) : ''
                }}
                isAnimationActive={false}
              />
            ))}
          <Legend />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}