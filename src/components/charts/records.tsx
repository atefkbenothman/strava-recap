import { useEffect, useState } from "react"
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
  prCount?: number
  athleteCount?: number
}

const sanitizeData = (data: ActivityData): CardData => {
  if (!data || !data.all || data.all.length === 0) {
    return {}
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
        acc.prCount = (acc.prCount || 0) + (act.pr_count - 1)
      }
      if (act.athlete_count) {
        acc.athleteCount = (acc.athleteCount || 0) + (act.athlete_count - 1)
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
  const { activityData, units } = useStravaActivityContext()

  const [data, setData] = useState<CardData>()

  useEffect(() => {
    if (!activityData || activityData.all!.length < 0) return
    try {
      const cardData = sanitizeData(activityData)
      setData(cardData)
    } catch (err) {
      console.warn(err)
      setData({})
    }
  }, [activityData, units])

  return (
    <Card
      title="Records"
      description="your top stats"
      icon={<Award size={16} strokeWidth={2} />}
    >
      <div className="w-full grid grid-cols-2 p-2 gap-2">
        <Stat
          label="Top Speed"
          value={(data && data.topSpeed) ? String(unitConversion.convertSpeed(data.topSpeed.max_speed!, units).toFixed(2)) : "-"}
          unit={UnitDefinitions[units].speed}
        />
        <Stat
          label="Max Watts"
          value={(data && data.maxWatts) ? String(data.maxWatts.max_watts!) : "-"}
          unit="W"
        />
        <Stat
          label="Highest Heartrate"
          value={(data && data.maxHeartrate) ? String(data.maxHeartrate.max_heartrate!) : "-"}
          unit="bpm"
        />
        <Stat
          label="Most Elevation Gain"
          value={(data && data.highestElevation) ? String(unitConversion.convertElevation(data.highestElevation.total_elevation_gain!, units).toFixed(0)) : "-"}
          unit={UnitDefinitions[units].elevation}
        />
        <Stat
          label="PRs"
          value={(data && data.prCount) ? String(data.prCount) : "-"}
          unit="prs"
        />
        <Stat
          label="Athletes"
          value={(data && data.athleteCount) ? String(data.athleteCount) : "-"}
          unit="people"
        />
      </div>
    </Card >
  )
}
