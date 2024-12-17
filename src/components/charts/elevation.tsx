import { useEffect, useState } from "react"
import { unitConversion } from "../../utils/utils"
import { SportType } from "../../types/strava"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend,
} from "recharts"
import { Mountain } from "lucide-react"
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
 * Monthly Elevation
*/
export default function Elevation() {
  const { activityData, units } = useStravaActivityContext()
  const { darkMode, colorPalette } = useThemeContext()

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
          if (elevation === 0) return
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
  }, [activityData, units, colorPalette])

  if (totalElevation === 0) {
    return (
      <Card
        title="Elevation"
        description="total elevation per month"
        icon={<Mountain size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

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
            tick={{
              fontSize: 12,
              color: darkMode ? "#c2c2c2" : "#666",
              fill: darkMode ? "#c2c2c2" : "#666",
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
          />
          <Tooltip />
          {sportTypes.map(sport => (
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