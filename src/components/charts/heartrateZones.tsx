import { useEffect, useState } from "react"
import Card from "../common/card"
import { Activity } from "lucide-react"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import NoData from "../common/noData"
import { useThemeContext } from "../../hooks/useThemeContext"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts"
import { SportType, Zone } from "../../types/strava"
import { unitConversion } from "../../utils/utils"


type RadialChartData = {
  zone: Zone
  zoneName: string
} & Record<SportType, number>

/*
 * Total time spent in each heartrate zone
 */
export default function HeartrateZones() {
  const { athleteZones, activityData } = useStravaActivityContext()
  const { darkMode, colorPalette } = useThemeContext()

  const [data, setData] = useState<RadialChartData[]>([])
  const [sportTypes, setSportTypes] = useState<SportType[]>([])

  useEffect(() => {
    if (!activityData || !athleteZones || !athleteZones.heart_rate || athleteZones.heart_rate.zones.length === 0) return
    const types = Object.keys(activityData.bySportType!)
    const zones = athleteZones.heart_rate.zones
    // initialize radial chart data with athlete zones
    const res: RadialChartData[] = []
    const sports = types.reduce((acc, sport) => {
      acc[sport as SportType] = 0
      return acc
    }, {} as Record<SportType, number>)
    for (let i = 0; i < zones.length; i++) {
      res.push({ zone: { min: zones[i].min, max: zones[i].max }, zoneName: `Zone ${i + 1}`, ...sports })
    }
    let hrCount = 0
    activityData.all!.forEach(activity => {
      const avg_heartrate = activity.average_heartrate!
      const movingTime = unitConversion.convertTime(activity.moving_time!, "hours")
      const sport = activity.sport_type! as SportType
      if (avg_heartrate) {
        hrCount += 1
        const item = res.find(item => {
          return avg_heartrate >= item.zone.min && avg_heartrate <= item.zone.max
        })
        if (item) {
          item[sport as SportType] += Number(movingTime.toFixed(0))
        }
      }
    })
    setSportTypes(types as SportType[])
    // if no heartrate data, set to empty
    if (hrCount === 0) {
      setData([])
    } else {
      setData(res)
    }
  }, [activityData, athleteZones, colorPalette])

  if (data.length === 0) {
    return (
      <Card
        title="Heartrate Zones"
        description="total hours spent in each zone"
        icon={<Activity size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Heartrate Zones (avg)"
      description="total hours spent in each zone"
      icon={<Activity size={16} strokeWidth={2} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <RadarChart outerRadius="80%" data={data}>
          <PolarGrid
            gridType="polygon"
            strokeOpacity={0.3}
            strokeWidth={2}
          />
          <PolarAngleAxis
            dataKey="zoneName"
            fontSize={12}
            tick={{
              fill: darkMode ? "#c2c2c2" : "",
            }}
            type="category"
          />
          <PolarRadiusAxis
            fontSize={12}
            fill={darkMode ? "#c2c2c2" : ""}
            type="number"
          />
          {sportTypes.map((sport, idx) => {
            return (
              <Radar
                key={idx}
                name={sport}
                dataKey={sport}
                stroke={colorPalette[sport]}
                fill={colorPalette[sport]}
                fillOpacity={0.6}
              />
            )
          })}
          <Legend />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </Card >
  )
}