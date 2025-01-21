import { useMemo } from "react"
import { unitConversion } from "../../utils/utils"
import { SportType } from "../../types/strava"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend,
} from "recharts"
import { Mountain } from "lucide-react"
import Card from "../common/card"
import { UnitDefinitions, ActivitiesByMonth } from "../../types/activity"
import NoData from "../common/noData"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"
import { CustomBarTooltip } from "../common/customBarTooltip"
import { BarChartData, convertMonthlyChartDataUnits } from "../../utils/utils"


export const calculateMonthlyElevation = (monthlyData: ActivitiesByMonth): { chartData: BarChartData[], total: number } => {
  const res = Object.entries(monthlyData).reduce((acc, [month, acts]) => {
    let totalElevationBySport = 0
    const elevationBySport = acts.reduce((acc, act) => {
      if (!act.total_elevation_gain || act.total_elevation_gain <= 0) return acc
      const sportType = act.sport_type! as SportType
      const elevation = Number(act.total_elevation_gain.toFixed(2))
      if (elevation === 0) return acc
      if (!acc[sportType]) {
        acc[sportType] = elevation
      } else {
        acc[sportType] = Number((elevation + acc[sportType]).toFixed(2))
      }
      totalElevationBySport = Number((elevation + totalElevationBySport).toFixed(2))
      return acc
    }, {} as Partial<Record<SportType, number>>)
    acc.chartData.push({ month, ...elevationBySport })
    acc.total = Number((acc.total + totalElevationBySport).toFixed(2))
    return acc
  }, { chartData: [] as BarChartData[], total: 0 })
  return res.total > 0 ? res : { chartData: [], total: 0 }
}

/*
 * Monthly Elevation
*/
export default function Elevation() {
  const { activitiesData, units } = useStravaActivityContext()
  const { darkMode, colorPalette } = useThemeContext()

  const rawData = useMemo(() => {
    if (!activitiesData.byMonth) {
      return { data: [], totalElevation: 0 }
    }
    try {
      const { chartData, total } = calculateMonthlyElevation(activitiesData.byMonth)
      return { data: chartData, totalElevation: total }
    } catch (err) {
      console.warn(err)
      return { data: [], totalElevation: 0 }
    }
  }, [activitiesData])

  const { data, totalElevation } = useMemo(() => {
    const convertedChartData = convertMonthlyChartDataUnits(rawData.data, units, unitConversion.convertElevation)
    const convertedTotal = Number(unitConversion.convertElevation(rawData.totalElevation, units).toFixed(2))
    return {
      data: convertedChartData,
      totalElevation: convertedTotal
    }
  }, [rawData, units])

  if (totalElevation === 0) {
    return (
      <Card
        title="Elevation"
        description="total elevation per month"
        icon={<Mountain size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Elevation"
      description="total elevation per month"
      total={Math.round(totalElevation)}
      totalUnits={UnitDefinitions[units].elevation}
      icon={<Mountain size={16} strokeWidth={2} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <BarChart data={data}>
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