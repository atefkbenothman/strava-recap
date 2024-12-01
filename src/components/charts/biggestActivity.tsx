import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { StravaActivity } from "../../types/strava"
import { unitConversion } from "../../utils/utils"
import polyline from "@mapbox/polyline"
import "leaflet/dist/leaflet.css"



const MetricDisplay = ({ label, value, unit }: { label: string, value: string, unit: string }) => {
  return (
    <div className="flex flex-col bg-gray-200 rounded">
      <p className="text-xs">{label}</p>
      <div className="flex flex-col items-center justify-center">
        <p className="font-semibold text-xl">
          {value}
        </p>
        <p className="text-xs"> {unit}</p>
      </div>
    </div>
  )
}

const token = "pk.eyJ1IjoiYXRlZmthaWJlbm90aG1hbiIsImEiOiJjbGU1Mms1aGQwMzk2M3BwMzhyOWx2dDV2In0.Iqr4f_ZJMostXFJ3NJB1RA"

export default function BiggestActivity() {
  const { activities } = useContext(RecapContext)
  if (activities.length < 1) {
    return
  }
  const biggestActivity = activities.reduce((biggestActivity: StravaActivity, activity: StravaActivity) => {
    return activity.distance! > biggestActivity.distance! ? activity : biggestActivity
  }, activities[0])
  const route = polyline.decode(biggestActivity.map?.summary_polyline!)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
      <div className="h-full">
        <p className="font-semibold p-2">Biggest Activity</p>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-md">{biggestActivity.name}</p>
            <div className="grid grid-cols-3 gap-2 h-full">
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
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <img
          src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s-a+9ed4bd(${biggestActivity.start_latlng![1]
            },${biggestActivity.start_latlng![0]}),pin-s-b+000(${biggestActivity.end_latlng![1]
            },${biggestActivity.end_latlng![0]}),path-5+f44-0.5(${encodeURIComponent(
              polyline.encode(route)
            )})/auto/500x500?access_token=${token}&zoom=14`}
          alt="map"
          height="100%"
          width="90%"
          className="rounded"
        />
      </div>
    </div>
  )
}
