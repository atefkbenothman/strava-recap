import { useMemo } from "react"
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
import { SportType, Zone, StravaAthleteZones } from "../../types/strava"
import { unitConversion } from "../../utils/utils"
import { ActivityData } from "../../types/activity"

type RadialChartData = {
  zone: Zone
  zoneName: string
} & Record<SportType, number>

type TooltipProps = {
  active?: boolean
  payload?: any[]
}

export const calculateHeartrateZones = (
  data: ActivityData,
  athleteZonesData: StravaAthleteZones
): RadialChartData[] => {
  if (!data?.all || !data.byType || !athleteZonesData?.heart_rate) return []

  const sportTypes = Object.keys(data.byType)
  const sportsData = sportTypes.reduce((acc, sport) => {
    acc[sport as SportType] = 0
    return acc
  }, {} as Record<SportType, number>)

  const hrZones = athleteZonesData.heart_rate.zones
  const zones = hrZones.map((z, idx) => ({
    zoneName: `Zone ${idx + 1}`,
    zone: { min: z.min, max: z.max },
    ...sportsData
  }))

  let hasHrData = false
  data.all.forEach(act => {
    if (!act.average_heartrate || !act.moving_time || !act.sport_type) return

    const avgHr = act.average_heartrate
    const movingTime = Number(unitConversion.convertTime(act.moving_time, "hours").toFixed(2))
    const zone = zones.find(item => avgHr >= item.zone.min && avgHr < item.zone.max)

    if (zone) {
      zone[act.sport_type as SportType] += movingTime
      hasHrData = true
    }
  })

  return hasHrData ? zones : []
}

const CustomRadarTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload) return null

  const zoneName = payload[0].payload.zoneName ?? ""
  return (
    <div className="bg-white dark:bg-black bg-opacity-90 p-2 rounded flex-col space-y-2">
      <p className="font-bold">{zoneName}</p>
      <div className="flex flex-col gap-1">
        {payload.map((p: any, idx: number) => {
          const value = p.payload[p.dataKey]
          if (value === 0) return null

          return (
            <p key={idx} style={{ color: p.color }}>
              {p.name}: <span className="font-semibold">{Number(value.toFixed(2))}</span>
            </p>
          )
        })}
      </div>
    </div>
  )
}

/*
 * Total minutes spent in each heartrate zone
 */
export default function HeartrateZones() {
  const { athleteZonesData, activitiesData } = useStravaActivityContext()
  const { darkMode, colorPalette } = useThemeContext()

  const data = useMemo(() => {
    if (!activitiesData || !athleteZonesData) return []

    try {
      return calculateHeartrateZones(activitiesData, athleteZonesData)
    } catch (err) {
      console.warn(err)
      return []
    }
  }, [activitiesData, athleteZonesData])

  const chartConfig = useMemo(() => ({
    polarGridStyle: {
      gridType: "polygon" as const,
      strokeOpacity: 0.3,
      strokeWidth: 2
    },
    angleAxisStyle: {
      fontSize: 10,
      tick: {
        fill: darkMode ? "#c2c2c2" : ""
      }
    },
    tooltipStyle: {
      cursor: {
        opacity: 0.8,
        fill: darkMode ? "#1a1a1a" : "#cbd5e1"
      }
    }
  }), [darkMode])

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
          <PolarGrid {...chartConfig.polarGridStyle} />
          <PolarAngleAxis
            dataKey="zoneName"
            {...chartConfig.angleAxisStyle}
            type="category"
          />
          {activitiesData?.byType &&
            Object.keys(activitiesData.byType).map((sport, idx) => (
              <Radar
                key={`radar-${idx}`}
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
            content={CustomRadarTooltip}
            cursor={chartConfig.tooltipStyle.cursor}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Card>
  )
}