export type StravaPhoto = {
  activity_id: number
  activity_name: string
  athlete_id: number
  caption: string
  created_at: string
  created_at_local: string
  cursor: any
  default_photo: boolean
  location: [number, number]
  placeholder_image: any
  post_id: any
  resource_state: number
  source: number
  status: number
  type: number
  unique_id: string
  uploaded_at: string
  urls: {
    [key: number]: string
  }
  video_url?: string
  sizes: {
    [key: number]: [number, number]
  }
}

export type Zone = {
  min: number
  max: number
}

export type StravaAthleteZones = {
  heart_rate?: {
    custom_zones: boolean
    zones: Zone[]
  }
  power?: {
    zones: Zone[]
  }
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

export type StravaBikeShoe = {
  converted_distance: number
  distance: number
  id: string
  name: string
  nickname: string
  primary: boolean
  resource_state: number
  retired: boolean
}

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
  bikes?: StravaBikeShoe[]
  shoes?: StravaBikeShoe[]
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
  id: number
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

export type SportType =
  | "Run"
  | "TrailRun"
  | "Walk"
  | "Hike"
  | "VirtualRun"
  | "Ride"
  | "MountainBikeRide"
  | "GravelRide"
  | "EBikeRide"
  | "EMountainBikeRide"
  | "Velomobile"
  | "VirtualRide"
  | "Canoe"
  | "Kayak"
  | "Kitesurf"
  | "Rowing"
  | "StandUpPaddling"
  | "Surf"
  | "Swim"
  | "Windsurf"
  | "IceSkate"
  | "AlpineSki"
  | "BackcountrySki"
  | "NordicSki"
  | "Snowboard"
  | "Snowshoe"
  | "Handcycle"
  | "InlineSkate"
  | "RockClimb"
  | "RollerSki"
  | "Golf"
  | "Skateboard"
  | "Wheelchair"
  | "Badminton"
  | "Tennis"
  | "Pickleball"
  | "Crossfit"
  | "Elliptical"
  | "StairStepper"
  | "WeightTraining"
  | "Yoga"
  | "Workout"
  | "HighIntensityIntervalTraining"
  | "Pilates"
  | "TableTennis"
  | "Squash"
  | "Racquetball"