import { useMemo } from "react"
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
  calculateTrendLinePoints,
  getDataBounds,
  calculateTicks
} from "../../utils/utils"
import NoData from "../common/noData"
import { UnitDefinitions } from "../../types/activity"
import { CustomScatterTooltip } from "../common/customScatterToolTip"
import * as Sentry from "@sentry/browser"


type ScatterChartData = {
  name: string
  speed: number
  temp: number
  url: string
  fill: string
  sport_type?: SportType
}

const X_OFFSET = 5
const Y_OFFSET = 1
const TICK_COUNT = 5

export const calculateTemperatureData = (activities: StravaActivity[]): ScatterChartData[] => {
  if (!activities?.length) return []

  return activities.reduce((acc, act) => {
    if (!act.average_speed || !act.average_temp || !act.sport_type) return acc
    acc.push({
      temp: act.average_temp,
      speed: act.average_speed,
      fill: "#ffffff", // placeholder color
      url: `https://www.strava.com/activities/${act.id}`,
      name: act.name ?? "",
      sport_type: act.sport_type as SportType
    })
    return acc
  }, [] as ScatterChartData[])
}

export default function TemperatureVsSpeed() {
  const { activitiesData, units } = useStravaActivityContext()
  const { colorPalette, darkMode } = useThemeContext()

  const rawData = useMemo(() => {
    if (!activitiesData?.all) return []

    try {
      return calculateTemperatureData(activitiesData.all)
    } catch (err) {
      console.warn(err)
      Sentry.captureException(err)
      return []
    }
  }, [activitiesData])

  const dataWithUnits = useMemo(() =>
    rawData.map(item => ({
      ...item,
      speed: Number(unitConversion.convertSpeed(item.speed, units).toFixed(2))
    }))
    , [rawData, units])

  const data = useMemo(() =>
    dataWithUnits.map(item => ({
      ...item,
      fill: colorPalette[item.sport_type as SportType] || "#ffffff"
    }))
    , [dataWithUnits, colorPalette])

  const chartData = useMemo(() => {
    if (data.length === 0) {
      return {
        bounds: { xMin: 0, xMax: 0, yMin: 0, yMax: 0 },
        ticks: { xAxisTicks: [], yAxisTicks: [] },
        trend: { slope: 0, intercept: 0, canShowLine: false },
        referenceLinePoints: [{ x: 0, y: 0 }, { x: 0, y: 0 }]
      }
    }

    const bounds = getDataBounds(data, "temp", "speed")
    const ticks = {
      xAxisTicks: calculateTicks(Math.round(bounds.xMin), Math.round(bounds.xMax), TICK_COUNT),
      yAxisTicks: calculateTicks(Math.round(bounds.yMin), Math.round(bounds.yMax), TICK_COUNT)
    }
    const trend = calculateTrendLine(data, "temp", "speed")
    const referenceLinePoints = trend.canShowLine
      ? calculateTrendLinePoints(trend, {
        xMin: bounds.xMin - X_OFFSET,
        xMax: bounds.xMax * 10,
        yMin: bounds.yMin - Y_OFFSET,
        yMax: bounds.yMax * 10
      })
      : [{ x: 0, y: 0 }, { x: 0, y: 0 }]

    return { bounds, ticks, trend, referenceLinePoints }
  }, [data])

  const chartConfig = useMemo(() => ({
    tickStyle: {
      fontSize: 10,
      color: darkMode ? "#c2c2c2" : "#666",
      fill: darkMode ? "#c2c2c2" : "#666"
    },
    axisStyle: {
      stroke: darkMode ? "#c2c2c2" : "#666"
    },
    referenceLineStyle: {
      stroke: darkMode ? "#c2c2c2" : "black",
      strokeDasharray: "5 5"
    }
  }), [darkMode])

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
            tick={chartConfig.tickStyle}
            stroke={chartConfig.axisStyle.stroke}
            domain={[chartData.bounds.xMin - X_OFFSET, chartData.bounds.xMax + X_OFFSET]}
            allowDecimals={false}
            ticks={chartData.ticks.xAxisTicks}
            interval={0}
          />
          <YAxis
            type="number"
            dataKey="speed"
            name="speed"
            unit={UnitDefinitions[units].speed}
            tick={chartConfig.tickStyle}
            stroke={chartConfig.axisStyle.stroke}
            width={38}
            allowDecimals={false}
            domain={[chartData.bounds.yMin - Y_OFFSET, chartData.bounds.yMax + Y_OFFSET]}
            ticks={chartData.ticks.yAxisTicks}
            interval={0}
          />
          {chartData.trend.canShowLine && (
            <ReferenceLine
              ifOverflow="extendDomain"
              segment={chartData.referenceLinePoints}
              {...chartConfig.referenceLineStyle}
            />
          )}
          <Tooltip content={CustomScatterTooltip} />
          <ZAxis range={[30, 40]} />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  )
}