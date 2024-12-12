import { useContext, useEffect, useState } from "react"
import { RecapContext } from "../../contexts/recapContext"
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
import Card from "../card";
import NoData from "../noData"
import { HeartPulse } from "lucide-react"


type ScatterChartData = {
  heartrate: number
  speed: number
  fill: string
}

type RegressionLine = {
  slope: number
  intercept: number
}

/*
 * Heartrate vs perceived exertion
*/
export default function HeartrateVsSpeed() {
  const { activityData, colorPalette, units } = useContext(RecapContext)

  const [data, setData] = useState<ScatterChartData[]>([])
  const [regressionLine, setRegressionLine] = useState<RegressionLine | null>(null)

  useEffect(() => {
    if (!activityData) return
    function formatData() {
      function calculateRegression(data: ScatterChartData[]) {
        const n = data.length
        const sumX = data.reduce((sum, d) => sum + d.speed, 0)
        const sumY = data.reduce((sum, d) => sum + d.heartrate, 0)
        const sumXY = data.reduce((sum, d) => sum + d.speed * d.heartrate, 0)
        const sumX2 = data.reduce((sum, d) => sum + d.speed ** 2, 0)
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2)
        const intercept = (sumY - slope * sumX) / n
        return { slope, intercept }
      }
      const res: ScatterChartData[] = []
      activityData.all!.forEach(act => {
        const hr = act.average_heartrate!
        const speed = Number(unitConversion.convertSpeed(act.average_speed!, units).toFixed(2))
        const sportType = act.sport_type! as SportType
        if (hr && speed) {
          res.push({ heartrate: hr, speed: speed, fill: colorPalette[sportType] })
        }
      })
      setData(res)
      if (res.length > 1) {
        const regression = calculateRegression(res)
        setRegressionLine(regression)
      }
    }
    formatData()
  }, [activityData, colorPalette])

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

  const xAxisDomain = [0, Math.max(...data.map(d => d.speed))]
  const minX = xAxisDomain[0]
  const maxX = xAxisDomain[1]

  const minY = regressionLine ? regressionLine.slope * minX + regressionLine.intercept : 0
  const maxY = regressionLine ? regressionLine.slope * maxX + regressionLine.intercept : 0

  return (
    <Card
      title="Heartrate vs. Speed"
      description="heartrate compared to speed"
      icon={<HeartPulse size={16} strokeWidth={2} />}
    >
      <ResponsiveContainer height={350} width="90%">
        <ScatterChart>
          <Scatter data={data} isAnimationActive={false} />
          <XAxis
            type="number"
            dataKey="speed"
            name="speed"
            unit="mph"
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
          {regressionLine && (
            <ReferenceLine
              ifOverflow="extendDomain"
              segment={[
                { x: minX, y: minY },
                { x: maxX, y: maxY }
              ]}
              stroke="black"
              strokeDasharray="3 3"
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  )
}