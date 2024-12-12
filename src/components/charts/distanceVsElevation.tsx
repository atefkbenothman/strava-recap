import { useContext, useEffect, useState } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { unitConversion } from "../../utils/utils"
import { SportType } from "../../types/strava"
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ZAxis,
  ReferenceLine,
} from "recharts"
import Card from "../card"
import { ChartNoAxesCombined } from 'lucide-react'
import { UnitDefinitions } from "../../types/activity"

type ScatterChartData = {
  distance: number
  elevation: number
  fill: string
}

/*
 * Elevation gained per distance
 */
export default function DistanceVsElevation() {
  const { activityData, colorPalette, units } = useContext(RecapContext)

  const [data, setData] = useState<ScatterChartData[]>([])
  const [avgElevationPerDistance, setAvgElevationPerDistance] = useState<number>(0)

  useEffect(() => {
    if (!activityData) return
    function formatData() {
      let totalDistance = 0
      let totalElevation = 0
      const res: ScatterChartData[] = []
      activityData.all!.forEach(act => {
        const distance = Math.round(unitConversion.convertDistance(act.distance!, units))
        const elevation = Math.round(unitConversion.convertElevation(act.total_elevation_gain!, units))
        const sportType = act.sport_type! as SportType
        res.push({ distance, elevation, fill: colorPalette[sportType] })
        totalDistance += distance
        totalElevation += elevation
      })
      setData(res)
      const avg = Math.round(totalElevation / totalDistance)
      setAvgElevationPerDistance(avg)
    }
    formatData()
  }, [activityData, colorPalette, units])

  return (
    <Card
      title="Distance vs. Elevation"
      description="elevation gained per distance"
      icon={<ChartNoAxesCombined size={16} strokeWidth={2} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <ScatterChart>
          <Scatter data={data} isAnimationActive={false} />
          <XAxis
            type="number"
            dataKey="distance"
            name="distance"
            unit={UnitDefinitions[units].distance}
            tick={{ fontSize: 10 }}
          />
          <YAxis
            type="number"
            dataKey="elevation"
            name="elevation"
            unit={UnitDefinitions[units].elevation}
            tick={{ fontSize: 10 }}
            width={38}
          />
          <ZAxis range={[30, 40]} />
          <Tooltip />
          <ReferenceLine
            ifOverflow="extendDomain"
            segment={[
              { x: 0, y: 0 },
              { x: Math.max(...data.map(d => d.distance)), y: Math.max(...data.map(d => d.distance)) * avgElevationPerDistance }
            ]}
            stroke="black"
            strokeDasharray="3 3"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  )
}