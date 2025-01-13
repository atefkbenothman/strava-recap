import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Medal } from 'lucide-react'
import Card from "../common/card"
import NoData from "../common/noData"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"
import { ActivityData } from "../../types/activity"
import { SportType } from "../../types/strava"

type AreaChartData = {
  month: string
  [key: string]: number | string
}

const sanitizeData = (data: ActivityData): { chartData: AreaChartData[], total: number } => {
  if (!data || !data.monthly || Object.keys(data.monthly).length === 0) {
    return { chartData: [], total: 0 }
  }
  const res: AreaChartData[] = []
  let totalPrs = 0
  let hasPrs = false
  Object.entries(data.monthly!).forEach(([month, activities]) => {
    if (!activities) return
    const prsBySport: Partial<Record<SportType, number>> = {}
    for (const act of activities) {
      if (act.pr_count && act.pr_count > 0) {
        hasPrs = true
        const sportType = act.sport_type! as SportType
        const prs = act.pr_count
        if (!prsBySport[sportType]) {
          prsBySport[sportType] = prs
        } else {
          prsBySport[sportType] += prs
        }
        totalPrs += prs
      }
    }
    res.push({ month, ...prsBySport })
  })
  if (hasPrs) {
    return { chartData: res, total: totalPrs }
  }
  return { chartData: [], total: 0 }
}

/*
 * PRs achieved per month
 */
export default function PrsOverTime() {
  const { activityData } = useStravaActivityContext()
  const { darkMode, colorPalette } = useThemeContext()

  const [data, setData] = useState<AreaChartData[]>([])
  const [totalPrs, setTotalPrs] = useState<number>(0)

  useEffect(() => {
    if (!activityData) return
    try {
      const { chartData, total } = sanitizeData(activityData)
      setData(chartData)
      setTotalPrs(total)
    } catch (err) {
      console.warn(err)
      setData([])
      setTotalPrs(0)
    }
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
      total={totalPrs}
      totalUnits="prs"
      icon={<Medal size={16} strokeWidth={2.5} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <LineChart data={data}>
          {activityData?.bySportType &&
            Object.keys(activityData.bySportType).length > 0 &&
            Object.keys(activityData.bySportType).map(sport => (
              <Line
                key={sport}
                dataKey={sport}
                stroke={colorPalette[sport as SportType]}
                strokeWidth={2.5}
                type="step"
                isAnimationActive={false}
                label={{
                  position: "top",
                  fontSize: 9,
                  color: darkMode ? "#c2c2c2" : "#666",
                  fill: darkMode ? "#c2c2c2" : "#666",
                }}
              />
            ))}
          <XAxis
            dataKey="month"
            tick={{
              fontSize: 12,
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
          />
          <Tooltip />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}