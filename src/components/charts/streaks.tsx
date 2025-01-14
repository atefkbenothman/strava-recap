import { useEffect, useState } from "react"
import { getWeek, getMonth, isSameDay, addDays, isValid } from 'date-fns'
import { Flame } from 'lucide-react'
import Card from "../common/card"
import Stat from "../common/stat"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"


function calculateStreak(dates: Date[]): {
  months: number,
  weeks: number,
  days: number
} {
  // Handle empty or invalid input
  if (!dates?.length) return { months: 0, weeks: 0, days: 0 }

  // Deduplicate dates and ensure they're valid
  const uniqueDates = Array.from(new Set(
    dates
      .filter(date => isValid(date))
      .map(date => date.toISOString().split('T')[0])
  )).map(dateStr => new Date(dateStr));

  if (!uniqueDates.length) return { months: 0, weeks: 0, days: 0 }

  // Sort dates in ascending order
  const sortedDates = uniqueDates.sort((a, b) => a.getTime() - b.getTime())

  // Calculate daily streak
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

  // Calculate weekly streak
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

  // Calculate monthly streak
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


type StreakData = {
  months: number
  weeks: number
  days: number
}

/*
 * Longest consecutive streaks
 */
export default function Streaks() {
  const { activityData } = useStravaActivityContext()

  const [streaks, setStreaks] = useState<StreakData>({
    months: 0,
    weeks: 0,
    days: 0
  })

  useEffect(() => {
    if (!activityData || !activityData.all || activityData.all.length === 0) return
    try {
      const dates = activityData.all
        .filter(act => act.start_date)
        .map(act => new Date(act.start_date!))
      setStreaks(calculateStreak(dates))
    } catch (err) {
      console.warn(err)
      setStreaks({ months: 0, weeks: 0, days: 0 })
    }
  }, [activityData])

  return (
    <Card
      title="Streaks"
      description="longest streaks"
      icon={<Flame size={16} strokeWidth={2.5} />}
    >
      <div className="w-full grid grid-rows-3 p-2 gap-2">
        <Stat
          value={String(streaks.months)}
          unit="months"
        />
        <Stat
          value={String(streaks.weeks)}
          unit="weeks"
        />
        {activityData ? (
          <Stat
            value={String(streaks.days)}
            unit="days"
          />
        ) : null}
      </div>
    </Card>
  )
}