import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { unitConversion } from "../../utils/utils"
import { SportType } from "../../types/strava"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend
} from "recharts"
import { Mountain } from 'lucide-react';
import Card from "../card"


type BarChartData = {
  month: string
  [key: string]: number | string
}

/*
 * Monthly Elevation
*/
export default function Elevation() {
  const { activityData, colorPalette } = useContext(RecapContext)
  let totalElevation = 0
  const sportTypes = Object.keys(activityData.bySportType!)
  const data: BarChartData[] = []
  Object.keys(activityData.monthly!).forEach(month => {
    const acts = activityData.monthly![month]!
    const elevationBySport: { [key: string]: number } = {}
    acts.forEach((a) => {
      const sportType = a.sport_type! as SportType
      const elevation = Math.round(unitConversion.convertFromMetersToFeet(a.total_elevation_gain!))
      if (!elevationBySport[sportType]) {
        elevationBySport[sportType] = 0
      }
      totalElevation += elevation
      elevationBySport[sportType] += elevation
    })
    data.push({ month: month, ...elevationBySport })
  })
  return (
    <Card title="Elevation" description="total elevation per month" total={Math.round(totalElevation)} totalUnits="ft" icon={<Mountain size={16} strokeWidth={2} />}>
      <ResponsiveContainer height={350} width="90%">
        <BarChart data={data}>
          <XAxis type="category" dataKey="month" tick={{ fontSize: 12 }} />
          <Tooltip />
          {sportTypes.map(sport => (
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