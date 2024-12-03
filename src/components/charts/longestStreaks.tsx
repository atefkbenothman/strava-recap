import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { StravaActivity } from "../../types/strava"
import { getWeek, getMonth } from 'date-fns'
import { Flame } from 'lucide-react'


import Card from "../card"
import Stat from "../stat"


export default function LongestStreaks() {
  const { activities } = useContext(RecapContext)

  const months = [...new Set(
    activities.map((activity) => {
      return getMonth(new Date(activity.start_date!))
    })
  )];

  const weeks = [...new Set(
    activities.map((activity) => {
      return getWeek(new Date(activity.start_date!))
    })
  )];

  function findMaxConsecutive(nums: number[]) {
    const sorted = [...new Set(nums)].sort((a, b) => a - b);
    let max = 0, curr = 1;
    for (let i = 1; i < sorted.length; i++) {
      curr = sorted[i] - sorted[i - 1] === 1 ? curr + 1 : 1;
      max = Math.max(max, curr);
    }
    return max;
  }

  function findMaxConsecutiveDays(activities: StravaActivity[]) {
    const dates = [...new Set(
      activities.map((activity) => {
        const date = new Date(activity.start_date!);
        return date.toISOString().split('T')[0];
      })
    )].sort();
    let maxConsecutive = 0;
    let currentConsecutive = 1;
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currentDate = new Date(dates[i]);
      const daysDiff = Math.floor(
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24)
      );
      if (daysDiff === 1) {
        currentConsecutive++;
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      } else {
        currentConsecutive = 1;
      }
    }
    return maxConsecutive;
  }

  return (
    <Card title="Longest Streaks" description="longest consecutive streaks" icon={<Flame size={16} strokeWidth={2.5} />}>
      <div className="w-full grid grid-rows-3 p-2 gap-2">
        <Stat
          label="Consecutive Months"
          value={String(findMaxConsecutive(months))}
          unit="months"
        />
        <Stat
          label="Consecutive Weeks"
          value={String(findMaxConsecutive(weeks))}
          unit="weeks"
        />
        <Stat
          label="Consecutive Days"
          value={String(findMaxConsecutiveDays(activities))}
          unit="days"
        />
      </div>
    </Card>
  )
}