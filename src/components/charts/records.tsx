import { useMemo } from "react"
import { unitConversion } from "../../utils/utils"
import { StravaActivity } from "../../types/strava"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import Card from "../common/card"
import Stat from "../common/stat"
import { ActivityData, UnitDefinitions } from "../../types/activity"
import { Award } from "lucide-react"

type CardData = {
  topSpeed?: StravaActivity
  highestElevation?: StravaActivity
  maxWatts?: StravaActivity
  maxHeartrate?: StravaActivity
  prCount: number
  athleteCount: number
}

export const calculateRecords = (data: ActivityData): CardData => {
  if (!data || !data.all || data.all.length === 0) {
    return {
      prCount: 0,
      athleteCount: 0
    }
  }

  return data.all.reduce(
    (acc, act) => {
      if (act.max_speed && (!acc.topSpeed || act.max_speed > acc.topSpeed.max_speed!)) {
        acc.topSpeed = act
      }
      if (act.total_elevation_gain && (!acc.highestElevation || act.total_elevation_gain > acc.highestElevation.total_elevation_gain!)) {
        acc.highestElevation = act
      }
      if (act.max_watts && (!acc.maxWatts || act.max_watts > acc.maxWatts.max_watts!)) {
        acc.maxWatts = act
      }
      if (act.max_heartrate && (!acc.maxHeartrate || act.max_heartrate > acc.maxHeartrate.max_heartrate!)) {
        acc.maxHeartrate = act
      }
      if (act.pr_count) {
        acc.prCount += act.pr_count
      }
      if (act.athlete_count) {
        acc.athleteCount += (act.athlete_count - 1)
      }
      return acc
    },
    {
      topSpeed: undefined,
      highestElevation: undefined,
      maxWatts: undefined,
      maxHeartrate: undefined,
      prCount: 0,
      athleteCount: 0,
    } as CardData
  )
}

/*
 * Highest records
*/
export default function Records() {
  const { activitiesData, units } = useStravaActivityContext()

  const data = useMemo(() => {
    if (!activitiesData || activitiesData.all.length < 0) {
      return {
        prCount: 0,
        athleteCount: 0
      }
    }
    try {
      return calculateRecords(activitiesData)
    } catch (err) {
      console.warn(err)
      return {
        prCount: 0,
        athleteCount: 0
      }
    }
  }, [activitiesData])

  const stats = useMemo(() => [
    {
      label: "Top Speed",
      value: data.topSpeed
        ? String(unitConversion.convertSpeed(data.topSpeed.max_speed!, units).toFixed(2))
        : "-",
      unit: UnitDefinitions[units].speed
    },
    {
      label: "Max Watts",
      value: data.maxWatts ? String(data.maxWatts.max_watts!) : "-",
      unit: "W"
    },
    {
      label: "Highest Heartrate",
      value: data.maxHeartrate ? String(data.maxHeartrate.max_heartrate!) : "-",
      unit: "bpm"
    },
    {
      label: "Most Elevation Gain",
      value: data.highestElevation
        ? String(unitConversion.convertElevation(data.highestElevation.total_elevation_gain!, units).toFixed(0))
        : "-",
      unit: UnitDefinitions[units].elevation
    },
    {
      label: "PRs",
      value: data.prCount ? String(data.prCount) : "-",
      unit: "prs"
    },
    {
      label: "Athletes",
      value: data.athleteCount ? String(data.athleteCount) : "-",
      unit: "people"
    }
  ], [data, units])

  return (
    <Card
      title="Records"
      description="your top stats"
      icon={<Award size={16} strokeWidth={2} />}
    >
      <div className="w-full grid grid-cols-2 p-2 gap-2">
        {stats.map((stat, index) => (
          <Stat
            key={`stat-${index}`}
            label={stat.label}
            value={stat.value}
            unit={stat.unit}
          />
        ))}
      </div>
    </Card>
  )
}