import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import ActivityCalendar, { ThemeInput } from "react-activity-calendar"

export default function DailyActivities() {
  const { activities } = useContext(RecapContext)
  const data = activities
    .sort((a, b) => new Date(a.start_date_local!).getTime() - new Date(b.start_date_local!).getTime())
    .map((activity) => {
      const date = activity.start_date_local!.split("T")[0]
      const count = 1
      const level = Math.min(Math.floor((activity.moving_time!) / 1000), 4)
      return { date, count, level }
    })
  const colors: ThemeInput = {
    dark: ['#525252', '#0e4429', '#006d32', '#26a641', '#39d353'],
  }
  return (
    <div className="flex flex-col h-full">
      <p className="font-semibold m-1">Daily Activities</p>
      <div className="flex h-full items-center justify-center p-4">
        {data.length > 0 ? (
          <ActivityCalendar data={data} theme={colors} />
        ) : null}
      </div>
    </div>
  )
}