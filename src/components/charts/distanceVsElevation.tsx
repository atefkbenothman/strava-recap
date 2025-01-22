import { useMemo } from "react"
import {
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
import { CustomScatterTooltip } from "../common/customScatterToolTip"
import * as Sentry from "@sentry/browser"


const X_OFFSET = 1
const Y_OFFSET = 1
const TICK_COUNT = 5

type ScatterChartData = {
  name: string
  distance: number
  elevation: number
  url: string
  fill: string
  sport_type: string
}

export const calculateScatterData = (activities: StravaActivity[]): ScatterChartData[] => {
  if (!activities?.length) return []

  return activities.reduce((acc, act) => {
    if (!act.distance || !act.total_elevation_gain || !act.sport_type) return acc

    acc.push({
      distance: act.distance,
      elevation: act.total_elevation_gain,
      fill: "#ffffff", // placeholder color
      url: `https://www.strava.com/activities/${act.id}`,
      name: act.name ?? "",
      sport_type: act.sport_type
    })
    return acc
  }, [] as ScatterChartData[])
}

/*
 * Elevation gained per distance
 */
export default function DistanceVsElevation() {
  const { activitiesData, units } = useStravaActivityContext()
  const { colorPalette, darkMode } = useThemeContext()

  const rawData = useMemo(() => {
    if (!activitiesData.all.length) return []

    try {
      return calculateScatterData(activitiesData.all)
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
      elevation: Number(unitConversion.convertElevation(item.elevation, units).toFixed(2))
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

    const bounds = getDataBounds(data, "distance", "elevation")
    const ticks = {
      xAxisTicks: calculateTicks(0, Math.round(bounds.xMax), TICK_COUNT),
      yAxisTicks: calculateTicks(0, Math.round(bounds.yMax), TICK_COUNT)
    }
    const trend = calculateTrendLine(data, "distance", "elevation")
    const referenceLinePoints = trend.canShowLine
      ? calculateTrendLinePoints(trend, {
        xMin: 0,
        xMax: bounds.xMax * 10,
        yMin: 0,
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
            tick={chartConfig.tickStyle}
            stroke={chartConfig.axisStyle.stroke}
            domain={[chartData.bounds.xMin - X_OFFSET, chartData.bounds.xMax + X_OFFSET]}
            allowDecimals={false}
            ticks={chartData.ticks.xAxisTicks}
            interval={0}
          />
          <YAxis
            type="number"
            dataKey="elevation"
            name="elevation"
            unit={UnitDefinitions[units].elevation}
            tick={chartConfig.tickStyle}
            width={38}
            stroke={chartConfig.axisStyle.stroke}
            allowDecimals={false}
            domain={[chartData.bounds.yMin - Y_OFFSET, chartData.bounds.yMax + Y_OFFSET]}
            ticks={chartData.ticks.yAxisTicks}
            interval={0}
          />
          {chartData.trend.canShowLine && (
            <ReferenceLine
              ifOverflow="extendDomain"
              segment={chartData.referenceLinePoints}
              stroke={darkMode ? "#c2c2c2" : "black"}
              strokeDasharray="5 5"
            />
          )}
          <Tooltip content={CustomScatterTooltip} />
          <ZAxis range={[30, 40]} />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  )
}