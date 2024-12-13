import { useContext, useEffect, useState } from "react"
import { ActivityDataContext, ThemeContext } from "../../contexts/context"
import { SportType } from "../../types/strava"
import { unitConversion } from "../../utils/utils"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend,
} from "recharts"
import { Rocket } from 'lucide-react'

import Card from "../card"
import { UnitDefinitions } from "../../types/activity"
import NoData from "../noData"

type BarChartData = {
  month: string
  [key: string]: number | string
}

/*
 * Total distance per month
*/
export default function Distance() {
  const { activityData, units } = useContext(ActivityDataContext)
  const { darkMode, colorPalette } = useContext(ThemeContext)

  const [data, setData] = useState<BarChartData[]>([])
  const [totalDistance, setTotalDistance] = useState<number>(0)

  useEffect(() => {
    if (!activityData) return
    function calculateDistance() {
      let totalDist = 0
      const res: BarChartData[] = []
      Object.keys(activityData.monthly!).forEach(month => {
        const acts = activityData.monthly![month]!
        const distanceBySport: Record<string, number> = {}
        acts.forEach(a => {
          const sportType = a.sport_type! as SportType
          const distance = Math.round(unitConversion.convertDistance(a.distance!, units))
          if (!distanceBySport[sportType]) {
            distanceBySport[sportType] = 0
          }
          distanceBySport[sportType] += distance
          totalDist += distance
        })
        res.push({ month: month, ...distanceBySport })
      })
      setData(res)
      setTotalDistance(totalDist)
    }
    calculateDistance()
  }, [activityData, units, colorPalette])

  if (data.length === 0) {
    return (
      <Card
        title="Distance"
        description="total distance per month"
        icon={<Rocket size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Distance"
      description="total distance per month"
      total={Math.round(totalDistance)}
      totalUnits={UnitDefinitions[units].distance}
      icon={<Rocket size={16} strokeWidth={2} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <BarChart data={data}>
          <Tooltip />
          <Legend />
          <XAxis
            type="category"
            dataKey="month"
            interval="equidistantPreserveStart"
            tick={{
              fontSize: 12,
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
          />
          {Object.keys(activityData!.bySportType!).map(sport => (
            <Bar
              key={sport}
              radius={[4, 4, 4, 4]}
              stackId="stack"
              dataKey={sport}
              isAnimationActive={false}
              fill={colorPalette[sport]}
              label={{
                position: "top",
                fontSize: 9,
                color: darkMode ? "#c2c2c2" : "#666",
                fill: darkMode ? "#c2c2c2" : "#666",
              }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}