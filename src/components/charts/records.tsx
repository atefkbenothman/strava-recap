import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { unitConversion } from "../../utils/utils"

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
        <p className="text-lg font-semibold m-1">Records</p>
        <div className="flex w-full h-full items-center justify-center p-2">
          <div className="flex w-full h-full grid grid-cols-2 gap-2">
            <div className="bg-gray-300 rounded-lg p-1 flex flex-col h-full w-full">
              <p className="m-1">Top Speed</p>
              <div className="flex w-full h-full items-center justify-center">
                <p className="font-bold text-4xl">{unitConversion.convertMetersPerSecondToMph(topSpeed.max_speed!).toFixed(1)}<span className="text-sm font-semibold"> mph</span></p>
              </div>
            </div>
            <div className="bg-gray-300 rounded-lg p-1 flex flex-col h-full w-full">
              <p className="m-1">Max Watts</p>
              <div className="flex w-full h-full items-center justify-center">
                <p className="font-bold text-4xl">{maxWatts.max_watts}<span className="text-sm font-semibold"> W</span></p>
              </div>
            </div>
            <div className="bg-gray-300 rounded-lg p-1 flex flex-col h-full w-full">
              <p className="m-1">Highest Heartrate</p>
              <div className="flex w-full h-full items-center justify-center">
                <p className="font-bold text-4xl">{maxHearrate.max_heartrate}<span className="text-sm font-semibold"> bpm</span></p>
              </div>
            </div>
            <div className="bg-gray-300 rounded-lg p-1 flex flex-col h-full w-full">
              <p className="m-1">Most Elevation Gain</p>
              <div className="flex w-full h-full items-center justify-center">
                <p className="font-bold text-4xl">{unitConversion.convertFromMetersToFeet(highestElevation.total_elevation_gain!).toFixed(0)}<span className="text-sm font-semibold"> ft</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
