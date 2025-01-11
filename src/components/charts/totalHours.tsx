import { useEffect, useState } from "react"
import { SportType } from "../../types/strava"
import { unitConversion } from "../../utils/utils"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend
} from "recharts"
import { Watch } from "lucide-react"
import NoData from "../common/noData"
import Card from "../common/card"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"
import { ColorPalette } from "../../contexts/themeContext"
import { ActivityData } from "../../types/activity"


type PieChartData = {
  sport: SportType
  hours: number
  color: string
}

const sanitizeData = (data: ActivityData, colorPalette: ColorPalette): { chartData: PieChartData[], total: number } => {
  if (!data || !data.bySportType || Object.keys(data.bySportType).length === 0) {
    return { chartData: [], total: 0 }
  }
  const res: PieChartData[] = []
  let totalHours = 0
  const sportActivities = data.bySportType!
  Object.entries(sportActivities).forEach(([sport, activities]) => {
    if (!activities) return
    let hoursBySport = 0
    for (const act of activities) {
      if (act.moving_time) {
        const movingTime = unitConversion.convertTime(act.moving_time!, "hours")
        hoursBySport += movingTime
        totalHours += movingTime
      }
    }
    if (Number(hoursBySport.toFixed(1)) > 0) {
      res.push({ sport: sport as SportType, hours: Number(hoursBySport.toFixed(1)), color: colorPalette[sport as SportType]! })
    }
  })
  return { chartData: res, total: totalHours }
}

/*
 * Total hours spent per sport
*/
export default function TotalHours() {
  const { activityData } = useStravaActivityContext()
  const { colorPalette } = useThemeContext()

  const [data, setData] = useState<PieChartData[]>([])
  const [totalHours, setTotalHours] = useState<number>(0)

  useEffect(() => {
    if (!activityData) return
    try {
      const { chartData, total } = sanitizeData(activityData, colorPalette)
      setData(chartData)
      setTotalHours(total)
    } catch (err) {
      console.warn(err)
      setData([])
      setTotalHours(0)
    }
  }, [activityData, colorPalette])

  if (data.length === 0) {
    return (
      <Card
        title="Total Hours"
        description="total hours spent per sport"
        icon={<Watch size={17} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Total Hours"
      description="total hours spent per sport"
      total={Math.round(totalHours)}
      totalUnits="hours"
      icon={<Watch size={17} strokeWidth={2} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <PieChart>
          <Pie
            label={{ fontSize: 14 }}
            data={data}
            dataKey="hours"
            nameKey="sport"
            innerRadius={50}
            outerRadius={80}
            cornerRadius={4}
            isAnimationActive={false}
            paddingAngle={3}
          >
            {data.map((d, idx) => (
              <Cell key={idx} fill={d.color} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" align="center" />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}
