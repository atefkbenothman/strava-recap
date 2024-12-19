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


type PieChartData = {
  sport: SportType
  hours: number
  color: string
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
    function calculateTotalHours() {
      if (!activityData) return
      let totalHrs = 0
      const res = Object.keys(activityData.bySportType!).reduce((acc, sport) => {
        const acts = activityData.bySportType![sport as SportType]!
        const totalHoursPerSport = acts.reduce((hours, a) => {
          const movingTime = unitConversion.convertTime(a.moving_time!, "hours")
          hours += movingTime
          totalHrs += movingTime
          return hours
        }, 0)
        if (totalHoursPerSport >= 1) {
          acc.push({ sport: sport as SportType, hours: Math.round(totalHoursPerSport), color: colorPalette[sport as SportType]! })
        }
        return acc
      }, [] as PieChartData[])
      setData(res)
      setTotalHours(totalHrs)
    }
    calculateTotalHours()
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
