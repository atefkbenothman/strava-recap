import { useMemo } from "react"
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
import { StravaAthlete } from "../../types/strava"
import { CustomBarTooltip } from "../common/customBarTooltip"
import { ActivityData } from "../../types/activity"

type BarChartData = {
  gearId: string
  gearName: string
  hours: number
  fill: string
}

export const calculateGearUsage = (data: ActivityData, athlete: StravaAthlete): BarChartData[] => {
  if (!data?.all?.length) return []

  const athleteGear = [...(athlete?.bikes ?? []), ...(athlete?.shoes ?? [])]
  const gearMap = new Map<string, BarChartData>()

  data.all.forEach(act => {
    if (!act.gear_id || !act.moving_time) return

    const gear = athleteGear.find(item => item.id === act.gear_id)
    if (!gear) return

    const movingTime = Number(unitConversion.convertTime(act.moving_time, "hours").toFixed(2))

    if (gearMap.has(act.gear_id)) {
      const existingGear = gearMap.get(act.gear_id)!
      existingGear.hours += movingTime
    } else {
      gearMap.set(act.gear_id, {
        gearId: act.gear_id,
        gearName: gear.name,
        hours: movingTime,
        fill: "#ffffff" // placeholder color
      })
    }
  })

  return Array.from(gearMap.values())
    .sort((a, b) => b.hours - a.hours)
}

/*
 * Total time usage for each piece of gear
*/
export default function Gear() {
  const { athlete } = useStravaAuthContext()
  const { activitiesData } = useStravaActivityContext()
  const { darkMode, themeColors } = useThemeContext()

  const rawData = useMemo(() => {
    if (!activitiesData || !athlete) return []

    try {
      return calculateGearUsage(activitiesData, athlete)
    } catch (err) {
      console.warn(err)
      return []
    }
  }, [activitiesData, athlete])

  const data = useMemo(() =>
    rawData.map((item, index) => ({
      ...item,
      fill: themeColors[index % themeColors.length]
    }))
    , [rawData, themeColors])

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
            label={{
              position: "right",
              fontSize: 10,
              fill: darkMode ? "#c2c2c2" : "",
              color: darkMode ? "#c2c2c2" : "#666",
              formatter: (value: number) => value > 0 ? Number(value).toFixed(0) : ''
            }}
            radius={[4, 4, 4, 4]}
            isAnimationActive={false}
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.fill} />
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
    </Card>
  )
}