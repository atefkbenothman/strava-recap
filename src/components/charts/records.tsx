import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { unitConversion } from "../../utils/utils"
import { StravaActivity } from "../../types/strava"
import { Medal } from 'lucide-react'

import Card from "../card"
import Stat from "../stat"


export default function Records() {
  const { activities } = useContext(RecapContext)
  if (activities.length > 0) {
    const topSpeed = activities.reduce((acc, activity) => {
      return activity.max_speed! > acc.max_speed! ? activity : acc
    }, activities[0])
    const highestElevation = activities.reduce((acc, activity) => {
      return activity.total_elevation_gain! > acc.total_elevation_gain! ? activity : acc
    }, activities[0])
    const maxWatts = activities
      .filter(activity => activity.max_watts !== undefined)
      .reduce((maxActivity, activity) => {
        return activity.max_watts! > (maxActivity.max_watts ?? 0) ? activity : maxActivity
      }, activities[0])
    const maxHearrate = activities
      .filter(activity => activity.max_heartrate !== undefined)
      .reduce((maxActivity, activity) => {
        return activity.max_heartrate! > (maxActivity.max_heartrate ?? 0) ? activity : maxActivity
      }, activities[0])
    const prCount = activities.reduce((count: number, activity: StravaActivity) => {
      return count += activity.pr_count ?? 0
    }, 0)
    const athleteCount = activities.reduce((count: number, activity: StravaActivity) => {
      return count += activity.athlete_count !== undefined ? activity.athlete_count - 1 : 0
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
}
