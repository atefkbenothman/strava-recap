import { useEffect, useState } from "react"
import { ThermometerSun } from "lucide-react"
import {
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceLine
} from "recharts"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"
import Card from "../common/card"
import { SportType, StravaActivity } from "../../types/strava"
import {
  unitConversion,
  calculateTrendLine,
  TrendCoefficients,
  calculateTrendLinePoints,
  ReferenceLinePoints,
  ChartBounds,
  getDataBounds,
  calculateTicks
} from "../../utils/utils"
import NoData from "../common/noData"
import { UnitDefinitions } from "../../types/activity"
import { ColorPalette } from "../../contexts/themeContext"

type ScatterChartData = {
  speed: number
  temp: number
  url: string
  fill: string
}

const X_OFFSET = 5
const Y_OFFSET = 1
const TICK_COUNT = 5

const sanitizeData = (data: StravaActivity[], units: "imperial" | "metric", colorPalette: ColorPalette): ScatterChartData[] => {
  if (!data || data.length === 0) {
    return []
  }
  const chartData: ScatterChartData[] = []
  for (const act of data) {
    if (act.average_speed && act.average_temp) {
      chartData.push({
        temp: act.average_temp!,
        speed: Number(unitConversion.convertSpeed(act.average_speed!, units).toFixed(2)),
        fill: colorPalette[act.sport_type! as SportType]!,
        url: `https://www.strava.com/activities/${act.id}`
      })
    }
  }
  return chartData
}

/*
 * Temperature vs Speed
 */
export default function TemperatureVsSpeed() {
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
      const dataBounds = getDataBounds(sanitizedData, "temp", "speed")
      setBounds(dataBounds)
      setTicks({
        xAxisTicks: calculateTicks(Math.round(dataBounds.xMin), Math.round(dataBounds.xMax), TICK_COUNT),
        yAxisTicks: calculateTicks(Math.round(dataBounds.yMin), Math.round(dataBounds.yMax), TICK_COUNT)
      })
      // calculate trend line
      const trend = calculateTrendLine(sanitizedData, "temp", "speed")
      setTrend(trend)
      if (trend.canShowLine) {
        setReferenceLinePoints(calculateTrendLinePoints(trend, {
          xMin: dataBounds.xMin - X_OFFSET,
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
  }, [activityData, units, colorPalette])

  const handleDotClick = (data: any) => {
    if (data.url) {
      window.open(data.url, "_blank")
    }
  }

  if (data.length === 0) {
    return (
      <Card
        title="Temp vs. Speed"
        description="speed per avg temperature"
        icon={<ThermometerSun size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Temp vs. Speed"
      description="avg temperature per avg speed"
      icon={<ThermometerSun size={16} strokeWidth={2} />}
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
            dataKey="temp"
            name="temp"
            unit="°C"
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
            dataKey="speed"
            name="speed"
            unit={UnitDefinitions[units].speed}
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
            interval={0}
          />
          {trend.canShowLine && (
            <ReferenceLine
              ifOverflow="extendDomain"
              segment={referenceLinePoints!}
              stroke={darkMode ? "#c2c2c2" : "black"}
              strokeDasharray="5 5"
            />
          )}
          <Tooltip />
          <ZAxis range={[30, 40]} />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  )
}