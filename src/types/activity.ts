import { StravaActivity, SportType } from "./strava"

export const Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]
export type Month = typeof Months[number]

export type MonthlyActivities = Partial<Record<Month, StravaActivity[]>>

export type ActivitiesByType = Partial<Record<SportType, StravaActivity[]>>

export type ActivityData = {
  all?: StravaActivity[]
  monthly?: MonthlyActivities
  bySportType?: ActivitiesByType
}
