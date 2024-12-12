import { useContext, useEffect, useState } from "react"
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
import { Mountain } from "lucide-react"
import Card from "../card"
import { UnitDefinitions } from "../../types/activity"


type BarChartData = {
  month: string
  [key: string]: number | string
}

/*
 * Monthly Elevation
*/
export default function Elevation() {
  const { activityData, colorPalette, units } = useContext(RecapContext)

  const [data, setData] = useState<BarChartData[]>([])
  const [totalElevation, setTotalElevation] = useState<number>(0)
  const [sportTypes, setSportTypes] = useState<string[]>([])

  useEffect(() => {
    if (!activityData) return
    setSportTypes(Object.keys(activityData.bySportType!))
    function calculateElevation() {
      let totalElev = 0
      const res: BarChartData[] = []
      Object.keys(activityData.monthly!).forEach(month => {
        const acts = activityData.monthly![month]!
        const elevationBySport: Record<string, number> = {}
        acts.forEach((a) => {
          const sportType = a.sport_type! as SportType
          const elevation = Math.round(unitConversion.convertElevation(a.total_elevation_gain!, units))
          if (!elevationBySport[sportType]) {
            elevationBySport[sportType] = 0
          }
          elevationBySport[sportType] += elevation
          totalElev += elevation
        })
        res.push({ month: month, ...elevationBySport })
      })
      setData(res)
      setTotalElevation(totalElev)
    }
    calculateElevation()
  }, [activityData, units])

  return (
    <Card
      title="Elevation"
      description="total elevation per month"
      total={Math.round(totalElevation)}
      totalUnits={UnitDefinitions[units].elevation}
      icon={<Mountain size={16} strokeWidth={2} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <BarChart data={data}>
          <XAxis
            type="category"
            dataKey="month"
            tick={{ fontSize: 12 }}
          />
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