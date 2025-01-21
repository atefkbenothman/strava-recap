import { StravaActivity, SportType } from "./strava"

export const MONTHS = [
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
  "December",
] as const
export type Month = (typeof MONTHS)[number]

export type ActivitiesByType = Partial<Record<SportType, StravaActivity[]>>
export type ActivitiesByMonth = Record<Month, StravaActivity[]>

export type ActivityData = {
  all: StravaActivity[]
  byMonth: ActivitiesByMonth
  byType: ActivitiesByType
}

export const UnitDefinitions = {
  imperial: {
    type: "imperial",
    distance: "mi",
    elevation: "ft",
    speed: "mph"
  },
  metric: {
    type: "metric",
    distance: "km",
    elevation: "m",
    speed: "kmh"
  }
} as const
export type Units = keyof typeof UnitDefinitions