import { useEffect, useState } from "react"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"
import {
  unitConversion,
  calculateTrendLine,
  TrendCoefficients,
  ReferenceLinePoints,
  calculateTrendLinePoints
} from "../../utils/utils"
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ReferenceLine
} from "recharts"
import Card from "../common/card"
import { Zap } from 'lucide-react'
import { SportType } from "../../types/strava"
import { UnitDefinitions } from "../../types/activity"
import NoData from "../common/noData"

type ScatterChartData = {
  distance: number
  power: number
  url: string
  fill: string
}

const X_OFFSET = 1
const Y_OFFSET = 20

/*
 * Distance vs Power output
 */
export default function DistanceVsPower() {
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
      const res: ScatterChartData[] = []
      activityData.all!.forEach(act => {
        const id = act.id!
        const distance = Math.round(unitConversion.convertDistance(act.distance!, units))
        const power = act.average_watts
        const sportType = act.sport_type! as SportType
        if (!distance || !power) return
        res.push({ distance: distance, power: power, url: `https://www.strava.com/activities/${id}`, fill: colorPalette[sportType]! })
      })
      setData(res)
      setTrend(calculateTrendLine(res, "distance", "power"))
    }
    formatData()
  }, [activityData, colorPalette, units])

  useEffect(() => {
    if (trend.canShowLine) {
      const xMax = Math.max(...data.map(d => (d["distance"])))
      const yMax = Math.max(...data.map(d => (d["power"])))
      const yMin = Math.min(...data.map(d => (d["power"])))
      setReferenceLinePoints(calculateTrendLinePoints(trend, { xMin: 0, xMax: xMax * 10, yMin: yMin - Y_OFFSET, yMax: yMax * 10 }))
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
        title="Distance vs. Power"
        description="power output per distance"
        icon={<Zap size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Distance vs. Power"
      description="power output per distance"
      icon={<Zap size={16} strokeWidth={2} />}
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
            dataKey="power"
            name="power"
            unit="w"
            // domain={["auto", "auto"]}
            tick={{
              fontSize: 10,
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
            width={38}
            allowDecimals={false}
            domain={[(dataMin: number) => (dataMin - Y_OFFSET), (dataMax: number) => (dataMax + Y_OFFSET)]}
          />
          <Tooltip />
          {trend.canShowLine && (
            <ReferenceLine
              ifOverflow="extendDomain"
              segment={referenceLinePoints!}
              stroke={darkMode ? "#c2c2c2" : "black"}
              strokeDasharray="3 3"
            />
          )}
          <ZAxis range={[30, 40]} />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  )
}
