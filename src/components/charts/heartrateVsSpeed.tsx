import { useContext, useEffect, useState } from "react"
import { ActivityDataContext, ThemeContext } from "../../contexts/context"
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
  // ReferenceLine,
} from "recharts"
import Card from "../card";
import NoData from "../noData"
import { HeartPulse } from "lucide-react"
import { UnitDefinitions } from "../../types/activity"


type ScatterChartData = {
  heartrate: number
  speed: number
  url: string
  fill: string
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

/*
 * Heartrate vs perceived exertion
*/
export default function HeartrateVsSpeed() {
  const { activityData, units } = useContext(ActivityDataContext)
  const { colorPalette } = useContext(ThemeContext)

  const [data, setData] = useState<ScatterChartData[]>([])
  // const [regressionLine, setRegressionLine] = useState<RegressionLine | null>()
  // const [bounds, setBounds] = useState<ChartBounds | null>()

  useEffect(() => {
    if (!activityData) return
    function formatData() {
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
      const res: ScatterChartData[] = []
      activityData.all!.forEach(act => {
        const id = act.id!
        const hr = act.average_heartrate!
        const speed = Number(unitConversion.convertSpeed(act.average_speed!, units).toFixed(2))
        const sportType = act.sport_type! as SportType
        if (hr && speed) {
          res.push({ heartrate: hr, speed: speed, fill: colorPalette[sportType], url: `https://www.strava.com/activities/${id}` })
        }
      })
      setData(res)
      // if (res.length > 1) {
      //   const regression = calculateRegression(res)
      //   setRegressionLine(regression)
      // }
      // console.log(minX, maxX, minY, maxY)
      // setBounds({ minX, minY, maxX, maxY })
    }
    formatData()
  }, [activityData, colorPalette, units])

  // const xAxisDomain = [0, Math.max(...data.map(d => d.speed))]
  // const minX = xAxisDomain[0]
  // const maxX = xAxisDomain[1]

  // const minY = regressionLine ? regressionLine.slope * minX + regressionLine.intercept : 0
  // const maxY = regressionLine ? regressionLine.slope * maxX + regressionLine.intercept : 0

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
      <ResponsiveContainer height={350} width="90%">
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
            tick={{ fontSize: 10 }}
          />
          <YAxis
            type="number"
            dataKey="heartrate"
            name="heartrate"
            unit="bpm"
            domain={[90, 210]}
            tick={{ fontSize: 10 }}
            width={38}
          />
          <ZAxis range={[30, 40]} />
          <Tooltip />
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
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  )
}