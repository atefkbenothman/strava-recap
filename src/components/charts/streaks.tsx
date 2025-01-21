import { useMemo } from "react"
import { getWeek, getMonth, isSameDay, addDays, isValid } from 'date-fns'
import { Flame } from 'lucide-react'
import Card from "../common/card"
import Stat from "../common/stat"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"

type StreakData = {
  months: number
  weeks: number
  days: number
}

export const calculateStreaks = (dates: Date[]): StreakData => {
  if (!dates?.length) return { months: 0, weeks: 0, days: 0 }

  const uniqueDates = Array.from(new Set(
    dates
      .filter(date => isValid(date))
      .map(date => date.toISOString().split('T')[0])
  )).map(dateStr => new Date(dateStr));

  if (!uniqueDates.length) return { months: 0, weeks: 0, days: 0 }

  const sortedDates = uniqueDates.sort((a, b) => a.getTime() - b.getTime())

  let maxDailyStreak = 1
  let currentDailyStreak = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const expectedDate = addDays(sortedDates[i - 1], 1)
    if (isSameDay(expectedDate, sortedDates[i])) {
      currentDailyStreak++
      maxDailyStreak = Math.max(maxDailyStreak, currentDailyStreak)
    } else {
      currentDailyStreak = 1
    }
  }

  const weekMap = new Map<number, Date[]>()
  sortedDates.forEach(date => {
    const week = getWeek(date)
    if (!weekMap.has(week)) {
      weekMap.set(week, [])
    }
    weekMap.get(week)!.push(date)
  })

  const weeks = Array.from(weekMap.keys()).sort((a, b) => a - b)
  let maxWeeklyStreak = 1
  let currentWeeklyStreak = 1

  for (let i = 1; i < weeks.length; i++) {
    if (weeks[i] - weeks[i - 1] === 1) {
      currentWeeklyStreak++
      maxWeeklyStreak = Math.max(maxWeeklyStreak, currentWeeklyStreak)
    } else {
      currentWeeklyStreak = 1
    }
  }

  const monthMap = new Map<number, Date[]>()
  sortedDates.forEach(date => {
    const month = getMonth(date)
    if (!monthMap.has(month)) {
      monthMap.set(month, [])
    }
    monthMap.get(month)!.push(date)
  })

  const months = Array.from(monthMap.keys()).sort((a, b) => a - b)
  let maxMonthlyStreak = 1
  let currentMonthlyStreak = 1

  for (let i = 1; i < months.length; i++) {
    if (months[i] - months[i - 1] === 1) {
      currentMonthlyStreak++
      maxMonthlyStreak = Math.max(maxMonthlyStreak, currentMonthlyStreak)
    } else {
      currentMonthlyStreak = 1
    }
  }

  return {
    months: maxMonthlyStreak,
    weeks: maxWeeklyStreak,
    days: maxDailyStreak
  }
}

/*
 * Longest consecutive streaks
 */
export default function Streaks() {
  const { activitiesData } = useStravaActivityContext()

  const streaks = useMemo(() => {
    if (!activitiesData || activitiesData.all.length === 0) {
      return { months: 0, weeks: 0, days: 0 }
    }
    try {
      const dates = activitiesData.all
        .filter(act => act.start_date)
        .map(act => new Date(act.start_date!))
      return calculateStreaks(dates)
    } catch (err) {
      console.warn(err)
      return { months: 0, weeks: 0, days: 0 }
    }
  }, [activitiesData])

  const stats = useMemo(() => [
    {
      value: String(streaks.months),
      unit: "months"
    },
    {
      value: String(streaks.weeks),
      unit: "weeks"
    },
    {
      value: String(streaks.days),
      unit: "days"
    }
  ], [streaks])

  return (
    <Card
      title="Streaks"
      description="longest streaks"
      icon={<Flame size={16} strokeWidth={2.5} />}
    >
      <div className="w-full grid grid-rows-3 p-2 gap-2">
        {stats.map((stat, index) => (
          <Stat
            key={`stat-${index}`}
            value={stat.value}
            unit={stat.unit}
          />
        ))}
      </div>
    </Card>
  )
}