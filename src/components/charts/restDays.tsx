import { useEffect, useState } from "react"
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

type PieChartData = {
  kind: string
  days: number
  color: string
}

const sanitizeData = (data: ActivityData, currentYear: number, themeColors: readonly string[]): { chartData: PieChartData[], total: number } => {
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
      kind: "active",
      days: activeDays.size,
      color: themeColors[0]
    },
    {
      kind: "rest",
      days: restDays,
      color: themeColors[Math.floor(themeColors.length / 2)]
    }
  ]
  return { chartData: res, total: Number((restDays / totalDaysInYear).toFixed(2)) }
}

/*
 * Rest days vs. active days
 */
export default function RestDays() {
  const { currentYear } = useCurrentYearContext()
  const { activityData } = useStravaActivityContext()
  const { colorPalette, themeColors } = useThemeContext()

  const [data, setData] = useState<PieChartData[]>([])
  const [restPerentage, setRestPercentage] = useState<number>(0)

  useEffect(() => {
    if (!activityData) return
    try {
      // call sanitize function
      const { chartData, total } = sanitizeData(activityData, currentYear, themeColors)
      setData(chartData)
      setRestPercentage(total)
    } catch (err) {
      console.warn(err)
      setData([])
      setRestPercentage(0)
    }
  }, [activityData, colorPalette])

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
      total={restPerentage * 100}
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
            isAnimationActive={false}
            paddingAngle={3}
          >
            {data.map((e, idx) => (
              <Cell key={idx} fill={e.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}