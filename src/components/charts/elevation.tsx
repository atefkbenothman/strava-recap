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
  let totalElevation = 0
  const monthlyActivities = data.monthly!
  Object.entries(monthlyActivities).forEach(([month, activities]) => {
    if (!activities) return
    const elevationBySport: Partial<Record<SportType, number>> = {} // { Run: 99, Ride: 12 }
    for (const act of activities) {
      if (act.total_elevation_gain && act.total_elevation_gain > 0) {
        const sportType = act.sport_type! as SportType
        const elevation = Number(unitConversion.convertElevation(act.total_elevation_gain!, units).toFixed(2))
        if (elevation > 0) {
          if (!elevationBySport[sportType]) {
            elevationBySport[sportType] = elevation
          } else {
            elevationBySport[sportType] += elevation
          }
          totalElevation += elevation
        }
      }
    }
    res.push({ month, ...elevationBySport })
  })
  return { chartData: res, total: totalElevation }
}

/*
 * Monthly Elevation
*/
export default function Elevation() {
  const { activityData, units } = useStravaActivityContext()
  const { darkMode, colorPalette } = useThemeContext()

  const [data, setData] = useState<BarChartData[]>([])
  const [totalElevation, setTotalElevation] = useState<number>(0)

  useEffect(() => {
    if (!activityData) return
    try {
      const { chartData, total } = sanitizeData(activityData, units)
      setData(chartData)
      setTotalElevation(total)
    } catch (err) {
      console.warn(err)
      setData([])
      setTotalElevation(0)
    }
  }, [activityData, units, colorPalette])

  if (data.length === 0) {
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
          <Tooltip formatter={d => Number(d).toFixed(2)} />
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