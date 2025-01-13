import { useEffect, useState } from "react"
import { SportType } from "../../types/strava"
import { unitConversion } from "../../utils/utils"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend
} from "recharts"
import { Rocket } from 'lucide-react'

import Card from "../common/card"
import { ActivityData, UnitDefinitions, Units } from "../../types/activity"
import NoData from "../common/noData"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"

type BarChartData = {
  month: string
  [key: string]: number | string
}

const sanitizeData = (data: ActivityData, units: Units): { chartData: BarChartData[], total: number } => {
  if (!data || !data.monthly || Object.keys(data.monthly).length === 0) {
    return { chartData: [], total: 0 }
  }
  const res: BarChartData[] = []
  let totalDistance = 0
  Object.entries(data.monthly!).forEach(([month, activities]) => {
    if (!activities) return
    const distanceBySport: Partial<Record<SportType, number>> = {} // { Run: 99, Ride: 12 }
    for (const act of activities) {
      if (act.distance && act.distance > 0) {
        const sportType = act.sport_type! as SportType
        const distance = Number(unitConversion.convertDistance(act.distance!, units).toFixed(2))
        if (distance > 0) {
          if (!distanceBySport[sportType]) {
            distanceBySport[sportType] = distance
          } else {
            distanceBySport[sportType] += distance
          }
          totalDistance += distance
        }
      }
    }
    res.push({ month, ...distanceBySport })
  })
  return { chartData: res, total: totalDistance }
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
    if (!activityData) return
    try {
      const { chartData, total } = sanitizeData(activityData, units)
      setData(chartData)
      setTotalDistance(total)
    } catch (err) {
      console.warn(err)
      setData([])
      setTotalDistance(0)
    }
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
          <Tooltip formatter={d => Number(d).toFixed(2)} />
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