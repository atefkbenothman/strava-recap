import { useEffect, useState } from "react"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"
import { unitConversion } from "../../utils/utils"
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
import { Zap } from 'lucide-react'
import { SportType } from "../../types/strava"
import { UnitDefinitions } from "../../types/activity"
import NoData from "../common/noData"

type ScatterChartData = {
  distance: number
  power: number
  url: string
  fill: string
}

type RegressionCoefficients = {
  slope: number
  intercept: number
}

/*
 * Distance vs Power output
 */
export default function DistanceVsPower() {
  const { activityData, units } = useStravaActivityContext()
  const { colorPalette, darkMode } = useThemeContext()

  const [data, setData] = useState<ScatterChartData[]>([])
  const [regression, setRegression] = useState<RegressionCoefficients>({ slope: 0, intercept: 0 })

  useEffect(() => {
    function calculateLinearRegression(data: ScatterChartData[]): RegressionCoefficients {
      const n = data.length
      if (n === 0) return { slope: 0, intercept: 0 }
      const meanX = data.reduce((sum, point) => sum + point.distance, 0) / n
      const meanY = data.reduce((sum, point) => sum + point.power, 0) / n
      const numerator = data.reduce((sum, point) => {
        return sum + (point.distance - meanX) * (point.power - meanY)
      }, 0)
      const denominator = data.reduce((sum, point) => {
        return sum + Math.pow(point.distance - meanX, 2)
      }, 0)
      const slope = numerator / denominator
      const intercept = meanY - slope * meanX
      return { slope, intercept }
    }
    function formatData() {
      if (!activityData) return
      const res: ScatterChartData[] = []
      activityData.all!.forEach(act => {
        const id = act.id!
        const distance = Math.round(unitConversion.convertDistance(act.distance!, units))
        const power = act.average_watts
        const sportType = act.sport_type! as SportType
        if (!distance || !power) return
        res.push({ distance: distance, power: power, url: `https://www.strava.com/activities/${id}`, fill: colorPalette[sportType]! })
      })
      setData(res)
      setRegression(calculateLinearRegression(res))
    }
    formatData()
  }, [activityData, colorPalette, units])

  // Calculate regression line endpoints
  const maxDistance = Math.max(...data.map(d => d.distance))
  const extendedMaxDistance = maxDistance * 1.2
  const startY = regression.slope * 0 + regression.intercept
  const endY = regression.slope * extendedMaxDistance + regression.intercept

  const handleDotClick = (data: any) => {
    if (data.url) {
      window.open(data.url, "_blank")
    }
  }

  if (data.length === 0) {
    return (
      <Card
        title="Distance vs. Power"
        description="power output per distance"
        icon={<Zap size={16} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Distance vs. Power"
      description="power output per distance"
      icon={<Zap size={16} strokeWidth={2} />}
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
            tick={{
              fontSize: 10,
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
            domain={[0, 'auto']}
          />
          <YAxis
            type="number"
            dataKey="power"
            name="power"
            unit="w"
            domain={["auto", "auto"]}
            tick={{
              fontSize: 10,
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
            width={38}
          />
          <Tooltip />
          <ReferenceLine
            ifOverflow="extendDomain"
            segment={[
              { x: 0, y: startY },
              { x: extendedMaxDistance, y: endY }
            ]}
            stroke={darkMode ? "#c2c2c2" : "black"}
            strokeDasharray="3 3"
          />
          <ZAxis range={[30, 40]} />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  )
}
