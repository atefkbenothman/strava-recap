import { useEffect, useState } from "react"
import { StravaActivity } from "../../types/strava"
import { unitConversion } from "../../utils/utils"
import { Trophy } from 'lucide-react'
import Card from "../common/card"
import NoData from "../common/noData"
import polyline from "@mapbox/polyline"
import { UnitDefinitions } from "../../types/activity"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"


const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

type MetricProps = {
  label: string
  value: string
  unit: string
}

function Metric({ label, value, unit }: MetricProps) {
  return (
    <div className="flex flex-col rounded p-2 w-full bg-gray-200 dark:bg-[#222628]">
      <p className="text-[10px] flex justify-center text-black/75 dark:text-white/75">{label}</p>
      <div className="flex flex-col w-full h-full items-center justify-center">
        <p className="font-semibold text-lg">
          {value}
        </p>
        <p className="text-xs"> {unit}</p>
      </div>
    </div>
  )
}

/*
 * Biggest Activity by distance
*/
export default function BiggestActivity() {
  const { activityData, units } = useStravaActivityContext()

  const [biggestActivity, setBiggestActivity] = useState<StravaActivity | null>()
  const [route, setRoute] = useState<[number, number][] | null>()

  useEffect(() => {
    if (!activityData || !activityData.all || activityData.all.length === 0) return
    try {
      const longestAct = activityData.all.reduce((acc: StravaActivity | null, act) => {
        if (act.distance) {
          if (!acc) return act
          return act.distance > acc.distance! ? act : acc
        }
        return acc
      }, null)
      setBiggestActivity(longestAct)
      if (longestAct) {
        if (longestAct.map && longestAct.map.summary_polyline) {
          setRoute(polyline.decode(longestAct.map.summary_polyline))
        }
      }
    } catch (err) {
      console.warn(err)
      setBiggestActivity(null)
      setRoute(null)
    }
  }, [activityData])

  if (!biggestActivity) {
    return (
      <Card
        title="Biggest Activity"
        description="your longest activity"
        icon={<Trophy size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Biggest Activity"
      description={
        biggestActivity.start_date
          ? new Date(biggestActivity.start_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
          : "Date not available"
      }
      icon={<Trophy size={16} strokeWidth={2} />}
    >
      <div className="w-full h-full grid grid-rows-12 max-h-[400px]">
        <div className="row-span-8 w-full h-full">
          <div className="flex items-center justify-center w-full h-full p-2 rounded">
            {route ? (
              <a
                href={`https://www.strava.com/activities/${biggestActivity?.id}`}
                target="_blank"
                className="block w-fit h-full"
              >
                <div className="w-fit h-full rounded">
                  <img
                    src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s-a+9ed4bd(${biggestActivity.start_latlng![1]
                      },${biggestActivity.start_latlng![0]}),pin-s-b+000(${biggestActivity.end_latlng![1]
                      },${biggestActivity.end_latlng![0]}),path-5+f44-0.5(${encodeURIComponent(
                        polyline.encode(route)
                      )})/auto/400x400?access_token=${token}&zoom=14`}
                    alt="map"
                    className="w-fit h-full object-contain rounded hover:cursor-pointer shadow bg-blue-600"
                  />
                </div>
              </a>
            ) : null}
          </div>
        </div>
        <div className="row-span-1 w-full flex justify-center items-center overflow-hidden pt-2">
          <p className="text-base font-medium break-all line-clamp-1 px-10 dark:text-white/95">{biggestActivity.name}</p>
        </div>
        <div className="row-span-3 w-full grid grid-cols-3 px-4">
          <div className="p-2 flex items-center justify-center">
            <Metric
              label="Distance"
              value={unitConversion.convertDistance(biggestActivity.distance!, units).toFixed(1)}
              unit={UnitDefinitions[units].distance}
            />
          </div>
          <div className="p-2 flex items-center justify-center">
            <Metric
              label="Elevation"
              value={unitConversion.convertElevation(biggestActivity.total_elevation_gain!, units).toFixed(0)}
              unit={UnitDefinitions[units].elevation}
            />
          </div>
          <div className="p-2 flex items-center justify-center">
            <Metric
              label="Time"
              value={unitConversion.convertTime(biggestActivity.moving_time!, "hours").toFixed(1)}
              unit="hrs"
            />
          </div>
        </div>
      </div>
    </Card >
  )
}