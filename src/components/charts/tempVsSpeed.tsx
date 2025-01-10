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
import { SportType } from "../../types/strava"
import {
  unitConversion,
  calculateTrendLine,
  TrendCoefficients,
  calculateTrendLinePoints,
  ReferenceLinePoints
} from "../../utils/utils"
import NoData from "../common/noData"
import { UnitDefinitions } from "../../types/activity"

type ScatterChartData = {
  speed: number
  temp: number
  url: string
  fill: string
}

const X_OFFSET = 5
const Y_OFFSET = 1

/*
 * Temperature vs Speed
 */
export default function TemperatureVsSpeed() {
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
        const sportType = act.sport_type! as SportType
        const speed = Number(unitConversion.convertSpeed(act.average_speed!, units).toFixed(2))
        const temp = act.average_temp!
        if (!speed || !temp) return
        res.push({ speed: speed, temp: temp, url: `https://www.strava.com/activities/${id}`, fill: colorPalette[sportType]! })
      })
      setData(res)
      setTrend(calculateTrendLine(res, "temp", "speed"))
    }
    formatData()
  }, [activityData, units, colorPalette])

  useEffect(() => {
    if (trend.canShowLine) {
      const xMax = Math.max(...data.map(d => (d["temp"])))
      const xMin = Math.min(...data.map(d => (d["temp"])))
      const yMax = Math.max(...data.map(d => (d["speed"])))
      const yMin = Math.min(...data.map(d => (d["speed"])))
      setReferenceLinePoints(calculateTrendLinePoints(trend, { xMin: xMin - X_OFFSET, xMax: xMax * 10, yMin: yMin - Y_OFFSET, yMax: yMax * 10 }))
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
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
            domain={[(dataMin: number) => (dataMin - X_OFFSET), (dataMax: number) => (dataMax + X_OFFSET)]}
            allowDecimals={false}
          />
          <YAxis
            type="number"
            dataKey="speed"
            name="speed"
            unit={UnitDefinitions[units].speed}
            tick={{
              fontSize: 10,
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
            width={38}
            allowDecimals={false}
            domain={[(dataMin: number) => (dataMin - Y_OFFSET), (dataMax: number) => (dataMax + Y_OFFSET)]}
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