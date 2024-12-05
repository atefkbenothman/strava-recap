export type StravaAthlete = {
  id: number
  resource_state: number
  badge_type_id?: number
  bio?: string
  city?: string
  country?: string
  created_at?: string
  firstname?: string
  follower?: boolean | null
  friend?: boolean | null
  lastname?: string
  premium?: boolean
  profile?: string
  profile_medium?: string
  sex?: string
  state?: string
  summit?: boolean
  updated_at?: string
  username?: string | null
  weight?: number
}

export type StravaActivity = {
  resouce_state?: number
  athlete?: StravaAthlete
  name?: string
  distance?: number
  moving_time?: number
  elapsed_time?: number
  total_elevation_gain?: number
  type?: string
  sport_type?: string
  workout_type?: number
  id?: number
  start_date?: string
  start_date_local?: string
  timezone?: string
  utc_offset?: number
  location_city?: string | null
  location_state?: string | null
  location_country?: string
  achievement_count?: number
  kudos_count?: number
  comment_count?: number
  athlete_count?: number
  photo_count?: number
  map?: {
    id: string
    summary_polyline: string
    resource_state: number
  }
  trainer?: boolean
  commute?: boolean
  manual?: boolean
  private?: boolean
  visibility?: string
  flagged?: boolean
  gear_id?: string
  start_latlng?: [number, number]
  end_latlng?: [number, number]
  average_speed?: number
  max_speed?: number
  average_temp?: number
  average_watts?: number
  device_watts?: boolean
  kilojoules?: number
  has_heartrate?: boolean
  heartrate_opt_out?: boolean
  display_hide_heartrate_option?: boolean
  elev_high?: number
  elev_low?: number
  upload_id?: number
  upload_id_str?: string
  external_id?: string
  from_accepted_tag?: boolean
  pr_count?: number
  total_photo_count?: number
  has_kudoed?: boolean
  average_cadence?: number
  weighted_average_watts?: number
  average_heartrate?: number
  max_heartrate?: number
  max_watts?: number
  suffer_score?: number
}

export type StravaGear = {
  id: string
  resource_state: number
  primary: boolean
  distance: number
  brand_name: string
  model_name: string
  frame_type: number
  description: string
}

export const SportTypes = [
  "Run",
  "Trail Run",
  "Walk",
  "Hike",
  "Virtual Run",
  "Ride",
  "Mountain Bike Ride",
  "Gravel Ride",
  "E-Bike Ride",
  "E-Mountain Bike Ride",
  "Velomobile",
  "Virtual Ride",
  "Canoe",
  "Kayak",
  "Kitesurf",
  "Rowing",
  "Stand Up Paddling",
  "Surf",
  "Swim",
  "Windsurf",
  "Ice Skate",
  "Alpine Ski",
  "Backcountry Ski",
  "Nordic Ski",
  "Snowboard",
  "Snowshoe",
  "Handcycle",
  "Inline Skate",
  "Rock Climb",
  "Roller Ski",
  "Golf",
  "Skateboard",
  "Wheelchair",
  "Badminton",
  "Tennis",
  "Pickleball",
  "Crossfit",
  "Elliptical",
  "Stair Stepper",
  "Weight Training",
  "Yoga",
  "Workout",
  "HIIT",
  "Pilates",
  "Table Tennis",
  "Squash",
  "Racquetball"
] as const
export type SportType = typeof SportTypes[number]