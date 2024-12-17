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

type PieChartData = {
  kind: string
  days: number
  color: string
}

/*
 * Rest days vs. active days
 */
export default function RestDays() {
  const { currentYear } = useCurrentYearContext()
  const { activityData } = useStravaActivityContext()
  const { colorPalette, theme, themeColors } = useThemeContext()

  const [data, setData] = useState<PieChartData[]>([])
  const [restPerentage, setRestPercentage] = useState<number>(0)

  useEffect(() => {
    if (!activityData) return
    function formatData() {
      const activeDays = new Set(
        activityData.all!
          .filter(activity => activity.start_date_local!)
          .map(activity => new Date(activity.start_date_local!).toISOString().split('T')[0])
      )
      const startDate = `${currentYear}-01-01`
      const endDate = `${currentYear}-12-31`

      const allDays = [];
      let currentDate = new Date(startDate);
      const lastDate = new Date(endDate);

      while (currentDate <= lastDate) {
        allDays.push(currentDate.toISOString().split('T')[0])
        currentDate.setDate(currentDate.getDate() + 1)
      }

      const restDays = allDays.filter(day => !activeDays.has(day)).length;

      const pieChartData = [
        {
          kind: "active",
          days: activeDays.size,
          color: themeColors[0],
        } as PieChartData,
        {
          kind: "rest",
          days: restDays,
          color: themeColors[themeColors.length - 1]
        } as PieChartData,
      ]

      setData(pieChartData)
      setRestPercentage(Number((restDays / allDays.length).toFixed(2)))
    }
    formatData()
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