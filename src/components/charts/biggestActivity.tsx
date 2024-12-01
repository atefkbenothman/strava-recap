import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { StravaActivity } from "../../types/strava"
import { unitConversion } from "../../utils/utils"


const MetricDisplay = ({ label, value, unit }: { label: string, value: string, unit: string }) => {
  return (
    <div className="w-full h-full p-2 flex flex-col h-full w-full bg-gray-200 rounded">
      <p className="text-xs">{label}</p>
      <div className="flex flex-col w-full h-full items-center justify-center">
        <p className="font-semibold text-xl">
          {value}
        </p>
        <p className="text-xs"> {unit}</p>
      </div>
    </div>
  )
}

export default function BiggestActivity() {
  const { activities } = useContext(RecapContext)
  if (activities.length < 1) {
    return
  }
  const biggestActivity = activities.reduce((biggestActivity: StravaActivity, activity: StravaActivity) => {
    return activity.distance! > biggestActivity.distance! ? activity : biggestActivity
  }, activities[0])
  return (
    <div className="flex flex-col w-full h-[400px] p-1">
      <p className="font-semibold">Biggest Activity</p>
      <div className="h-full flex items-center justify-center">
        <p className="text-md">{biggestActivity.name}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 p-2">
        <MetricDisplay
          label="Distance"
          value={unitConversion.convertFromMetersToMi(biggestActivity.distance!).toFixed(1)}
          unit="mi"
        />
        <MetricDisplay
          label="Elevation"
          value={unitConversion.convertFromMetersToFeet(biggestActivity.total_elevation_gain!).toFixed(0)}
          unit="ft"
        />
        <MetricDisplay
          label="Time"
          value={unitConversion.convertSecondsToHours(biggestActivity.moving_time!).toFixed(1)}
          unit="hrs"
        />
        <MetricDisplay
          label="Avg Speed"
          value={unitConversion.convertMetersPerSecondToMph(biggestActivity.average_speed!).toFixed(1)}
          unit="mph"
        />
        <MetricDisplay
          label="Heartrate"
          value={biggestActivity.average_heartrate !== undefined ? String(biggestActivity.average_heartrate) : "-"}
          unit="bpm"
        />
        <MetricDisplay
          label="Suffer Score"
          value={biggestActivity.suffer_score !== undefined ? String(biggestActivity.suffer_score) : "-"}
          unit="pts"
        />
        <MetricDisplay
          label="Avg Watts"
          value={biggestActivity.average_watts !== undefined ? String(biggestActivity.average_watts) : "-"}
          unit="W"
        />
        <MetricDisplay
          label="Max Watts"
          value={biggestActivity.max_watts !== undefined ? String(biggestActivity.max_watts) : "-"}
          unit="W"
        />
        <MetricDisplay
          label="Kudos"
          value={biggestActivity.kudos_count !== undefined ? String(biggestActivity.kudos_count) : "-"}
          unit="kudos"
        />
        {/* <div className="flex h-full w-full grid grid-cols-3 gap-4 p-4">
        </div> */}
      </div>
      {/* <div className="w-full p-2 bg-red-100">
        <div className="flex justify-center">
          <p className="text-3xl p-1 font-semibold">{biggestActivity.name}</p>
        </div>
      </div> */}
    </div>
  )
}