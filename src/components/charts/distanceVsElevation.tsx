import { useEffect, useState } from "react"
import {
  ReferenceLinePoints,
  TrendCoefficients,
  calculateTrendLine,
  calculateTrendLinePoints,
  unitConversion
} from "../../utils/utils"
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
import Card from "../common/card"
import { ChartNoAxesCombined } from 'lucide-react'
import { UnitDefinitions } from "../../types/activity"
import NoData from "../common/noData"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"

type ScatterChartData = {
  distance: number
  elevation: number
  url: string
  fill: string
}

const X_OFFSET = 3
const Y_OFFSET = 3

/*
 * Elevation gained per distance
 */
export default function DistanceVsElevation() {
  const { activityData, units } = useStravaActivityContext()
  const { colorPalette, darkMode } = useThemeContext()

  const [data, setData] = useState<ScatterChartData[]>([])
  const [trend, setTrend] = useState<TrendCoefficients>(
    {
      slope: 0,
      intercept: 0,
      canShowLine: false
    }
  )
  const [referenceLinePoints, setReferenceLinePoints] = useState<ReferenceLinePoints>(
    [
      { x: 0, y: 0 },
      { x: 0, y: 0 }
    ]
  )

  useEffect(() => {
    function formatData() {
      if (!activityData) return
      let totalDistance = 0
      let totalElevation = 0
      const res: ScatterChartData[] = []
      activityData.all!.forEach(act => {
        const id = act.id!
        const distance = Math.round(unitConversion.convertDistance(act.distance!, units))
        const elevation = Math.round(unitConversion.convertElevation(act.total_elevation_gain!, units))
        if (distance === 0 && elevation === 0) return
        const sportType = act.sport_type! as SportType
        res.push({ distance, elevation, fill: colorPalette[sportType as SportType]!, url: `https://www.strava.com/activities/${id}` })
        totalDistance += distance
        totalElevation += elevation
      })
      setData(res)
      setTrend(calculateTrendLine(res, "distance", "elevation"))
    }
    formatData()
  }, [activityData, colorPalette, units])

  useEffect(() => {
    if (trend.canShowLine) {
      const xMax = Math.max(...data.map(d => (d["distance"])))
      const yMax = Math.max(...data.map(d => (d["elevation"])))
      setReferenceLinePoints(calculateTrendLinePoints(trend, { xMin: 0, xMax: xMax * 10, yMin: 0, yMax: yMax * 10 }))
    } else {
      setReferenceLinePoints([{ x: 0, y: 0 }, { x: 0, y: 0 }])
    }
  }, [data, trend])

  const handleDotClick = (data: any) => {
    if (data.url) {
      window.open(data.url, "_blank")
    }
  }

  if (data.length === 0) {
    return (
      <Card
        title="Distance vs. Elevation"
        description="elevation gained per distance"
        icon={<ChartNoAxesCombined size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Distance vs. Elevation"
      description="elevation gained per distance"
      icon={<ChartNoAxesCombined size={16} strokeWidth={2} />}
    >
      <ResponsiveContainer height={350} width="90%" className="overflow-hidden">
        <ScatterChart>
          <Scatter
            data={data}
            isAnimationActive={false}
            onClick={handleDotClick}
            className="hover:cursor-pointer"
          />
          <XAxis
            type="number"
            dataKey="distance"
            name="distance"
            unit={UnitDefinitions[units].distance}
            tick={{
              fontSize: 10,
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
            domain={[0, (dataMax: number) => (dataMax + X_OFFSET)]}
            allowDecimals={false}
          />
          <YAxis
            type="number"
            dataKey="elevation"
            name="elevation"
            unit={UnitDefinitions[units].elevation}
            tick={{
              fontSize: 10,
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
            width={38}
            allowDecimals={false}
            domain={[0, (dataMax: number) => (dataMax + Y_OFFSET)]}
          />
          {trend.canShowLine && (
            <ReferenceLine
              ifOverflow="extendDomain"
              segment={referenceLinePoints!}
              stroke={darkMode ? "#c2c2c2" : "black"}
              strokeDasharray="3 3"
            />
          )}
          <Tooltip />
          <ZAxis range={[30, 40]} />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  )
}