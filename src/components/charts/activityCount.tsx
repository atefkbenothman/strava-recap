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


type BarChartData = {
  month: string
  [key: string]: number | string
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
    function calculateActivityCount() {
      if (!activityData) return
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
            tick={{
              fontSize: 12,
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
          />
          <Tooltip />
          {activityData && Object.keys(activityData.bySportType!).map(sport => (
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
              }}
            />
          ))}
          <Legend />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
