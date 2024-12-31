import { useEffect, useState } from "react"
import { SportType } from "../../types/strava"
import { unitConversion } from "../../utils/utils"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts"
import { Rocket } from 'lucide-react'

import Card from "../common/card"
import { UnitDefinitions } from "../../types/activity"
import NoData from "../common/noData"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"

type BarChartData = {
  month: string
  [key: string]: number | string
}

/*
 * Total distance per month
*/
export default function Distance() {
  const { activityData, units } = useStravaActivityContext()
  const { darkMode, colorPalette } = useThemeContext()

  const [data, setData] = useState<BarChartData[]>([])
  const [totalDistance, setTotalDistance] = useState<number>(0)

  useEffect(() => {
    function calculateDistance() {
      if (!activityData) return
      let totalDist = 0
      const res: BarChartData[] = []
      Object.keys(activityData.monthly!).forEach(month => {
        const acts = activityData.monthly![month]!
        const distanceBySport: Record<string, number> = {}
        acts.forEach(a => {
          const sportType = a.sport_type! as SportType
          const distance = Math.round(unitConversion.convertDistance(a.distance!, units))
          if (distance === 0) return
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

  if (totalDistance === 0) {
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
              fill={colorPalette[sport as SportType]}
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