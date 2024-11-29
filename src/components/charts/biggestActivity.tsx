import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { StravaActivity } from "../../types/strava";

export default function BiggestActivity() {
  const { activities } = useContext(RecapContext)
  if (activities.length > 0) {
    const biggestActivity = activities.reduce((biggestActivity: StravaActivity, activity: StravaActivity) => {
      return activity.distance! > biggestActivity.distance! ? activity : biggestActivity
    }, activities[0])
    return (
      <div className="flex flex-col w-full h-full">
        <p className="text-lg font-semibold m-1">Biggest Activity</p>
        {/* <div className="flex flex-col w-full h-full">
          <div className="justify-center flex">
            <p className="text-3xl p-1 bg-gray-300 rounded font-semibold">{biggestActivity.name}</p>
          </div>
          <div className="flex h-full w-full grid grid-cols-2 gap-2 p-1">
            <div className="bg-gray-300 rounded-lg p-1 flex flex-col h-full w-full">
              <p className="m-1">Top Speed</p>
              <div className="flex w-full h-full items-center justify-center">
                <p className="font-bold text-4xl">{biggestActivity.distance}<span className="text-sm font-semibold"> mi</span></p>
              </div>
            </div>
            <div className="bg-gray-300 rounded-lg p-1 flex flex-col h-full w-full">
              <p className="m-1">Top Speed</p>
              <div className="flex w-full h-full items-center justify-center">
                <p className="font-bold text-4xl">{biggestActivity.distance}<span className="text-sm font-semibold"> mi</span></p>
              </div>
            </div>
            <div className="bg-gray-300 rounded-lg p-1 flex flex-col h-full w-full">
              <p className="m-1">Top Speed</p>
              <div className="flex w-full h-full items-center justify-center">
                <p className="font-bold text-4xl">{biggestActivity.distance}<span className="text-sm font-semibold"> mi</span></p>
              </div>
            </div>
            <div className="bg-gray-300 rounded-lg p-1 flex flex-col h-full w-full">
              <p className="m-1">Top Speed</p>
              <div className="flex w-full h-full items-center justify-center">
                <p className="font-bold text-4xl">{biggestActivity.distance}<span className="text-sm font-semibold"> mi</span></p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    )
  }
}