import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"

export default function Records() {
  const { activities } = useContext(RecapContext)
  if (activities.length > 0) {
    const topSpeed = activities.reduce((acc, activity) => {
      return activity.max_speed! > acc.max_speed! ? activity : acc
    }, activities[0])
    const highestElevation = activities.reduce((acc, activity) => {
      return activity.total_elevation_gain! > acc.total_elevation_gain! ? activity : acc
    }, activities[0])
    return (
      <div className="flex flex-col w-full h-full">
        <p className="text-lg font-semibold m-1">Records</p>
        <div className="flex w-full h-full items-center justify-center p-2">
          <div className="flex w-full h-full grid grid-cols-2 gap-2">
            <div className="bg-[#e0e0e0] rounded-lg p-1 flex flex-col h-full w-full">
              <p className="m-1">Top Speed</p>
              <div className="flex w-full h-full items-center justify-center">
                <p className="font-bold text-3xl">{topSpeed.max_speed?.toFixed(2)}<span className="text-sm font-semibold"> mph</span></p>
              </div>
            </div>
            <div className="bg-[#e0e0e0] rounded-lg p-1 flex flex-col h-full w-full">
              <p className="m-1">Top Speed</p>
              <div className="flex w-full h-full items-center justify-center">
                <p className="font-bold text-3xl">{topSpeed.max_speed?.toFixed(2)}<span className="text-sm font-semibold"> mph</span></p>
              </div>
            </div>
            <div className="bg-[#e0e0e0] rounded-lg p-1 flex flex-col h-full w-full">
              <p className="m-1">Top Speed</p>
              <div className="flex w-full h-full items-center justify-center">
                <p className="font-bold text-3xl">{topSpeed.max_speed?.toFixed(2)}<span className="text-sm font-semibold"> mph</span></p>
              </div>
            </div>
            <div className="bg-[#e0e0e0] rounded-lg p-1 flex flex-col h-full w-full">
              <p className="m-1">Most Elevation Gain</p>
              <div className="flex w-full h-full items-center justify-center">
                <p className="font-bold text-3xl">{highestElevation.total_elevation_gain?.toFixed(0)}<span className="text-sm font-semibold"> ft</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
