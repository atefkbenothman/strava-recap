import { useEffect, useState } from "react"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext";
import { useThemeContext } from "../../hooks/useThemeContext";
import { UnitDefinitions } from "../../types/activity"
import { SportType } from "../../types/strava"
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
  Tooltip,
  ZAxis,
  ReferenceLine,
} from "recharts"
import Card from "../common/card";
import NoData from "../common/noData"
import { HeartPulse } from "lucide-react"


type ScatterChartData = {
  heartrate: number
  speed: number
  url: string
  fill: string
}

const X_OFFSET = 2
const Y_OFFSET = 25

/*
 * Heartrate vs perceived exertion
*/
export default function HeartrateVsSpeed() {
  const { activityData, units } = useStravaActivityContext()
  const { darkMode, colorPalette } = useThemeContext()

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
      try {
        const res: ScatterChartData[] = []
        let totalRatio = 0
        let validPoints = 0
        activityData.all!.forEach(act => {
          const id = act.id!
          const hr = act.average_heartrate!
          const speed = Number(unitConversion.convertSpeed(act.average_speed!, units).toFixed(2))
          const sportType = act.sport_type! as SportType
          if (hr && speed) {
            res.push({ heartrate: hr, speed: speed, fill: colorPalette[sportType as SportType]!, url: `https://www.strava.com/activities/${id}` })
            totalRatio += hr / speed
            validPoints++
          }
        })
        setData(res)
        setTrend(calculateTrendLine(res, "speed", "heartrate"))
      } catch (err) {
        console.warn(err)
      }
    }
    formatData()
  }, [activityData, colorPalette, units])

  useEffect(() => {
    if (trend.canShowLine) {
      const xMax = Math.max(...data.map(d => (d["speed"])))
      const xMin = Math.min(...data.map(d => (d["speed"])))
      const yMax = Math.max(...data.map(d => (d["heartrate"])))
      const yMin = Math.min(...data.map(d => (d["heartrate"])))
      console.log(xMax, xMin, yMax, yMin)
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
            domain={[(dataMin: number) => (dataMin - X_OFFSET), (dataMax: number) => (dataMax + X_OFFSET)]}
            allowDecimals={false}
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
          <ZAxis range={[30, 40]} />
          <Tooltip />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  )
}