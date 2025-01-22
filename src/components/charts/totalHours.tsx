import { useMemo } from "react"
import { SportType } from "../../types/strava"
import { unitConversion } from "../../utils/utils"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend
} from "recharts"
import { Watch } from "lucide-react"
import NoData from "../common/noData"
import Card from "../common/card"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"
import { ActivityData } from "../../types/activity"
import { CustomPieTooltip } from "../common/customPieTooltip"
import * as Sentry from "@sentry/browser"


type PieChartData = {
  sport: SportType
  hours: number
  color: string
}

export const calculateTotalHours = (data: ActivityData): { chartData: PieChartData[], total: number } => {
  if (Object.keys(data.byType).length === 0) {
    return { chartData: [], total: 0 }
  }

  const res = Object.entries(data.byType).reduce((acc, [sport, activities]) => {
    if (!activities) return acc

    const hoursBySport = activities.reduce((total, act) => {
      if (!act.moving_time) return total
      return total + act.moving_time
    }, 0)

    if (Number(hoursBySport.toFixed(1)) > 0) {
      acc.chartData.push({
        sport: sport as SportType,
        hours: Number(unitConversion.convertTime(hoursBySport, "hours").toFixed(1)),
        color: "#ffffff" // placeholder color, will be updated with colorPalette
      })
      acc.total += hoursBySport
    }

    return acc
  }, { chartData: [] as PieChartData[], total: 0 })

  return {
    chartData: res.chartData,
    total: Number(unitConversion.convertTime(res.total, "hours").toFixed(1))
  }
}

/*
 * Total hours spent per sport
*/
export default function TotalHours() {
  const { activitiesData } = useStravaActivityContext()
  const { colorPalette, darkMode } = useThemeContext()

  const { rawData, totalHours } = useMemo(() => {
    if (Object.keys(activitiesData.byType).length === 0) {
      return { rawData: [], totalHours: 0 }
    }
    try {
      const { chartData, total } = calculateTotalHours(activitiesData)
      return { rawData: chartData, totalHours: total }
    } catch (err) {
      console.warn(err)
      Sentry.captureException(err)
      return { rawData: [], totalHours: 0 }
    }
  }, [activitiesData])

  const { data } = useMemo(() => ({
    data: rawData.map(d => ({
      ...d,
      color: colorPalette[d.sport as SportType]!
    })),
  }), [rawData, colorPalette])

  if (totalHours === 0) {
    return (
      <Card
        title="Total Hours"
        description="total hours spent per sport"
        icon={<Watch size={17} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Total Hours"
      description="total hours spent per sport"
      total={Math.round(totalHours)}
      totalUnits="hours"
      icon={<Watch size={17} strokeWidth={2} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <PieChart>
          <Pie
            label={{ fontSize: 14 }}
            data={data}
            dataKey="hours"
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
          <Legend verticalAlign="bottom" align="center" />
          <Tooltip
            content={(props) => <CustomPieTooltip {...props} />}
            cursor={{ opacity: 0.8, fill: darkMode ? "#1a1a1a" : "#cbd5e1" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}