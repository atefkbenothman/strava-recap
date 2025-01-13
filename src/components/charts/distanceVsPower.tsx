import { useEffect, useState } from "react"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"
import {
  unitConversion,
  calculateTrendLine,
  TrendCoefficients,
  ReferenceLinePoints,
  calculateTrendLinePoints,
  ChartBounds,
  getDataBounds,
  calculateTicks
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
import { SportType, StravaActivity } from "../../types/strava"
import { UnitDefinitions } from "../../types/activity"
import NoData from "../common/noData"
import { ColorPalette } from "../../contexts/themeContext"

type ScatterChartData = {
  distance: number
  power: number
  url: string
  fill: string
}

const X_OFFSET = 1
const Y_OFFSET = 10
const TICK_COUNT = 5

const sanitizeData = (data: StravaActivity[], units: "imperial" | "metric", colorPalette: ColorPalette): ScatterChartData[] => {
  if (!data || data.length === 0) {
    return []
  }
  const chartData: ScatterChartData[] = []
  for (const act of data) {
    if (act.distance && act.average_watts) {
      chartData.push({
        distance: Number(unitConversion.convertDistance(act.distance!, units).toFixed(2)),
        power: act.average_watts!,
        url: `https://www.strava.com/activities/${act.id}`,
        fill: colorPalette[act.sport_type! as SportType]!
      })
    }
  }
  return chartData
}

/*
 * Distance vs Power output
 */
export default function DistanceVsPower() {
  const { activityData, units } = useStravaActivityContext()
  const { colorPalette, darkMode } = useThemeContext()

  const [data, setData] = useState<ScatterChartData[]>([])
  const [trend, setTrend] = useState<TrendCoefficients>({
    slope: 0,
    intercept: 0,
    canShowLine: false
  })
  const [bounds, setBounds] = useState<ChartBounds>({
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0
  })
  const [referenceLinePoints, setReferenceLinePoints] = useState<ReferenceLinePoints>([
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ])
  const [ticks, setTicks] = useState<{ xAxisTicks: number[]; yAxisTicks: number[] }>({
    xAxisTicks: [],
    yAxisTicks: []
  })

  useEffect(() => {
    if (!activityData) return
    try {
      // format data to fit recharts schema
      const sanitizedData = sanitizeData(activityData.all!, units, colorPalette)
      setData(sanitizedData)
      // calculate data bounds
      const dataBounds = getDataBounds(sanitizedData, "distance", "power")
      setBounds(dataBounds)
      setTicks({
        xAxisTicks: calculateTicks(0, Math.round(dataBounds.xMax), TICK_COUNT),
        yAxisTicks: calculateTicks(Math.round(dataBounds.yMin), Math.round(dataBounds.yMax), TICK_COUNT)
      })
      // calculate trend line
      const trend = calculateTrendLine(sanitizedData, "distance", "power")
      setTrend(trend)
      if (trend.canShowLine) {
        setReferenceLinePoints(calculateTrendLinePoints(trend, {
          xMin: 0,
          xMax: dataBounds.xMax * 10,
          yMin: dataBounds.yMin - Y_OFFSET,
          yMax: dataBounds.yMax * 10
        }))
      }
    } catch (err) {
      console.warn(err)
      setData([])
      setTrend({ slope: 0, intercept: 0, canShowLine: false })
      setBounds({ xMin: 0, xMax: 0, yMin: 0, yMax: 0 })
      setReferenceLinePoints([{ x: 0, y: 0 }, { x: 0, y: 0 }])
      setTicks({ xAxisTicks: [], yAxisTicks: [] })
    }
  }, [activityData, colorPalette, units])

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
              color: darkMode ? "#c2c2c2" : "#666",
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
            domain={[bounds.xMin - X_OFFSET, bounds.xMax + X_OFFSET]}
            allowDecimals={false}
            ticks={ticks.xAxisTicks}
          />
          <YAxis
            type="number"
            dataKey="power"
            name="power"
            unit="w"
            tick={{
              fontSize: 10,
              color: darkMode ? "#c2c2c2" : "#666",
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
            width={38}
            allowDecimals={false}
            domain={[bounds.yMin - Y_OFFSET, bounds.yMax + Y_OFFSET]}
            ticks={ticks.yAxisTicks}
          />
          <Tooltip />
          {trend.canShowLine && (
            <ReferenceLine
              ifOverflow="extendDomain"
              segment={referenceLinePoints!}
              stroke={darkMode ? "#c2c2c2" : "black"}
              strokeDasharray="5 5"
            />
          )}
          <ZAxis range={[30, 40]} />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  )
}
