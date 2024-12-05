import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
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

type BarChartData = {
  month: string
  [key: string]: number | string
}

/*
 * Total distance per month
*/
export default function Distance() {
  const { activityData, colorPalette } = useContext(RecapContext)
  let totalDistance = 0
  const sportTypes = Object.keys(activityData.bySportType!)
  const data: BarChartData[] = []
  Object.keys(activityData.monthly!).forEach(month => {
    const acts = activityData.monthly![month]!
    const distanceBySport: { [key: string]: number } = {}
    acts.forEach(a => {
      const sportType = a.sport_type! as SportType
      const distance = Math.round(unitConversion.convertFromMetersToMi(a.distance!))
      if (!distanceBySport[sportType]) {
        distanceBySport[sportType] = 0
      }
      totalDistance += distance
      distanceBySport[sportType] += distance
    })
    data.push({ month: month, ...distanceBySport })
  })
  return (
    <Card title="Distance" description="total distance per month" total={Math.round(totalDistance)} totalUnits="mi" icon={<Rocket size={16} strokeWidth={2} />}>
      <ResponsiveContainer height={350} width="90%">
        <BarChart data={data}>
          <XAxis type="category" dataKey="month" tick={{ fontSize: 12 }} />
          <Tooltip />
          {sportTypes.map((sport) => (
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