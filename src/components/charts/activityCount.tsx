import { useEffect, useState } from "react"
import { SportType } from "../../types/strava"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext";
import { useThemeContext } from "../../hooks/useThemeContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend
} from "recharts"
import { BicepsFlexed } from 'lucide-react';
import Card from "../common/card"
import NoData from "../common/noData";
import { ActivityData } from "../../types/activity";


type BarChartData = {
  month: string
  [key: string]: number | string
}

const sanitizeData = (data: ActivityData): { chartData: BarChartData[], total: number } => {
  if (!data || !data.monthly || Object.keys(data.monthly).length === 0) {
    return { chartData: [], total: 0 }
  }
  const res: BarChartData[] = []
  let totalActivities = 0
  const monthlyActivities = data.monthly!
  Object.entries(monthlyActivities).forEach(([month, activities]) => {
    if (!activities) return
    const activitiesBySport: Partial<Record<SportType, number>> = {}
    for (const act of activities) {
      const sportType = act.sport_type! as SportType
      if (!activitiesBySport[sportType]) {
        activitiesBySport[sportType] = 1
      } else {
        activitiesBySport[sportType] += 1
      }
      totalActivities += 1
    }
    res.push({ month, ...activitiesBySport })
  })
  return { chartData: res, total: totalActivities }
}

/*
 * Number of activities per month
*/
export default function ActivityCount() {
  const { activityData } = useStravaActivityContext()
  const { darkMode, colorPalette } = useThemeContext()

  const [data, setData] = useState<BarChartData[]>([])
  const [totalActivities, setTotalActivities] = useState<number>(0)

  useEffect(() => {
    if (!activityData) return
    try {
      const { chartData, total } = sanitizeData(activityData)
      setData(chartData)
      setTotalActivities(total)
    } catch (err) {
      console.warn(err)
      setData([])
      setTotalActivities(0)
    }
  }, [activityData, colorPalette])

  if (data.length === 0) {
    return (
      <Card
        title="Activity Count"
        description="number of activities per month"
        icon={<BicepsFlexed size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Activity Count"
      description="number of activities per month"
      total={totalActivities}
      totalUnits="activities"
      icon={<BicepsFlexed size={16} strokeWidth={2} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <BarChart data={data}>
          <XAxis
            type="category"
            dataKey="month"
            tick={{
              fontSize: 12,
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
          />
          <Tooltip formatter={d => Number(d).toFixed(0)} />
          {activityData?.bySportType &&
            Object.keys(activityData.bySportType).length > 0 &&
            Object.keys(activityData.bySportType).map(sport => (
              <Bar
                key={sport}
                radius={[4, 4, 4, 4]}
                stackId="stack"
                dataKey={sport}
                isAnimationActive={false}
                fill={colorPalette[sport as SportType]}
                label={{
                  position: "top",
                  fontSize: 9,
                  color: darkMode ? "#c2c2c2" : "#666",
                  fill: darkMode ? "#c2c2c2" : "#666",
                  formatter: ((d: string) => Number(d).toFixed(0))
                }}
              />
            ))}
          <Legend />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
