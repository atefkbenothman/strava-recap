import { useContext } from "react"
import { StravaActivity } from "../../types/strava"
import { RecapContext } from "../../contexts/recapContext"
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip, Cell } from "recharts"

type SportType = {
  type: string
  count: number
}

export default function SportTypes() {
  const { activities } = useContext(RecapContext)
  const data = activities.reduce((acc: SportType[], activity: StravaActivity) => {
    const type = activity.sport_type!
    const existingType = acc.find((t) => t.type === type)
    if (existingType) {
      existingType.count++
    } else {
      acc.push({ type, count: 1 })
    }
    return acc
  }, [])
  const colors = ["#06D6A0", "#118AB2", "#073B4C"]
  return (
    <div className="flex flex-col w-full h-full">
      <p className="text-md font-normal mx-1 underline">Sport Types</p>
      <div className="flex w-full h-full items-center justify-center p-2">
        <ResponsiveContainer height="99%">
          <PieChart>
            <Pie label data={data} dataKey="count" nameKey="type" innerRadius={60} outerRadius={80} isAnimationActive={false}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={colors[idx % colors.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" align="center" />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}