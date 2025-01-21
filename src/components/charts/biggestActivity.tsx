import { useMemo } from "react"
import { StravaActivity } from "../../types/strava"
import { unitConversion } from "../../utils/utils"
import { Trophy } from 'lucide-react'
import Card from "../common/card"
import NoData from "../common/noData"
import polyline from "@mapbox/polyline"
import { UnitDefinitions } from "../../types/activity"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"

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
        <p className="font-semibold text-lg">{value}</p>
        <p className="text-xs">{unit}</p>
      </div>
    </div>
  )
}

export const findBiggestActivity = (activities: StravaActivity[]) => {
  if (!activities || activities.length === 0) return null

  return activities.reduce((acc: StravaActivity | null, act) => {
    if (act.distance) {
      if (!acc) return act
      return act.distance > acc.distance! ? act : acc
    }
    return acc
  }, null)
}

/*
 * Biggest Activity by distance
*/
export default function BiggestActivity() {
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ?? null
  const { activitiesData, units } = useStravaActivityContext()

  const { activity, route } = useMemo(() => {
    if (!activitiesData?.all?.length) {
      return { activity: null, route: null }
    }

    try {
      const biggestActivity = findBiggestActivity(activitiesData.all)
      const decodedRoute = biggestActivity?.map?.summary_polyline
        ? polyline.decode(biggestActivity.map.summary_polyline)
        : null

      return { activity: biggestActivity, route: decodedRoute }
    } catch (err) {
      console.warn(err)
      return { activity: null, route: null }
    }
  }, [activitiesData])

  if (!activity) {
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

  const formattedDate = activity.start_date
    ? new Date(activity.start_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
    : "Date not available"

  const metrics = [
    {
      label: "Distance",
      value: unitConversion.convertDistance(activity.distance!, units).toFixed(1),
      unit: UnitDefinitions[units].distance
    },
    {
      label: "Elevation",
      value: unitConversion.convertElevation(activity.total_elevation_gain!, units).toFixed(0),
      unit: UnitDefinitions[units].elevation
    },
    {
      label: "Time",
      value: unitConversion.convertTime(activity.moving_time!, "hours").toFixed(1),
      unit: "hrs"
    }
  ]

  return (
    <Card
      title="Biggest Activity"
      description={formattedDate}
      icon={<Trophy size={16} strokeWidth={2} />}
    >
      <div className="w-full h-full grid grid-rows-12 max-h-[400px]">
        {route && token && (
          <div className="row-span-8 w-full h-full flex items-center justify-center">
            <div className="flex w-fit h-full p-2 rounded">
              <a
                href={`https://www.strava.com/activities/${activity.id}`}
                target="_blank"
                className="block w-fit h-full"
              >
                <img
                  src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s-a+9ed4bd(${activity.start_latlng![1]
                    },${activity.start_latlng![0]
                    }),pin-s-b+000(${activity.end_latlng![1]
                    },${activity.end_latlng![0]
                    }),path-5+f44-0.5(${encodeURIComponent(polyline.encode(route))
                    })/auto/400x400?access_token=${token}&zoom=14`}
                  alt="map"
                  className="h-full rounded hover:cursor-pointer shadow"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        )}
        <div className="row-span-1 w-full flex justify-center items-center overflow-hidden pt-2">
          <p className="text-base font-medium break-all line-clamp-1 px-10 dark:text-white/95">
            {activity.name}
          </p>
        </div>
        <div className="row-span-3 w-full grid grid-cols-3 px-4">
          {metrics.map(metric => (
            <div key={metric.label} className="p-2 flex items-center justify-center">
              <Metric {...metric} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}