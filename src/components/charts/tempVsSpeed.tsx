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
import { unitConversion } from "../../utils/utils"
import NoData from "../common/noData"
import { UnitDefinitions } from "../../types/activity"

type ScatterChartData = {
  speed: number
  temp: number
  url: string
  fill: string
}

type RegressionCoefficients = {
  slope: number
  intercept: number
}

/*
 * Temperature vs Speed
 */
export default function TemperatureVsSpeed() {
  const { activityData, units } = useStravaActivityContext()
  const { colorPalette, darkMode } = useThemeContext()

  const [data, setData] = useState<ScatterChartData[]>([])
  const [regression, setRegression] = useState<RegressionCoefficients>({ slope: 0, intercept: 0 })

  useEffect(() => {
    function calculateLinearRegression(data: ScatterChartData[]): RegressionCoefficients {
      const n = data.length
      if (n === 0) return { slope: 0, intercept: 0 }
      const meanX = data.reduce((sum, point) => sum + point.temp, 0) / n
      const meanY = data.reduce((sum, point) => sum + point.speed, 0) / n
      const numerator = data.reduce((sum, point) => {
        return sum + (point.temp - meanX) * (point.speed - meanY)
      }, 0)
      const denominator = data.reduce((sum, point) => {
        return sum + Math.pow(point.temp - meanX, 2)
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
        const sportType = act.sport_type! as SportType
        const speed = Number(unitConversion.convertSpeed(act.average_speed!, units).toFixed(2))
        const temp = act.average_temp!
        if (!speed || !temp) return
        res.push({ speed: speed, temp: temp, url: `https://www.strava.com/activities/${id}`, fill: colorPalette[sportType]! })
      })
      setData(res)
      setRegression(calculateLinearRegression(res))
    }
    formatData()
  }, [activityData, units, colorPalette])


  // Calculate regression line endpoints
  const maxTemp = Math.max(...data.map(d => d.temp))
  const extendedMaxTemp = maxTemp * 1.2
  const startY = regression.slope * 0 + regression.intercept
  const endY = regression.slope * extendedMaxTemp + regression.intercept
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
            domain={[0, 'auto']}
          />
          <YAxis
            type="number"
            dataKey="speed"
            name="speed"
            unit={UnitDefinitions[units].speed}
            domain={["auto", "auto"]}
            tick={{
              fontSize: 10,
              fill: darkMode ? "#c2c2c2" : "#666"
            }}
            stroke={darkMode ? "#c2c2c2" : "#666"}
            width={38}
          />
          <ReferenceLine
            ifOverflow="extendDomain"
            segment={[
              { x: 0, y: startY },
              { x: extendedMaxTemp, y: endY }
            ]}
            stroke={darkMode ? "#c2c2c2" : "black"}
            strokeDasharray="3 3"
          />
          <Tooltip />
          <ZAxis range={[30, 40]} />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  )
}