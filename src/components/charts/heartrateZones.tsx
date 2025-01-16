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
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts"
import { SportType, StravaAthleteZones, Zone } from "../../types/strava"
import { unitConversion } from "../../utils/utils"
import { ActivityData } from "../../types/activity"


type RadialChartData = {
  zone: Zone
  zoneName: string
} & Record<SportType, number>

const sanitizeData = (data: ActivityData, athleteZones: StravaAthleteZones): RadialChartData[] => {
  if (!data || !data.all || !data.bySportType || !athleteZones || !athleteZones.heart_rate) {
    return []
  }
  let hasHrData = false
  const sportTypes = Object.keys(data.bySportType)
  const sportsData = sportTypes.reduce((acc, sport) => {
    acc[sport as SportType] = 0
    return acc
  }, {} as Record<SportType, number>)
  const hrZones = athleteZones.heart_rate.zones
  const res: RadialChartData[] = hrZones.map((z, idx) => {
    return { zoneName: `Zone ${idx + 1}`, zone: { min: z.min, max: z.max }, ...sportsData }
  })
  data.all.forEach(act => {
    if (act.average_heartrate && act.moving_time && act.sport_type) {
      const sportType = act.sport_type as SportType
      const avgHr = act.average_heartrate
      const movingTime = Number(unitConversion.convertTime(act.moving_time, "hours").toFixed(2))
      const existingHrZone = res.find(item => avgHr >= item.zone.min && avgHr < item.zone.max)
      if (existingHrZone) {
        existingHrZone[sportType] += movingTime
        hasHrData = true
      }
    }
  })
  return hasHrData ? res : []
}

export const CustomRadarTooltip: React.FC<any> = ({ active, payload }) => {
  if (!active || !payload) {
    return null
  }
  const zoneName = payload[0].payload.zoneName ?? ""
  return (
    <div className="bg-white dark:bg-black bg-opacity-90 p-2 rounded flex-col space-y-2">
      <p className="font-bold">{zoneName}</p>
      <div className="flex flex-col gap-1">
        {payload.map((p: any, idx: number) => {
          const dataKey = p.dataKey
          if (p.payload[dataKey] !== 0) {
            return (
              <p key={idx} style={{ color: p.color }}>{p.name}: <span className="font-semibold">{Number(p.payload[dataKey].toFixed(2))}</span></p>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}

/*
 * Total minutes spent in each heartrate zone
 */
export default function HeartrateZones() {
  const { athleteZones, activityData } = useStravaActivityContext()
  const { darkMode, colorPalette } = useThemeContext()

  const [data, setData] = useState<RadialChartData[]>([])

  useEffect(() => {
    if (!activityData || !athleteZones) return
    try {
      setData(sanitizeData(activityData, athleteZones))
    } catch (err) {
      console.warn(err)
      setData([])
    }

  }, [activityData, athleteZones, colorPalette])

  if (data.length === 0) {
    return (
      <Card
        title="Heartrate Zones"
        description="total minutes spent in each zone"
        icon={<Activity size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Heartrate Zones"
      description="total minutes spent in each zone"
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
            fontSize={10}
            tick={{
              fill: darkMode ? "#c2c2c2" : "",
            }}
            type="category"
          />
          {activityData?.bySportType &&
            Object.keys(activityData.bySportType).length > 0 &&
            Object.keys(activityData.bySportType).map((sport, idx) => (
              <Radar
                key={idx}
                name={sport}
                dataKey={sport}
                stroke={colorPalette[sport as SportType]}
                strokeWidth={2}
                fill={colorPalette[sport as SportType]}
                fillOpacity={0.6}
              />
            ))}
          <Legend />
          <Tooltip
            content={(props) => <CustomRadarTooltip {...props} />}
            cursor={{ opacity: 0.8, fill: darkMode ? "#1a1a1a" : "#cbd5e1" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Card >
  )
}