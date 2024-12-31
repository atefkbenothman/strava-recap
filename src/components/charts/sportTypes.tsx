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

type PieChartData = {
  sport: SportType
  activities: number
  color: string
}

/*
 * All sport types
*/
export default function SportTypes() {
  const { activityData } = useStravaActivityContext()
  const { colorPalette } = useThemeContext()

  const [data, setData] = useState<PieChartData[]>([])
  const [numSportTypes, setNumSportTypes] = useState<number>(0)

  useEffect(() => {
    function formatData() {
      if (!activityData) return
      setNumSportTypes(Object.keys(activityData.bySportType!).length)
      const res = Object.keys(activityData.bySportType!).reduce((acc, sport) => {
        const numActs = activityData.bySportType![sport as SportType]!.length
        acc.push({ sport: sport as SportType, activities: numActs, color: colorPalette[sport as SportType]! })
        return acc
      }, [] as PieChartData[])
      setData(res)
    }
    formatData()
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
            paddingAngle={3}
          >
            {data.map((e, idx) => (
              <Cell key={idx} fill={e.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}