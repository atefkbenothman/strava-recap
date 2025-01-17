import { useEffect, useState } from "react"
import { unitConversion } from "../../utils/utils"
import { StravaActivity } from "../../types/strava"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"

import Card from "../common/card"
import Stat from "../common/stat"
import NoData from "../common/noData"
import { UnitDefinitions } from "../../types/activity"
import { Award } from "lucide-react"


type CardData = {
  topSpeed?: StravaActivity
  highestElevation?: StravaActivity
  maxWatts?: StravaActivity
  maxHeartrate?: StravaActivity
  prCount?: number
  athleteCount?: number
}

/*
 * Top 5 activities (distance) per sport
*/
export default function TopFive() {
  const { activityData, units } = useStravaActivityContext()

  const [data, setData] = useState<CardData>()

  useEffect(() => {
    function getRecords() {
      if (!activityData || activityData.all!.length < 0) return
      const topSpeed = activityData.all!.reduce((acc, act) => {
        return act.max_speed! > acc.max_speed! ? act : acc
      }, activityData.all![0])
      const highestElevation = activityData.all!.reduce((acc, act) => {
        return act.total_elevation_gain! > acc.total_elevation_gain! ? act : acc
      }, activityData.all![0])
      const maxWatts = activityData.all!
        .filter(activity => activity.max_watts !== undefined)
        .reduce((maxActivity, act) => {
          return act.max_watts! > (maxActivity.max_watts ?? 0) ? act : maxActivity
        }, activityData.all![0])
      const maxHeartrate = activityData.all!
        .filter(activity => activity.max_heartrate !== undefined)
        .reduce((maxAct, act) => {
          return act.max_heartrate! > (maxAct.max_heartrate ?? 0) ? act : maxAct
        }, activityData.all![0])
      const prCount = activityData.all!.reduce((count, act) => {
        return count += act.pr_count ?? 0
      }, 0)
      const athleteCount = activityData.all!.reduce((count, act) => {
        return count += act.athlete_count !== undefined ? act.athlete_count - 1 : 0
      }, 0)
      setData({ topSpeed, highestElevation, maxWatts, maxHeartrate, prCount, athleteCount } as CardData)
    }
    getRecords()
  }, [activityData, units])

  if (data === undefined || !activityData || activityData.all!.length === 0) {
    return (
      <Card
        title="Top 5"
        description="top five distances per sport"
        icon={<Award size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Top 5"
      description="top five distances per sport"
      icon={<Award size={16} strokeWidth={2} />}
    >
      <div className="w-full grid grid-cols-2 p-2 gap-2">
        <Stat
          label="Top Speed"
          value={String((unitConversion.convertSpeed(data.topSpeed!.max_speed!, units)).toFixed(1))}
          unit={UnitDefinitions[units].speed}
        />
        <Stat
          label="Max Watts"
          value={data.maxWatts!.max_watts !== undefined ? String(data.maxWatts!.max_watts) : "-"}
          unit="W"
        />
        <Stat
          label="Highest Heartrate"
          value={data.maxHeartrate!.max_heartrate !== undefined ? String(data.maxHeartrate!.max_heartrate) : "-"}
          unit="bpm"
        />
        <Stat
          label="Most Elevation Gain"
          value={String((unitConversion.convertElevation(data.highestElevation!.total_elevation_gain!, units)).toFixed(0))}
          unit={UnitDefinitions[units].elevation}
        />
        <Stat
          label="PRs"
          value={String(data.prCount)}
          unit="prs"
        />
        <Stat
          label="Athletes"
          value={String(data.athleteCount)}
          unit="people"
        />
      </div>
    </Card >
  )
}
