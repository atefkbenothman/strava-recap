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

export const UnitDefinitions = {
  imperial: { type: "imperial", distance: "mi", elevation: "ft", speed: "mph" },
  metric: { type: "metric", distance: "km", elevation: "m", speed: "kmh" }
} as const

export type Units = keyof typeof UnitDefinitions