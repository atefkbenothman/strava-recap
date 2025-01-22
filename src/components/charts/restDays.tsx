import { useMemo } from "react"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell
} from "recharts"
import { Bed } from "lucide-react"
import Card from "../common/card"
import NoData from "../common/noData"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"
import { useCurrentYearContext } from "../../hooks/useCurrentYearContext"
import { ActivityData } from "../../types/activity"
import { CustomPieTooltip } from "../common/customPieTooltip"
import * as Sentry from "@sentry/browser"


type PieChartData = {
  kind: string
  days: number
  color: string
}

export const calculateRestDays = (
  data: ActivityData,
  currentYear: number
): { chartData: PieChartData[], total: number } => {
  if (!data || !data.all || data.all.length === 0) {
    return { chartData: [], total: 0 }
  }

  const activeDays = new Set<string>()
  for (const act of data.all) {
    if (act.start_date_local) {
      activeDays.add(new Date(act.start_date_local!).toISOString().split("T")[0])
    }
  }

  const totalDaysInYear = new Date(currentYear, 1, 29).getDate() === 29 ? 366 : 365
  const restDays = totalDaysInYear - activeDays.size

  const res: PieChartData[] = [
    {
      kind: "Active",
      days: activeDays.size,
      color: "#ffffff" // placeholder color
    },
    {
      kind: "Rest",
      days: restDays,
      color: "#ffffff" // placeholder color
    }
  ]

  return {
    chartData: res,
    total: Number((restDays / totalDaysInYear).toFixed(2))
  }
}

/*
 * Rest days vs. active days
 */
export default function RestDays() {
  const { currentYear } = useCurrentYearContext()
  const { activitiesData } = useStravaActivityContext()
  const { themeColors, darkMode } = useThemeContext()

  const { rawData, restPercentage } = useMemo(() => {
    if (!activitiesData) {
      return { rawData: [], restPercentage: 0 }
    }
    try {
      const { chartData, total } = calculateRestDays(activitiesData, currentYear)
      return { rawData: chartData, restPercentage: total }
    } catch (err) {
      console.warn(err)
      Sentry.captureException(err)
      return { rawData: [], restPercentage: 0 }
    }
  }, [activitiesData, currentYear])

  const { data } = useMemo(() => ({
    data: rawData.map((d, index) => ({
      ...d,
      color: index === 0 ? themeColors[0] : themeColors[Math.floor(themeColors.length / 2)]
    })),
  }), [rawData, themeColors])

  if (data.length === 0) {
    return (
      <Card
        title="Rest Days"
        description="rest days vs. active days"
        icon={<Bed size={16} strokeWidth={2.5} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Rest Days"
      description="rest days vs. active days"
      total={restPercentage * 100}
      totalUnits="%"
      icon={<Bed size={16} strokeWidth={2.5} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <PieChart>
          <Pie
            label={{ fontSize: 14 }}
            data={data}
            dataKey="days"
            nameKey="kind"
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
          <Legend verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}