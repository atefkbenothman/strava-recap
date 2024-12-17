import { useState, useEffect } from "react"
import { unitConversion } from "../../utils/utils"
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
import Card from "../common/card"
import NoData from "../common/noData"
import { useStravaAuthContext } from "../../hooks/useStravaAuthContext"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"
import { Themes } from "../../contexts/themeContext"


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
  const { athlete } = useStravaAuthContext()
  const { activityData } = useStravaActivityContext()
  const { darkMode, theme, themeColors } = useThemeContext()

  const [data, setData] = useState<BarChartData[]>([])

  useEffect(() => {
    if (!activityData) return
    function getGear() {
      const res: BarChartData[] = []
      let idx = 1
      activityData.all!.forEach((act) => {
        if (act.gear_id !== null) {
          const gearId = act.gear_id!
          const movingTime = Math.round(unitConversion.convertTime(act.moving_time!, "hours"))
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
            res.push({ gearId: gear!.id, gearName: gear!.name, hours: movingTime, fill: themeColors[themeColors.length - idx] })
            idx += 1
          }
        }
      })
      res.sort((a, b) => b.hours - a.hours)
      setData(res)
    }
    getGear()
  }, [activityData, theme])

  if (data.length === 0) {
    return (
      <Card
        title="Gear"
        description="total hours spent using gear"
        icon={<Wrench size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Gear"
      description="total hours spent using gear"
      icon={<Wrench size={16} strokeWidth={2} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <BarChart data={data} layout="vertical">
          <Bar
            dataKey="hours"
            isAnimationActive={false}
            label={{
              position: "right",
              fontSize: 10,
              fill: darkMode ? "#c2c2c2" : ""
            }}
            radius={[4, 4, 4, 4]}
          >
            {data.map((d, idx) => (
              <Cell key={idx} fill={d.fill} />
            ))}
          </Bar>
          <YAxis
            type="category"
            dataKey="gearName"
            tick={{
              fontSize: 10,
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            width={38}
          />
          <XAxis
            type="number"
            hide={true}
          />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </Card >
  )
}