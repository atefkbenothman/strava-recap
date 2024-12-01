import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { unitConversion } from "../../utils/utils"


const RecordDisplay = ({ label, value, unit }: { label: string, value: string, unit: string }) => {
  return (
    <div className="w-full h-full p-2 flex flex-col h-full w-full bg-gray-300 rounded">
      <p className="text-sm">{label}</p>
      <div className="flex flex-col w-full h-full items-center justify-center">
        <p className="font-semibold text-4xl">
          {value}
        </p>
        <p className="text-sm"> {unit}</p>
      </div>
    </div>
  )
}

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
    return (
      <div className="flex flex-col w-full h-full">
        <p className="text-lg font-semibold m-1 underline">Records</p>
        {/* <div className="flex w-full h-full items-center justify-center">
          <div className="flex w-full h-full grid grid-cols-2 gap-12 p-12">
            <RecordDisplay
              label="Top Speed"
              value={unitConversion.convertMetersPerSecondToMph(topSpeed.max_speed!).toFixed(1)}
              unit="mph"
            />
            <RecordDisplay
              label="Max Watts"
              value={maxWatts.max_watts !== undefined ? String(maxWatts.max_watts) : "-"}
              unit="W"
            />
            <RecordDisplay
              label="Highest Heartrate"
              value={maxHearrate.max_heartrate !== undefined ? String(maxHearrate.max_heartrate) : "-"}
              unit="bpm"
            />
            <RecordDisplay
              label="Most Elevation Gain"
              value={unitConversion.convertFromMetersToFeet(highestElevation.total_elevation_gain!).toFixed(0)}
              unit="ft"
            />
          </div>
        </div> */}
      </div>
    )
  }
}
