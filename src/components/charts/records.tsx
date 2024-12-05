import { act, useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { unitConversion } from "../../utils/utils"
import { StravaActivity } from "../../types/strava"
import { Medal } from 'lucide-react'

import Card from "../card"
import Stat from "../stat"


export default function Records() {
  const { activityData } = useContext(RecapContext)
  if (activityData.all!.length === 0) {
    return
  }
  // top speed
  const topSpeed = activityData.all!.reduce((acc, act) => {
    return act.max_speed! > acc.max_speed! ? act : acc
  }, activityData.all![0])
  // highest elevation
  const highestElevation = activityData.all!.reduce((acc, act) => {
    return act.total_elevation_gain! > acc.total_elevation_gain! ? act : acc
  }, activityData.all![0])
  // highest watts
  const maxWatts = activityData.all!
    .filter(activity => activity.max_watts !== undefined)
    .reduce((maxActivity, act) => {
      return act.max_watts! > (maxActivity.max_watts ?? 0) ? act : maxActivity
    }, activityData.all![0])
  // highest heartrate
  const maxHearrate = activityData.all!
    .filter(activity => activity.max_heartrate !== undefined)
    .reduce((maxAct, act) => {
      return act.max_heartrate! > (maxAct.max_heartrate ?? 0) ? act : maxAct
    }, activityData.all![0])
  // pr count
  const prCount = activityData.all!.reduce((count, act) => {
    return count += act.pr_count ?? 0
  }, 0)
  // athlete count
  const athleteCount = activityData.all!.reduce((count, act) => {
    return count += act.athlete_count !== undefined ? act.athlete_count - 1 : 0
  }, 0)
  return (
    <Card title="Records" description="your top stats" icon={<Medal size={16} strokeWidth={2} />}>
      <div className="w-full grid grid-cols-2 p-2 gap-2">
        <Stat
          label="Top Speed"
          value={unitConversion.convertMetersPerSecondToMph(topSpeed.max_speed!).toFixed(1)}
          unit="mph"
        />
        <Stat
          label="Max Watts"
          value={maxWatts.max_watts !== undefined ? String(maxWatts.max_watts) : "-"}
          unit="W"
        />
        <Stat
          label="Highest Heartrate"
          value={maxHearrate.max_heartrate !== undefined ? String(maxHearrate.max_heartrate) : "-"}
          unit="bpm"
        />
        <Stat
          label="Most Elevation Gain"
          value={unitConversion.convertFromMetersToFeet(highestElevation.total_elevation_gain!).toFixed(0)}
          unit="ft"
        />
        <Stat
          label="PRs"
          value={String(prCount)}
          unit="prs"
        />
        <Stat
          label="Athletes"
          value={String(athleteCount)}
          unit="people"
        />
      </div>
    </Card >
  )
}
