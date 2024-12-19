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
    function getGear() {
      if (!activityData || !athlete) return
      try {
        const res: BarChartData[] = []
        let idx = 1
        const athleteGear = [...(athlete?.bikes ?? []), ...(athlete?.shoes ?? [])];
        activityData.all!.forEach((act) => {
          if (!act.gear_id) return
          const gearId = act.gear_id!
          const movingTime = Math.round(unitConversion.convertTime(act.moving_time!, "hours"))
          const existingGear = res.find(item => item.gearId === gearId)
          const gear = athleteGear.find(item => item.id === gearId);
          if (!gear) { return }
          if (existingGear) {
            existingGear.hours += movingTime
          } else {
            const color = themeColors[(themeColors.length - idx) % themeColors.length]
            res.push({ gearId: gearId, gearName: gear!.name, hours: movingTime, fill: color })
            idx += 1
          }
        })
        res.sort((a, b) => b.hours - a.hours)
        setData(res)
      } catch (err) {
        console.warn(err)
      }
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