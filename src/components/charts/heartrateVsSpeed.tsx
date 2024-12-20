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

  // calculate regression line endpoints
  const maxSpeed = Math.max(...data.map(d => d.speed))
  const extendedMaxSpeed = maxSpeed * 1.2
  const startY = regression.slope * 0 + regression.intercept
  const endY = regression.slope * extendedMaxSpeed + regression.intercept

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
            domain={[90, 210]}
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
              { x: 0, y: startY },
              { x: extendedMaxSpeed, y: endY }
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

// type RegressionLine = {
//   slope: number
//   intercept: number
// }

// type ChartBounds = {
//   minX: number
//   minY: number
//   maxX: number
//   maxY: number
// }

// const xAxisDomain = [0, Math.max(...data.map(d => d.speed))]
// const minX = xAxisDomain[0]
// const maxX = xAxisDomain[1]

// const minY = regressionLine ? regressionLine.slope * minX + regressionLine.intercept : 0
// const maxY = regressionLine ? regressionLine.slope * maxX + regressionLine.intercept : 0


// const [regressionLine, setRegressionLine] = useState<RegressionLine | null>()
// const [bounds, setBounds] = useState<ChartBounds | null>()
// if (res.length > 1) {
//   const regression = calculateRegression(res)
//   setRegressionLine(regression)
// }
// console.log(minX, maxX, minY, maxY)
// setBounds({ minX, minY, maxX, maxY })

// function calculateRegression(d: ScatterChartData[]) {
//   const n = d.length
//   const sumX = data.reduce((sum, d) => sum + d.speed, 0)
//   const sumY = data.reduce((sum, d) => sum + d.heartrate, 0)
//   const sumXY = data.reduce((sum, d) => sum + d.speed * d.heartrate, 0)
//   const sumX2 = data.reduce((sum, d) => sum + d.speed ** 2, 0)
//   const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2)
//   const intercept = (sumY - slope * sumX) / n
//   return { slope, intercept }
// }
{/* {regressionLine && (
            <ReferenceLine
              ifOverflow="extendDomain"
              segment={[
                // { x: bounds.minX, y: bounds.minY },
                // { x: bounds.maxX, y: bounds.maxY }
                { x: minX, y: minY },
                { x: maxX, y: maxY }
              ]}
              stroke="black"
              strokeDasharray="3 3"
            />
          )} */}