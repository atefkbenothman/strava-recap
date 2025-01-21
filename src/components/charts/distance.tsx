import { useMemo } from "react"
import { SportType } from "../../types/strava"
import { unitConversion } from "../../utils/utils"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend
} from "recharts"
import { Rocket } from 'lucide-react'
import Card from "../common/card"
import { ActivitiesByMonth, UnitDefinitions } from "../../types/activity"
import NoData from "../common/noData"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"
import { CustomBarTooltip } from "../common/customBarTooltip"
import { BarChartData, convertMonthlyChartDataUnits } from "../../utils/utils"


export const calculateMonthlyDistances = (monthlyData: ActivitiesByMonth): { chartData: BarChartData[], total: number } => {
  const res = Object.entries(monthlyData).reduce((acc, [month, acts]) => {
    let totalDistanceBySport = 0
    const distanceBySport = acts.reduce((acc, act) => {
      if (!act.distance || act.distance < 10) return acc
      const sportType = act.sport_type! as SportType
      const distance = Number(act.distance.toFixed(2))
      if (!acc[sportType]) {
        acc[sportType] = distance
      } else {
        acc[sportType] = Number((distance + acc[sportType]).toFixed(2))
      }
      totalDistanceBySport = Number((distance + totalDistanceBySport).toFixed(2))
      return acc
    }, {} as Partial<Record<SportType, number>>)
    acc.chartData.push({ month, ...distanceBySport })
    acc.total = Number((acc.total + totalDistanceBySport).toFixed(2))
    return acc
  }, { chartData: [] as BarChartData[], total: 0 })
  return res.total > 0 ? res : { chartData: [], total: 0 }
}


/*
 * Total distance per month
*/
export default function Distance() {
  const { activitiesData, units } = useStravaActivityContext()
  const { darkMode, colorPalette } = useThemeContext()

  const rawData = useMemo(() => {
    if (!activitiesData.byMonth) {
      return { data: [], totalDistance: 0 }
    }
    try {
      const { chartData, total } = calculateMonthlyDistances(activitiesData.byMonth)
      return { data: chartData, totalDistance: total }
    } catch (err) {
      console.warn(err)
      return { data: [], totalDistance: 0 }
    }
  }, [activitiesData])

  const { data, totalDistance } = useMemo(() => {
    const convertedChartData = convertMonthlyChartDataUnits(rawData.data, units, unitConversion.convertDistance)
    const convertedTotal = Number(unitConversion.convertDistance(rawData.totalDistance, units).toFixed(2))
    return {
      data: convertedChartData,
      totalDistance: convertedTotal
    }
  }, [rawData, units])

  if (totalDistance === 0) {
    return (
      <Card
        title="Distance"
        description="total distance per month"
        icon={<Rocket size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Distance"
      description="total distance per month"
      total={Math.round(totalDistance)}
      totalUnits={UnitDefinitions[units].distance}
      icon={<Rocket size={16} strokeWidth={2} />}
    >
      <ResponsiveContainer
        height={350}
        width="90%"
      >
        <BarChart data={data}>
          <Tooltip
            content={(props) => <CustomBarTooltip {...props} />}
            cursor={{ opacity: 0.8, fill: darkMode ? "#1a1a1a" : "#cbd5e1" }}
          />
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