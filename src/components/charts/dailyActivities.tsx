import { useEffect, useState } from "react"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import ActivityCalendar, { ThemeInput } from "react-activity-calendar"
import { CalendarDays } from 'lucide-react'
import NoData from "../common/noData"
import { useCurrentYearContext } from "../../hooks/useCurrentYearContext"
import { ActivityData } from "../../types/activity"
import { useThemeContext } from "../../hooks/useThemeContext"
import * as Sentry from "@sentry/browser"


const colors: ThemeInput = {
  dark: ['#525252', '#0e4429', '#006d32', '#26a641', '#39d353'],
  light: ['#525252', '#0e4429', '#006d32', '#26a641', '#39d353']
}

type CalendarData = {
  date: string
  count: number
  level: number
}

const sanitizeData = (data: ActivityData, currentYear: number) => {
  if (data.all.length === 0) {
    return []
  }
  const allDates = new Set()
  const allActs = data.all.reduce((acc, act) => {
    if (!act.start_date_local || !act.moving_time) return acc
    const activityDate = act.start_date_local.split("T")[0]
    const count = 1
    const level = Math.min(Math.floor(act.moving_time / 1000), 4)
    acc.push({
      date: activityDate,
      count: count,
      level
    })
    allDates.add(activityDate)
    return acc
  }, [] as CalendarData[])
  const startDate = `${currentYear}-01-01`
  const endDate = `${currentYear}-12-31`
  if (!allDates.has(startDate)) {
    allActs.push({ date: startDate, count: 0, level: 0 })
  }
  if (!allDates.has(endDate)) {
    allActs.push({ date: endDate, count: 0, level: 0 })
  }
  return allActs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

/*
 * Daily activity calendar
*/
export default function DailyActivities() {
  const { activitiesData } = useStravaActivityContext()
  const { currentYear } = useCurrentYearContext()
  const { darkMode } = useThemeContext()

  const [data, setData] = useState<CalendarData[]>([])

  useEffect(() => {
    if (activitiesData.all.length === 0) return
    try {
      setData(sanitizeData(activitiesData, currentYear))
    } catch (err) {
      console.warn(err)
      Sentry.captureException(err)
      setData([])
    }
  }, [activitiesData])

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
        <ActivityCalendar fontSize={12} data={data} theme={colors} weekStart={1} style={{ color: darkMode ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)" }} />
      </div>
    </div>
  )
}