import { useContext, useState, useEffect } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { getRandomColor, unitConversion } from "../../utils/utils"
import { StravaGear } from "../../types/strava"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  YAxis,
  XAxis,
  Tooltip,
  Cell
} from "recharts"
import { Wrench } from 'lucide-react'
import Card from "../card"


type BarChartData = {
  gearId: string
  gearName: string
  hours: number
  fill: string
}

/*
 * Total time usage for each piece of gear
*/
export default function Gear() {
  const { activityData, theme, athlete } = useContext(RecapContext)

  const [data, setData] = useState<BarChartData[]>([])

  useEffect(() => {
    if (!activityData) return
    function getGear() {
      const res: BarChartData[] = []
      activityData.all!.forEach(act => {
        if (act.gear_id !== null) {
          const gearId = act.gear_id!
          const movingTime = Math.round(unitConversion.convertSecondsToHours(act.moving_time!))
          const existingGear = res.find(item => item.gearId === gearId)
          const athleteBikes = athlete!.bikes
          const athleteShoes = athlete!.shoes
          const bikes = athleteBikes!.filter(bike => (
            bike.id === gearId
          ))
          const shoes = athleteShoes!.filter(shoes => (
            shoes.id === gearId
          ))
          let gear
          if (bikes.length > 0) {
            gear = bikes[0]
          } else if (shoes.length > 0) {
            gear = shoes[0]
          }
          if (existingGear) {
            existingGear.hours += movingTime
          } else {
            res.push({ gearId: gear!.id, gearName: gear!.name, hours: movingTime, fill: getRandomColor(theme.colors as readonly string[]) })
          }
        }
      })
      res.sort((a, b) => b.hours - a.hours)
      setData(res)
    }
    getGear()
  }, [activityData, theme])

  return (
    <Card
      title="Gear"
      description="total time usage for each gear"
      icon={<Wrench size={16} strokeWidth={2} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <BarChart data={data} layout="vertical">
          <Bar
            dataKey="hours"
            isAnimationActive={false}
            label={{ position: "right", fontSize: 10 }}
          >
            {data.map((d, idx) => (
              <Cell key={idx} fill={d.fill} />
            ))}
          </Bar>
          <YAxis
            type="category"
            dataKey="gearName"
            tick={{ fontSize: 10 }}
            width={38}
          />
          <XAxis type="number" hide={true} />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </Card >
  )
}