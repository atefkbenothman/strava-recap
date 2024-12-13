import { useContext, useEffect, useState } from "react"
import { ActivityDataContext } from "../../contexts/context"
import { StravaActivity } from "../../types/strava"
import { unitConversion } from "../../utils/utils"
import { Trophy } from 'lucide-react'
import Card from "../card"
import NoData from "../noData"

import polyline from "@mapbox/polyline"
import { UnitDefinitions } from "../../types/activity"


const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

type MetricProps = {
  label: string
  value: string
  unit: string
}

function Metric({ label, value, unit }: MetricProps) {
  return (
    <div className="flex flex-col rounded p-1 gap-1">
      <p className="text-xs flex justify-center">{label}</p>
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
  const { activityData, units } = useContext(ActivityDataContext)

  const [biggestActivity, setBiggestActivity] = useState<StravaActivity>()
  const [route, setRoute] = useState<[number, number][] | null>()

  useEffect(() => {
    if (!activityData || activityData.all!.length === 0) return
    function getBiggestActivity() {
      const biggestAct = activityData.all!.reduce((acc, activity) => {
        return activity.distance! > acc.distance! ? activity : acc
      }, activityData.all![0])
      setBiggestActivity(biggestAct)
      if (biggestAct.map?.summary_polyline) {
        const route = polyline.decode(biggestAct.map!.summary_polyline!)
        setRoute(route)
      }
    }
    getBiggestActivity()
  }, [activityData])

  if (biggestActivity === null) {
    return (
      <Card
        title="Biggest Activity"
        icon={<Trophy size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Biggest Activity"
      description=""
      icon={<Trophy size={16} strokeWidth={2} />}
    >
      <div className="flex justify-center">
        {!biggestActivity || activityData.all!.length === 0 ? (
          <NoData />
        ) : (
          <div className="grid grid-rows-[repeat(3,min-content)_1fr] h-full gap-4 rounded p-1">
            <div className="flex justify-center">
              <p>{biggestActivity.name}</p>
            </div>
            <div className="flex items-center justify-center">
              {route ? (
                <a
                  href={`https://www.strava.com/activities/${biggestActivity?.id}`}
                  target="_blank"
                  className="flex items-center justify-center w-[80%]"
                >
                  <img
                    src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s-a+9ed4bd(${biggestActivity.start_latlng![1]
                      },${biggestActivity.start_latlng![0]}),pin-s-b+000(${biggestActivity.end_latlng![1]
                      },${biggestActivity.end_latlng![0]}),path-5+f44-0.5(${encodeURIComponent(
                        polyline.encode(route)
                      )})/auto/500x500?access_token=${token}&zoom=14`}
                    alt="map"
                    height="80%"
                    width="100%"
                    className="rounded hover:cursor-pointer"
                  />
                </a>
              ) : null}
            </div>
            <div className="flex gap-8 mx-2 items-center justify-center">
              <Metric
                label="Distance"
                value={unitConversion.convertDistance(biggestActivity.distance!, units).toFixed(1)}
                unit={UnitDefinitions[units].distance}
              />
              <Metric
                label="Elevation"
                value={unitConversion.convertElevation(biggestActivity.total_elevation_gain!, units).toFixed(0)}
                unit={UnitDefinitions[units].elevation}
              />
              <Metric
                label="Time"
                value={unitConversion.convertTime(biggestActivity.moving_time!, "hours").toFixed(1)}
                unit="hrs"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
