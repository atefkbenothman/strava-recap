import { useContext, useEffect, useState } from "react"
import { RecapContext } from "../../contexts/recapContext"
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Clock } from 'lucide-react'
import { getRandomColor } from "../../utils/utils"
import Card from "../card"

type AreaChartData = {
  hour: string
  activities: number
}

/*
 * Activity start times
*/
export default function StartTimes() {
  const { activityData, theme, colorPalette } = useContext(RecapContext)

  const [data, setData] = useState<AreaChartData[]>([])
  const [chartColor, setChartColor] = useState<string>("")

  useEffect(() => {
    setChartColor(getRandomColor(theme.colors as readonly string[]))
    if (!activityData) return
    function calculateStartTimes() {
      const res = Array(24).fill(0).map((_, index) => {
        return { hour: index.toString(), activities: 0 } as AreaChartData
      })
      activityData.all!.forEach(activity => {
        const startHour = new Date(activity.start_date!).getHours()
        const existingHour = res.find(item => item.hour === startHour.toString())
        if (existingHour) {
          existingHour.activities += 1
        }
      })
      res.sort((a, b) => Number(a.hour) - Number(b.hour))
      setData(res)
    }
    calculateStartTimes()
  }, [activityData, colorPalette])

  return (
    <Card
      title="Start Times"
      description="activity start times"
      icon={<Clock size={15} strokeWidth={2.5} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <AreaChart data={data}>
          <Area
            type="monotone"
            dataKey="activities"
            stroke={chartColor}
            strokeWidth={2}
            fill={chartColor}
            isAnimationActive={false}
            label={{ position: "top", fontSize: 9 }}
          />
          <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}