import { useContext, useEffect, useState } from "react"
import { SportType } from "../../types/strava"
import { RecapContext } from "../../contexts/recapContext"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell
} from "recharts"
import { Zap } from 'lucide-react'
import Card from "../card"

type PieChartData = {
  sport: SportType
  activities: number
  color: string
}

/*
 * All sport types
*/
export default function SportTypes() {
  const { activityData, colorPalette } = useContext(RecapContext)

  const [data, setData] = useState<PieChartData[]>([])
  const [numSportTypes, setNumSportTypes] = useState<number>(0)

  useEffect(() => {
    if (!activityData) return
    setNumSportTypes(Object.keys(activityData.bySportType!).length)
    function formatData() {
      const res = Object.keys(activityData.bySportType!).reduce((acc, sport) => {
        const numActs = activityData.bySportType![sport as SportType]!.length
        acc.push({ sport: sport as SportType, activities: numActs, color: colorPalette[sport] })
        return acc
      }, [] as PieChartData[])
      setData(res)
    }
    formatData()
  }, [activityData, colorPalette])

  return (
    <Card
      title="Sport Types"
      description="number of activities per sport type"
      total={numSportTypes}
      totalUnits="sports"
      icon={<Zap size={16} strokeWidth={2} />}
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