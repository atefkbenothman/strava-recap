// import { useContext, useEffect, useState } from "react"
// import { ActivityDataContext } from "../../contexts/context"
// import { unitConversion } from "../../utils/utils"
// import { StravaActivity } from "../../types/strava"
// import { UnitDefinitions } from "../../types/activity"
// import Card from "../card"
// import Stat from "../stat"
// import NoData from "../noData"
// import { Footprints } from "lucide-react"
// import polyline from "@mapbox/polyline"

// const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

// /*
//  * Activity Heatmap
//  */
// export default function HeatMap() {
//   const { activityData, units } = useContext(ActivityDataContext)

//   const [startActivity, setStartActivity] = useState<StravaActivity | null>()
//   const [route, setRoute] = useState<string | null>()

//   useEffect(() => {
//     if (!activityData || activityData.all!.length === 0) return
//     function generatePolylines() {
//       // const decodedPolylines = activityData.all!.splice(0, 2).map(activity => {
//       //   if (activity.map?.summary_polyline) {
//       //     return polyline.decode(activity.map!.summary_polyline!)
//       //   }
//       //   return null
//       // })
//       // const combinedCoordinates = decodedPolylines.flat();
//       // const combinedPolyline = polyline.encode(combinedCoordinates as [number, number][])
//       // setRoute(combinedPolyline)
//       // // const combinedCoords = routes.reduce<[number, number][]>((acc, coords) => {
//       // //   if (coords) {
//       // //     acc?.push(...coords)
//       // //   }
//       // //   return acc
//       // // }, [] as [number, number][])
//       // // setRoute(combinedCoords)
//       // const randomActivity = activityData.all![Math.floor(Math.random() * activityData.all!.length)]
//       // setStartActivity(randomActivity)
//       // // setRoute(polyline.decode(randomActivity.map!.summary_polyline!))
//     }
//     generatePolylines()
//   }, [activityData])

//   return (
//     <Card
//       title="Heatmap"
//       icon={<Footprints size={16} strokeWidth={2} />}
//     >
//       {route && startActivity ? (
//         <img
//           src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s-a+9ed4bd(${startActivity.start_latlng![1]
//             },${startActivity.start_latlng![0]}),pin-s-b+000(${startActivity.end_latlng![1]
//             },${startActivity.end_latlng![0]}),path-5+f44-0.5(${encodeURIComponent(route)})/auto/500x500?access_token=${token}&zoom=14`}
//           alt="map"
//           height="80%"
//           width="100%"
//           className="rounded hover:cursor-pointer"
//         />
//       ) : null}
//       {/* {!data || activityData.all!.length === 0 ? (
//         <NoData />
//       ) : (
//         <div className="w-full grid grid-cols-2 p-2 gap-2">
//           <Stat
//             label="Top Speed"
//             value={String((unitConversion.convertSpeed(data.topSpeed!.max_speed!, units)).toFixed(1))}
//             unit={UnitDefinitions[units].speed}
//           />
//           <Stat
//             label="Max Watts"
//             value={data.maxWatts!.max_watts !== undefined ? String(data.maxWatts!.max_watts) : "-"}
//             unit="W"
//           />
//           <Stat
//             label="Highest Heartrate"
//             value={data.maxHeartrate!.max_heartrate !== undefined ? String(data.maxHeartrate!.max_heartrate) : "-"}
//             unit="bpm"
//           />
//           <Stat
//             label="Most Elevation Gain"
//             value={String((unitConversion.convertElevation(data.highestElevation!.total_elevation_gain!, units)).toFixed(0))}
//             unit={UnitDefinitions[units].elevation}
//           />
//           <Stat
//             label="PRs"
//             value={String(data.prCount)}
//             unit="prs"
//           />
//           <Stat
//             label="Athletes"
//             value={String(data.athleteCount)}
//             unit="people"
//           />
//         </div>
//       )} */}
//     </Card >
//   )
// }