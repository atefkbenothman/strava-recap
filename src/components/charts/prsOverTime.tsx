import { useContext, useEffect, useState } from "react"
import { ActivityDataContext, ThemeContext } from "../../contexts/context"
import { getRandomColor } from "../../themes/theme"
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Medal } from 'lucide-react'
import Card from "../card"
import NoData from "../noData"

type AreaChartData = {
  month: string
  prs: number
}


export default function PrsOverTime() {
  const { activityData } = useContext(ActivityDataContext)
  const { theme, colorPalette } = useContext(ThemeContext)

  const [data, setData] = useState<AreaChartData[]>([])
  const [chartColor, setChartColor] = useState<string>("")

  useEffect(() => {
    setChartColor(getRandomColor(theme as readonly string[]))
    if (!activityData) return
    function calculatePrsOverTime() {
      const res: AreaChartData[] = []
      Object.keys(activityData.monthly!).forEach(month => {
        const acts = activityData.monthly![month]!
        const prs = acts.reduce((acc, act) => {
          acc += act.pr_count ?? 0
          return acc
        }, 0)
        res.push({ month, prs })
      })
      setData(res)
    }
    calculatePrsOverTime()
  }, [activityData, colorPalette])

  if (data.length === 0) {
    return (
      <Card
        title="PRs"
        description="prs achieved per month"
        icon={<Medal size={16} strokeWidth={2.5} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="PRs"
      description="prs achieved per month"
      icon={<Medal size={16} strokeWidth={2.5} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <LineChart data={data}>
          <Line
            dataKey="prs"
            stroke={chartColor}
            strokeWidth={2.5}
            type="step"
            isAnimationActive={false}
            label={{ position: "top", fontSize: 9 }}
          />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}