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
        <p className="text-lg font-semibold m-1">Biggest Records</p>
        <div className="flex flex-col w-full h-full items-center justify-center px-4">
          <p>{biggestActivity.name}</p>
          <p>{biggestActivity.distance}</p>
          <p>{biggestActivity.total_elevation_gain}</p>
        </div>
      </div>
    )
  }
}