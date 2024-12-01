import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { StravaActivity } from "../../types/strava"
import { unitConversion } from "../../utils/utils"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

type SportType = {
  type: string
  distance: number
  elevation: number
}

export default function TotalDistanceElevation() {
  const { activities } = useContext(RecapContext)
  let totalDistance = 0
  let totalElevation = 0
  let data = activities.reduce((acc: SportType[], activity: StravaActivity) => {
    const type = activity.sport_type!
    const distance = unitConversion.convertFromMetersToMi(activity.distance!)
    const elevation = unitConversion.convertFromMetersToFeet(activity.total_elevation_gain!)
    const existingType = acc.find((t) => t.type === type)
    totalDistance += distance
    totalElevation += elevation
    if (existingType) {
      existingType.distance += distance
      existingType.elevation += elevation
    } else {
      acc.push({ type, distance: distance, elevation: elevation })
    }
    return acc
  }, [])
  data = data.map((sportType: SportType) => {
    return { type: sportType.type, distance: Math.round(sportType.distance), elevation: Math.round(sportType.elevation) }
  })
  data = data.sort((a: SportType, b: SportType) => {
    return b.elevation - a.elevation
  })
  const COLORS = ["#06D6A0", "#118AB2", "#073B4C"]
  return (
    <div className="flex flex-col w-full h-full relative">
      <p className="font-semibold mt-2 mx-2">Distance/Elevation</p>
      <p className="mx-2 mb-2 text-xs font-normal text-gray-800 w-1/2">total distance + elevation per sport</p>
      <div className="absolute top-2 right-2 rounded text-right">
        <p className="text-3xl">{Math.round(totalDistance)}</p>
        <p style={{ fontSize: "10px" }}>mi</p>
        <p className="text-lg">{Math.round(totalElevation)}</p>
        <p style={{ fontSize: "10px" }}>ft</p>
      </div>
      <div className="flex w-full h-full items-center justify-center p-2">
        <ResponsiveContainer height={350} width="90%">
          <BarChart data={data} >
            <YAxis yAxisId="left" type="number" hide={true} />
            <YAxis yAxisId="right" type="number" orientation="right" hide={true} />
            <Bar dataKey="distance" yAxisId="left" fill={COLORS[0]} isAnimationActive={false} label={{ position: "top", fontSize: 12 }} />
            <Bar dataKey="elevation" yAxisId="right" fill={COLORS[1]} isAnimationActive={false} label={{ position: "top", fontSize: 12 }} />
            <XAxis type="category" dataKey="type" tick={{ fontSize: 12 }} />
            <Tooltip />
            {/* <Legend verticalAlign="bottom" align="center" /> */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
