import { useEffect, useState } from "react"
import { unitConversion } from "../../utils/utils"
import { SportType } from "../../types/strava"
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
import { UnitDefinitions } from "../../types/activity"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext";
import { useThemeContext } from "../../hooks/useThemeContext";


type ScatterChartData = {
  heartrate: number
  speed: number
  url: string
  fill: string
}

type RegressionCoefficients = {
  slope: number
  intercept: number
}

const MIN_HEARTRATE = 60
const MAX_HEARTRATE = 220

/*
 * Heartrate vs perceived exertion
*/
export default function HeartrateVsSpeed() {
  const { activityData, units } = useStravaActivityContext()
  const { darkMode, colorPalette } = useThemeContext()

  const [data, setData] = useState<ScatterChartData[]>([])
  const [regression, setRegression] = useState<RegressionCoefficients>({ slope: 0, intercept: 0 })

  useEffect(() => {
    function calculateLinearRegression(data: ScatterChartData[]): RegressionCoefficients {
      const n = data.length
      if (n === 0) return { slope: 0, intercept: 0 }
      // calculate means
      const meanX = data.reduce((sum, point) => sum + point.speed, 0) / n
      const meanY = data.reduce((sum, point) => sum + point.heartrate, 0) / n
      // calculate slope
      const numerator = data.reduce((sum, point) => {
        return sum + (point.speed - meanX) * (point.heartrate - meanY)
      }, 0)
      const denominator = data.reduce((sum, point) => {
        return sum + Math.pow(point.speed - meanX, 2)
      }, 0)
      const slope = numerator / denominator
      const intercept = meanY - slope * meanX
      return { slope, intercept }
    }
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
        setRegression(calculateLinearRegression(res))
      } catch (err) {
        console.warn(err)
      }
    }
    formatData()
  }, [activityData, colorPalette, units])

  const handleDotClick = (data: any) => {
    if (data.url) {
      window.open(data.url, "_blank")
    }
  }

  // Calculate regression line endpoints while respecting axis bounds
  const maxSpeed = Math.max(...data.map(d => d.speed))
  const minSpeed = 0
  // Calculate Y values for min and max X points
  let startY = regression.slope * minSpeed + regression.intercept
  let endY = regression.slope * maxSpeed + regression.intercept
  // Clamp Y values to the heart rate bounds
  startY = Math.max(MIN_HEARTRATE, Math.min(MAX_HEARTRATE, startY))
  endY = Math.max(MIN_HEARTRATE, Math.min(MAX_HEARTRATE, endY))

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
            domain={[0, 'auto']}
            tick={{
              fontSize: 10,
              color: darkMode ? "#c2c2c2" : "#666",
              fill: darkMode ? "#c2c2c2" : "#666",
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
          />
          <YAxis
            type="number"
            dataKey="heartrate"
            name="heartrate"
            unit="bpm"
            domain={[MIN_HEARTRATE, MAX_HEARTRATE]}
            tick={{
              fontSize: 10,
              color: darkMode ? "#c2c2c2" : "#666",
              fill: darkMode ? "#c2c2c2" : "#666",
            }}
            width={38}
            stroke={darkMode ? "#c2c2c2" : "#666"}
          />
          <ReferenceLine
            ifOverflow="extendDomain"
            segment={[
              { x: minSpeed, y: startY },
              { x: maxSpeed, y: endY }
            ]}
            stroke={darkMode ? "#c2c2c2" : "black"}
            strokeDasharray="3 3"
          />
          <ZAxis range={[30, 40]} />
          <Tooltip />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  )
}