import { useContext, useEffect, useState } from "react"
import { ActivityDataContext, ThemeContext } from "../../contexts/context"
import { SportType } from "../../types/strava"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend
} from "recharts"
import { BicepsFlexed } from 'lucide-react';
import Card from "../card"
import NoData from "../noData";


type BarChartData = {
  month: string
  [key: string]: number | string
}

/*
 * Number of activities per month
*/
export default function ActivityCount() {
  const { activityData } = useContext(ActivityDataContext)
  const { colorPalette } = useContext(ThemeContext)

  const [data, setData] = useState<BarChartData[]>([])
  const [totalActivities, setTotalActivities] = useState<number>(0)

  useEffect(() => {
    if (!activityData) return
    function calculateActivityCount() {
      let totalActs = 0
      const res: BarChartData[] = []
      Object.keys(activityData.monthly!).forEach(month => {
        const acts = activityData.monthly![month]!
        const numActivitiesBySport: Record<string, number> = {}
        acts.forEach((a) => {
          const sportType = a.sport_type! as SportType
          if (!numActivitiesBySport[sportType]) {
            numActivitiesBySport[sportType] = 0
          }
          numActivitiesBySport[sportType] += 1
        })
        res.push({ month: month, ...numActivitiesBySport })
        totalActs += acts.length
      })
      setData(res)
      setTotalActivities(totalActs)
    }
    calculateActivityCount()
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
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          {Object.keys(activityData.bySportType!).map(sport => (
            <Bar
              key={sport}
              radius={[4, 4, 4, 4]}
              stackId="stack"
              dataKey={sport}
              isAnimationActive={false}
              fill={colorPalette[sport]}
              label={{ position: "top", fontSize: 9 }}
            />
          ))}
          <Legend />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
