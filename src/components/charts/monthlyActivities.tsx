import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { StravaActivity } from "../../types/strava"
import { unitConversion } from "../../utils/utils"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

export default function MonthlyActivities() {
  const { activities } = useContext(RecapContext)
  const monthData = [
    { "month": "January" },
    { "month": "February" },
    { "month": "March" },
    { "month": "April" },
    { "month": "May" },
    { "month": "June" },
    { "month": "July" },
    { "month": "August" },
    { "month": "September" },
    { "month": "October" },
    { "month": "November" },
    { "month": "December" }
  ]
  const data = activities.reduce((acc: any[], activity: StravaActivity) => {
    const date = new Date(activity.start_date!);
    const month = date.toLocaleString('default', { month: 'long' });
    const sportType = activity.sport_type!
    let entry = acc.find(item => item.month === month);
    if (!entry[sportType]) {
      entry[sportType] = 0
    }
    entry[sportType] += Number(unitConversion.convertSecondsToHours(activity.moving_time!).toFixed(0))
    return acc
  }, monthData)
  const colors = ["#06D6A0", "#118AB2", "#073B4C"]
  return (
    <div className="flex flex-col w-full h-full">
      <p className="font-semibold m-1">Monthly Activities</p>
      <div className="flex w-full h-full items-center justify-center p-2">
        <ResponsiveContainer height={350} width="99%">
          <BarChart data={data}>
            <XAxis type="category" dataKey="month" />
            {/* <YAxis type="number" /> */}
            <Tooltip />
            {[...Array.from(new Set(data.flatMap(month => Object.keys(month).filter(key => key !== 'month')))).entries()].map(([idx, sportType]: [number, string]) => (
              <Bar key={sportType} stackId="stack" dataKey={sportType} isAnimationActive={false} fill={colors[idx % colors.length]} label={{ position: "top" }} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}