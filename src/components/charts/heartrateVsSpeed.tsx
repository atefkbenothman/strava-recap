import { useEffect, useState } from "react"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext";
import { useThemeContext } from "../../hooks/useThemeContext";
import { UnitDefinitions } from "../../types/activity"
import { SportType, StravaActivity } from "../../types/strava"
import {
  unitConversion,
  calculateTrendLine,
  TrendCoefficients,
  ReferenceLinePoints,
  calculateTrendLinePoints,
  calculateTicks,
  getDataBounds,
  ChartBounds,
} from "../../utils/utils"
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
import Card from "../common/card";
import NoData from "../common/noData"
import { HeartPulse } from "lucide-react"
import { ColorPalette } from "../../contexts/themeContext";


type ScatterChartData = {
  heartrate: number
  speed: number
  url: string
  fill: string
}

const X_OFFSET = 2
const Y_OFFSET = 5
const TICK_COUNT = 5

const sanitizeData = (data: StravaActivity[], units: "imperial" | "metric", colorPalette: ColorPalette): ScatterChartData[] => {
  if (!data || data.length === 0) {
    return []
  }
  return data
    .filter(act => act.average_heartrate && act.average_speed)
    .map(act => (
      {
        heartrate: act.average_heartrate!,
        speed: Number(unitConversion.convertSpeed(act.average_speed!, units).toFixed(2)),
        fill: colorPalette[act.sport_type! as SportType]!,
        url: `https://www.strava.com/activities/${act.id}`
      }
    ))
}

/*
 * Heartrate vs perceived exertion
*/
export default function HeartrateVsSpeed() {
  const { activityData, units } = useStravaActivityContext()
  const { darkMode, colorPalette } = useThemeContext()

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
      const dataBounds = getDataBounds(sanitizedData, "speed", "heartrate")
      setBounds(dataBounds)
      setTicks({
        xAxisTicks: calculateTicks(0, Math.round(dataBounds.xMax), TICK_COUNT),
        yAxisTicks: calculateTicks(Math.round(dataBounds.yMin), Math.round(dataBounds.yMax), TICK_COUNT)
      })
      // calculate trend line
      const trend = calculateTrendLine(sanitizedData, "speed", "heartrate")
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
        title="Heartrate vs. Speed"
        description="heartrate compared to speed"
        icon={<HeartPulse size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Heartrate vs. Speed"
      description="heartrate compared to speed"
      icon={<HeartPulse size={16} strokeWidth={2} />}
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
            dataKey="speed"
            name="speed"
            unit={UnitDefinitions[units].speed}
            tick={{
              fontSize: 10,
              color: darkMode ? "#c2c2c2" : "#666",
              fill: darkMode ? "#c2c2c2" : "#666",
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
            domain={[bounds.xMin - X_OFFSET, bounds.xMax + X_OFFSET]}
            allowDecimals={false}
            ticks={ticks.xAxisTicks}
            interval={0}
          />
          <YAxis
            type="number"
            dataKey="heartrate"
            name="heartrate"
            unit="bpm"
            tick={{
              fontSize: 10,
              color: darkMode ? "#c2c2c2" : "#666",
              fill: darkMode ? "#c2c2c2" : "#666",
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
          <ZAxis range={[30, 40]} />
          <Tooltip />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  )
}