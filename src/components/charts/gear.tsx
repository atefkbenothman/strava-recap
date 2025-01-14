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
import { ActivityData } from "../../types/activity"
import { StravaAthlete } from "../../types/strava"
import { CustomBarTooltip } from "../common/customBarTooltip"


type BarChartData = {
  gearId: string
  gearName: string
  hours: number
  fill: string
}

const sanitizeData = (data: ActivityData, athlete: StravaAthlete, themeColors: readonly string[]): BarChartData[] => {
  if (!data || !data.all || data.all.length === 0) {
    return []
  }
  let colorIdx = 1
  const res: BarChartData[] = []
  const athleteGear = [...(athlete?.bikes ?? []), ...(athlete?.shoes ?? [])]
  data.all.forEach(act => {
    if (act.gear_id && act.moving_time) {
      const gear = athleteGear.find(item => item.id === act.gear_id)
      const existingGear = res.find(item => item.gearId === act.gear_id)
      if (gear) {
        const movingTime = Number(unitConversion.convertTime(act.moving_time!, "hours").toFixed(2))
        if (existingGear) {
          existingGear.hours += movingTime
        } else {
          console.log(themeColors, colorIdx)
          res.push({ gearId: act.gear_id, gearName: gear.name, hours: movingTime, fill: themeColors[colorIdx % themeColors.length] })
          colorIdx += 1
        }
      }
    }
  })
  return res
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
    if (!activityData || !athlete) return
    try {
      const gearData = sanitizeData(activityData, athlete, themeColors)
      gearData.sort((a, b) => b.hours - a.hours)
      setData(gearData)
    } catch (err) {
      console.warn(err)
      setData([])
    }
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
              fill: darkMode ? "#c2c2c2" : "",
              color: darkMode ? "#c2c2c2" : "#666",
              formatter: (value: number) => value > 0 ? Number(value).toFixed(0) : ''
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
          <Tooltip
            content={(props) => <CustomBarTooltip {...props} />}
            cursor={{ opacity: 0.8, fill: darkMode ? "#1a1a1a" : "#cbd5e1" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card >
  )
}