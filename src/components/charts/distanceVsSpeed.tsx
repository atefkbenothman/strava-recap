import { useMemo } from "react"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"
import {
  unitConversion,
  calculateTrendLine,
  calculateTrendLinePoints,
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
import { Gauge } from "lucide-react"
import { SportType, StravaActivity } from "../../types/strava"
import { UnitDefinitions } from "../../types/activity"
import NoData from "../common/noData"
import { CustomScatterTooltip } from "../common/customScatterToolTip"
import * as Sentry from "@sentry/browser"


type ScatterChartData = {
  name: string
  distance: number
  speed: number
  url: string
  fill: string
  sport_type?: SportType
}

const X_OFFSET = 1
const Y_OFFSET = 1
const TICK_COUNT = 5

export const calculateSpeedData = (activities: StravaActivity[]): ScatterChartData[] => {
  if (!activities?.length) return []

  return activities.reduce((acc, act) => {
    if (!act.distance || !act.average_speed || !act.sport_type) return acc

    acc.push({
      distance: act.distance,
      speed: act.average_speed,
      url: `https://www.strava.com/activities/${act.id}`,
      fill: "#ffffff", // placeholder color
      name: act.name ?? "",
      sport_type: act.sport_type as SportType
    })
    return acc
  }, [] as ScatterChartData[])
}

/*
 * Distance vs Speed
 */
export default function DistanceVsSpeed() {
  const { activitiesData, units } = useStravaActivityContext()
  const { colorPalette, darkMode } = useThemeContext()

  const rawData = useMemo(() => {
    if (!activitiesData?.all) return []
    try {
      return calculateSpeedData(activitiesData.all)
    } catch (err) {
      console.warn(err)
      Sentry.captureException(err)
      return []
    }
  }, [activitiesData])

  const dataWithUnits = useMemo(() =>
    rawData.map(item => ({
      ...item,
      distance: Number(unitConversion.convertDistance(item.distance, units).toFixed(2)),
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

    const bounds = getDataBounds(data, "distance", "speed")
    const ticks = {
      xAxisTicks: calculateTicks(0, Math.round(bounds.xMax), TICK_COUNT),
      yAxisTicks: calculateTicks(Math.round(bounds.yMin), Math.round(bounds.yMax), TICK_COUNT)
    }
    const trend = calculateTrendLine(data, "distance", "speed")
    const referenceLinePoints = trend.canShowLine
      ? calculateTrendLinePoints(trend, {
        xMin: 0,
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
        title="Distance vs. Speed"
        description="avg speed per distance"
        icon={<Gauge size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Distance vs. Speed"
      description="avg speed per distance"
      icon={<Gauge size={16} strokeWidth={2} />}
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
            tick={chartConfig.tickStyle}
            stroke={chartConfig.axisStyle.stroke}
            domain={[chartData.bounds.xMin - X_OFFSET, chartData.bounds.xMax + X_OFFSET]}
            allowDecimals={false}
            ticks={chartData.ticks.xAxisTicks}
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