import { useEffect, useState } from "react"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import ActivityCalendar, { ThemeInput } from "react-activity-calendar"
import { CalendarDays } from 'lucide-react'
import NoData from "../common/noData"
import { useCurrentYearContext } from "../../hooks/useCurrentYearContext"

const colors: ThemeInput = {
  dark: ['#525252', '#0e4429', '#006d32', '#26a641', '#39d353'],
  light: ['#525252', '#0e4429', '#006d32', '#26a641', '#39d353']
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
  const { activityData } = useStravaActivityContext()
  const { currentYear } = useCurrentYearContext()

  const [data, setData] = useState<CalendarData[]>([])

  useEffect(() => {
    function formatData() {
      if (!activityData) return
      const jan1 = `${currentYear}-01-01`
      const dec31 = `${currentYear}-12-31`

      const res = activityData.all!.reduce((acc, activity) => {
        const date = activity.start_date_local!.split("T")[0]
        const count = 1
        const level = Math.min(Math.floor(activity.moving_time! / 1000), 4)
        acc.push({ date, count, level })
        return acc
      }, [] as CalendarData[])

      const dateSet = new Set(res.map((entry) => entry.date))

      if (!dateSet.has(jan1)) res.push({ date: jan1, count: 0, level: 0 })
      if (!dateSet.has(dec31)) res.push({ date: dec31, count: 0, level: 0 })

      res.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      setData(res)
    }
    formatData()
  }, [activityData])

  if (data.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center m-2 gap-2">
          <CalendarDays size={16} strokeWidth={2} />
          <p className="font-semibold text-sm">Daily Activities</p>
        </div>
        <div className="flex h-full items-center justify-center p-4">
          <NoData />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full dark:text-white">
      <div className="flex items-center m-2 gap-2">
        <CalendarDays size={16} strokeWidth={2} />
        <p className="font-semibold text-sm">Daily Activities</p>
      </div>
      <div className="flex h-full items-center justify-center p-4">
        {data && data.length > 0 ? (
          <ActivityCalendar data={data} theme={colors} />
        ) : null}
      </div>
    </div>
  )
}