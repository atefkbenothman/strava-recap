import { useEffect, useState } from "react"
import { getWeek, getMonth } from 'date-fns'
import { Flame } from 'lucide-react'
import Card from "../common/card"
import Stat from "../common/stat"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { StravaActivity } from "../../types/strava"


export default function Streaks() {
  const { activityData } = useStravaActivityContext()

  const [months, setMonths] = useState<number[]>([])
  const [weeks, setWeeks] = useState<number[]>([])

  useEffect(() => {
    function getWeeksMonths() {
      if (!activityData) return
      const months = [...new Set(
        activityData.all!.map((activity) => {
          return getMonth(new Date(activity.start_date!))
        })
      )]
      setMonths(months)
      const weeks = [...new Set(
        activityData.all!.map((activity) => {
          return getWeek(new Date(activity.start_date!))
        })
      )]
      setWeeks(weeks)

    }
    getWeeksMonths()
  }, [activityData])

  function findMaxConsecutive(nums: number[]) {
    const sorted = [...new Set(nums)].sort((a, b) => a - b)
    let max = 0, curr = 1
    for (let i = 1; i < sorted.length; i++) {
      curr = sorted[i] - sorted[i - 1] === 1 ? curr + 1 : 1
      max = Math.max(max, curr)
    }
    return max
  }

  function findMaxConsecutiveDays(activities: StravaActivity[]) {
    const dates = [...new Set(
      activities.map((activity) => {
        const date = new Date(activity.start_date!)
        return date.toISOString().split('T')[0]
      })
    )].sort()
    let maxConsecutive = 0
    let currentConsecutive = 1
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1])
      const currentDate = new Date(dates[i])
      const daysDiff = Math.floor(
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24)
      )
      if (daysDiff === 1) {
        currentConsecutive++
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive)
      } else {
        currentConsecutive = 1
      }
    }
    return maxConsecutive
  }

  return (
    <Card
      title="Streaks"
      description="longest streaks"
      icon={<Flame size={16} strokeWidth={2.5} />}
    >
      <div className="w-full grid grid-rows-3 p-2 gap-2">
        <Stat
          label="Months"
          value={String(findMaxConsecutive(months))}
          unit="months"
        />
        <Stat
          label="Weeks"
          value={String(findMaxConsecutive(weeks))}
          unit="weeks"
        />
        {activityData ? (
          <Stat
            label="Days"
            value={String(findMaxConsecutiveDays(activityData.all!))}
            unit="days"
          />
        ) : null}
      </div>
    </Card>
  )
}