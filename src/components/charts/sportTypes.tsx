import { useMemo } from "react"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { SportType } from "../../types/strava"
import { useThemeContext } from "../../hooks/useThemeContext"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell
} from "recharts"
import { Bike } from "lucide-react"
import Card from "../common/card"
import NoData from "../common/noData"
import { ActivityData } from "../../types/activity"
import { CustomPieTooltip } from "../common/customPieTooltip"
import * as Sentry from "@sentry/browser"


type PieChartData = {
  sport: SportType
  activities: number
  color: string
}

export const calculateSportTypeDistribution = (data: ActivityData): { chartData: PieChartData[], total: number } => {
  if (Object.keys(data.byType).length === 0) {
    return { chartData: [], total: 0 }
  }

  const res = Object.entries(data.byType).reduce((acc, [sport, activities]) => {
    if (!activities) return acc

    acc.chartData.push({
      sport: sport as SportType,
      activities: activities.length,
      color: "#ffffff" // placeholder color, will be updated with colorPalette
    })
    acc.total += 1
    return acc
  }, { chartData: [] as PieChartData[], total: 0 })

  return res.total > 0 ? res : { chartData: [], total: 0 }
}

/*
 * All sport types
*/
export default function SportTypes() {
  const { activitiesData } = useStravaActivityContext()
  const { colorPalette, darkMode } = useThemeContext()

  const { rawData, numSportTypes } = useMemo(() => {
    if (Object.keys(activitiesData.byType).length === 0) {
      return { rawData: [], numSportTypes: 0 }
    }
    try {
      const { chartData, total } = calculateSportTypeDistribution(activitiesData)
      return { rawData: chartData, numSportTypes: total }
    } catch (err) {
      console.warn(err)
      Sentry.captureException(err)
      return { rawData: [], numSportTypes: 0 }
    }
  }, [activitiesData])

  const { data } = useMemo(() => ({
    data: rawData.map(d => ({
      ...d,
      color: colorPalette[d.sport as SportType]!
    })),
  }), [rawData, colorPalette])

  if (data.length === 0) {
    return (
      <Card
        title="Sport Types"
        description="number of activities per sport type"
        icon={<Bike size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Sport Types"
      description="number of activities per sport type"
      total={numSportTypes}
      totalUnits="sports"
      icon={<Bike size={16} strokeWidth={2} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <PieChart>
          <Pie
            label={{ fontSize: 14 }}
            data={data}
            dataKey="activities"
            nameKey="sport"
            innerRadius={50}
            outerRadius={80}
            cornerRadius={4}
            paddingAngle={5}
            isAnimationActive={false}
          >
            {data.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={entry.color}
                stroke={entry.color}
              />
            ))}
          </Pie>
          <Tooltip
            content={(props) => <CustomPieTooltip {...props} />}
            cursor={{ opacity: 0.8, fill: darkMode ? "#1a1a1a" : "#cbd5e1" }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}