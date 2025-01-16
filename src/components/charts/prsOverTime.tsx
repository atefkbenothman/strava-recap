import { useEffect, useState } from "react"
import {
  AreaChart,
  Area,
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
import { Months } from "../../types/activity"

type AreaChartData = {
  month: string
  [key: string]: number | string
}

const sanitizeData = (data: ActivityData): { chartData: AreaChartData[], total: number } => {
  if (!data || !data.monthly || !data.bySportType || Object.keys(data.monthly).length === 0) {
    return { chartData: [], total: 0 }
  }
  const sportTypes = Object.keys(data.bySportType)
  const res: AreaChartData[] = Months.map(m => {
    const monthData: AreaChartData = { month: m }
    sportTypes.forEach(sport => {
      monthData[sport] = 0
    })
    return monthData
  })
  let totalPrs = 0
  Object.entries(data.monthly!).forEach(([month, activities]) => {
    if (!activities) return
    const prsBySport: Partial<Record<SportType, number>> = {}
    for (const act of activities) {
      if (act.pr_count && act.pr_count > 0) {
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
    Object.entries(prsBySport).forEach(([sport, totalPrs]) => {
      const existingMonth = res.find(item => item.month === month)
      if (!existingMonth) return
      existingMonth[sport] = totalPrs
    })
  })
  return totalPrs > 0 ? { chartData: res, total: totalPrs } : { chartData: [], total: 0 }
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload || !label) {
    return null
  }
  return (
    <div className="bg-white dark:bg-black bg-opacity-90 p-2 rounded flex-col space-y-2">
      <p className="font-bold">{label}</p>
      <div className="flex flex-col gap-1">
        {payload.map((p: any, idx: number) => {
          const dataKey = p.dataKey
          if (p.payload[dataKey] !== 0) {
            return (
              <p key={idx} style={{ color: p.color }}>{p.dataKey}: <span className="font-semibold">{p.payload[dataKey]}</span></p>
            )
          }
          return null
        })}
      </div>
    </div>
  )
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
        title="Personal Records"
        description="prs achieved per month"
        icon={<Medal size={16} strokeWidth={2.5} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Personal Records"
      description="prs achieved per month"
      total={totalPrs}
      totalUnits="prs"
      icon={<Medal size={16} strokeWidth={2.5} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <AreaChart data={data}>
          {activityData?.bySportType &&
            Object.keys(activityData.bySportType).length > 0 &&
            Object.keys(activityData.bySportType).map(sport => (
              <Area
                key={sport}
                type="step"
                dataKey={sport}
                stroke={colorPalette[sport as SportType]}
                strokeWidth={3}
                fill={colorPalette[sport as SportType]}
                fillOpacity={0.3}
                label={{
                  position: "top",
                  fontSize: 9,
                  color: darkMode ? "#c2c2c2" : "#666",
                  fill: darkMode ? "#c2c2c2" : "#666",
                  formatter: (value: any) => value > 0 ? value : ""
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
          <Tooltip content={(props) => <CustomTooltip {...props} />} />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}