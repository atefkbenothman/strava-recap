import { useEffect, useState } from "react"
import {
  ChartBounds,
  ReferenceLinePoints,
  TrendCoefficients,
  calculateTicks,
  calculateTrendLine,
  calculateTrendLinePoints,
  getDataBounds,
  unitConversion
} from "../../utils/utils"
import { SportType, StravaActivity } from "../../types/strava"
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
import { ColorPalette } from "../../contexts/themeContext"

type ScatterChartData = {
  distance: number
  elevation: number
  url: string
  fill: string
}

const X_OFFSET = 1
const Y_OFFSET = 1
const TICK_COUNT = 5

const sanitizeData = (data: StravaActivity[], units: "imperial" | "metric", colorPalette: ColorPalette): ScatterChartData[] => {
  if (!data || data.length === 0) {
    return []
  }
  const chartData: ScatterChartData[] = []
  for (const act of data) {
    if (act.distance && act.total_elevation_gain) {
      chartData.push({
        distance: Number(unitConversion.convertDistance(act.distance!, units).toFixed(2)),
        elevation: Number(unitConversion.convertElevation(act.total_elevation_gain!, units).toFixed(2)),
        fill: colorPalette[act.sport_type! as SportType]!,
        url: `https://www.strava.com/activities/${act.id}`
      })
    }
  }
  return chartData
}

/*
 * Elevation gained per distance
 */
export default function DistanceVsElevation() {
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
    yAxisTicks: [],
  })

  useEffect(() => {
    if (!activityData) return
    try {
      // format data to fit recharts schema
      const sanitizedData = sanitizeData(activityData.all!, units, colorPalette)
      setData(sanitizedData)
      // calculate data bounds
      const dataBounds = getDataBounds(sanitizedData, "distance", "elevation")
      setBounds(dataBounds)
      setTicks({
        xAxisTicks: calculateTicks(0, Math.round(dataBounds.xMax), TICK_COUNT),
        yAxisTicks: calculateTicks(0, Math.round(dataBounds.yMax), TICK_COUNT)
      })
      // calculate trend line
      const trend = calculateTrendLine(sanitizedData, "distance", "elevation")
      setTrend(trend)
      if (trend.canShowLine) {
        setReferenceLinePoints(calculateTrendLinePoints(trend, {
          xMin: 0,
          xMax: dataBounds.xMax * 10,
          yMin: 0,
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
              color: darkMode ? "#c2c2c2" : "#666",
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
            domain={[bounds.xMin - X_OFFSET, bounds.xMax + X_OFFSET]}
            allowDecimals={false}
            ticks={ticks.xAxisTicks}
            interval={0}
          />
          <YAxis
            type="number"
            dataKey="elevation"
            name="elevation"
            unit={UnitDefinitions[units].elevation}
            tick={{
              fontSize: 10,
              color: darkMode ? "#c2c2c2" : "#666",
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            width={38}
            stroke={darkMode ? "#c2c2c2" : "#666"}
            allowDecimals={false}
            domain={[bounds.yMin - Y_OFFSET, bounds.yMax + Y_OFFSET]}
            ticks={ticks.yAxisTicks}
            interval={0}
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