import { useContext, useEffect, useState } from "react"
import { RecapContext } from "../../contexts/recapContext"
import ActivityCalendar, { ThemeInput } from "react-activity-calendar"
import { CalendarDays } from 'lucide-react'

const colors: ThemeInput = {
  dark: ['#525252', '#0e4429', '#006d32', '#26a641', '#39d353'],
}

type CalendarData = {
  date: string
  count: number
  level: number
}

/*
 * Daily activity calendar
*/
export default function DailyActivities() {
  const { activityData } = useContext(RecapContext)

  const [data, setData] = useState<CalendarData[]>([])

  useEffect(() => {
    if (!activityData) return
    function formatData() {
      const res = activityData.all!
        .sort((a, b) => new Date(a.start_date_local!).getTime() - new Date(b.start_date_local!).getTime())
        .map((activity) => {
          const date = activity.start_date_local!.split("T")[0]
          const count = 1
          const level = Math.min(Math.floor((activity.moving_time!) / 1000), 4)
          return { date, count, level }
        })
      setData(res)
    }
    formatData()
  }, [activityData])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center m-2 gap-2">
        <CalendarDays size={16} strokeWidth={2} />
        <p className="font-semibold text-sm">Daily Activities</p>
      </div>
      <div className="flex h-full items-center justify-center p-4">
        {data.length > 0 ? (
          <ActivityCalendar data={data} theme={colors} />
        ) : null}
      </div>
    </div>
  )
}