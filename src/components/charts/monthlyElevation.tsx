import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { unitConversion } from "../../utils/utils"
import { getMonth } from 'date-fns'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts"

import Card from "../card"


const monthData = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export default function MonthlyElevation() {
  const { activities } = useContext(RecapContext)
  const data = Array(12).fill(0).map((_, index) => ({ month: monthData[index], elevation: 0 }))
  let totalElevation = 0
  activities.forEach(activity => {
    const elevation = Number(Math.round(unitConversion.convertFromMetersToFeet(activity.total_elevation_gain!)))
    const activityMonth = monthData[getMonth(new Date(activity.start_date!))]
    const month = data.find(item => item.month === activityMonth);
    month!.elevation += elevation
    totalElevation += elevation
  })
  // const colors = ["#06D6A0", "#118AB2", "#073B4C"]
  return (
    <Card title="Monthly Elevation" description="total elevation per month" total={Math.round(totalElevation)} totalUnits="ft">
      <ResponsiveContainer height={350} width="90%">
        <AreaChart data={data}>
          <Area type="monotone" dataKey="elevation" stroke="#118AB2" fill="#118AB2" isAnimationActive={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}