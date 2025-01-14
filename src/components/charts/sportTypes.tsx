import { useEffect, useState } from "react"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { SportType } from "../../types/strava"
import { useThemeContext } from "../../hooks/useThemeContext"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell
} from "recharts"
import { Bike } from "lucide-react"
import Card from "../common/card"
import NoData from "../common/noData"
import { ColorPalette } from "../../contexts/themeContext"
import { ActivityData } from "../../types/activity"
import { CustomPieTooltip } from "../common/customPieTooltip"

type PieChartData = {
  sport: SportType
  activities: number
  color: string
}

const sanitizeData = (data: ActivityData, colorPalette: ColorPalette): { chartData: PieChartData[], total: number } => {
  if (!data || !data.bySportType || Object.keys(data.bySportType).length === 0) {
    return { chartData: [], total: 0 }
  }
  const res: PieChartData[] = []
  const sportActivities = data.bySportType!
  Object.entries(sportActivities).forEach(([sport, activities]) => {
    if (!activities) return
    res.push({ sport: sport as SportType, activities: activities.length, color: colorPalette[sport as SportType]! })
  })
  let totalSports = Object.keys(data.bySportType!).length
  return { chartData: res, total: totalSports }
}

/*
 * All sport types
*/
export default function SportTypes() {
  const { activityData } = useStravaActivityContext()
  const { colorPalette, darkMode } = useThemeContext()

  const [data, setData] = useState<PieChartData[]>([])
  const [numSportTypes, setNumSportTypes] = useState<number>(0)

  useEffect(() => {
    if (!activityData) return
    try {
      // format data to fit recharts schema
      const { chartData, total } = sanitizeData(activityData, colorPalette)
      setData(chartData)
      setNumSportTypes(total)
    } catch (err) {
      console.warn(err)
      setData([])
      setNumSportTypes(0)
    }
  }, [activityData, colorPalette])

  if (data.length === 0) {
    return (
      <Card
        title="Sport Types"
        description="number of activities per sport type"
        icon={<Bike size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Sport Types"
      description="number of activities per sport type"
      total={numSportTypes}
      totalUnits="sports"
      icon={<Bike size={16} strokeWidth={2} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <PieChart>
          <Pie
            label={{ fontSize: 14 }}
            data={data}
            dataKey="activities"
            nameKey="sport"
            innerRadius={50}
            outerRadius={80}
            cornerRadius={4}
            isAnimationActive={false}
            paddingAngle={5}
          >
            {data.map((e, idx) => (
              <Cell key={idx} fill={e.color} stroke={e.color} />
            ))}
          </Pie>
          <Tooltip
            content={(props) => <CustomPieTooltip {...props} />}
            cursor={{ opacity: 0.8, fill: darkMode ? "#1a1a1a" : "#cbd5e1" }}
          />
          <Legend verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}