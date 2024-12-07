import { useContext, useEffect, useState } from "react"
import { RecapContext } from "../../contexts/recapContext"
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


type BarChartData = {
  month: string
  [key: string]: number | string
}

/*
 * Number of activities per month
*/
export default function ActivityCount() {
  const { activityData, colorPalette } = useContext(RecapContext)

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
  }, [activityData])


  return (
    <Card
      title="Activity Count"
      description="number of activities per month"
      total={totalActivities}
      totalUnits="activities"
      icon={<BicepsFlexed size={16} strokeWidth={2}
      />}>
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
