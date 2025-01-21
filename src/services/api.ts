// import * as Sentry from "@sentry/react"
import { StravaActivity, StravaAthlete, StravaAthleteZones, StravaGear, StravaPhoto } from "../types/strava"


export const stravaApi = {
  clientId: import.meta.env.VITE_STRAVA_CLIENT_ID,
  clientSecret: import.meta.env.VITE_STRAVA_CLIENT_SECRET,
  defaultRedirectUri:
    process.env.NODE_ENV === "development"
      ? import.meta.env.VITE_STRAVA_REDIRECT_URI_DEV
      : import.meta.env.VITE_STRAVA_REDIRECT_URI_PROD,
  redirectUri:
    process.env.NODE_ENV === "development"
      ? import.meta.env.VITE_STRAVA_REDIRECT_URI_DEV
      : import.meta.env.VITE_STRAVA_REDIRECT_URI_PROD,
  updateRedirectUri: (year: number): void => {
    stravaApi.redirectUri = `${stravaApi.defaultRedirectUri}/${year}`
  },
  generateAuthUrl: (): string => {
    const baseUrl = "https://www.strava.com/oauth/authorize"
    const params = new URLSearchParams({
      client_id: stravaApi.clientId,
      redirect_uri: stravaApi.redirectUri,
      response_type: "code",
      approval_prompt: "force",
      scope: "read_all,activity:read_all,profile:read_all"
    }).toString()
    return `${baseUrl}?${params}`
  },
  getData: async (baseUrl: string, method: string, options: { headers?: any, params?: string }): Promise<any> => {
    const { headers, params } = options
    const url = params ? `${baseUrl}?${params}` : baseUrl
    try {
      const res = await fetch(url, {
        method: method,
        headers: headers ?? {}
      })
      if (!res.ok) {
        throw new Error(`Failed api call to ${url} <${res.status}>`)
      }
      // Sentry.captureMessage(url, {
      //   level: "log",
      //   extra: {
      //     method: method,
      //     params: params ?? "",
      //     status: res.status,
      //     statusText: res.statusText
      //   }
      // })
      const data = await res.json()
      return data
    } catch (err) {
      // Sentry.captureException(err)
      throw err
    }
  },
  exchangeToken: async (code: string): Promise<{ accessToken: string, athlete: StravaAthlete }> => {
    const baseUrl = "https://www.strava.com/oauth/token"
    const params = new URLSearchParams({
      client_id: stravaApi.clientId,
      client_secret: stravaApi.clientSecret,
      code: code,
      grant_type: "authorization_code"
    }).toString()
    const data = await stravaApi.getData(baseUrl, "POST", { params: params })
    return {
      accessToken: data.access_token,
      athlete: data.athlete
    }
  },
  getAthlete: async (token: string): Promise<StravaAthlete> => {
    const baseUrl = "https://www.strava.com/api/v3/athlete"
    const headers = {
      Authorization: `Bearer ${token}`
    }
    const data = await stravaApi.getData(baseUrl, "GET", { headers: headers })
    return data
  },
  getActivities: async (token: string, options?: { page?: number, perPage?: number, year?: number }): Promise<StravaActivity[]> => {
    const { page = 1, perPage = 200, year = new Date().getFullYear() } = options || {}
    if (year < 2010 || year >= new Date().getFullYear() + 1) return []
    const [beforeDate, afterDate] = [Math.floor(new Date(`${year + 1}-01-01`).getTime() / 1000).toString(), Math.floor(new Date(`${year}-01-01`).getTime() / 1000).toString()]
    const baseUrl = "https://strava.com/api/v3/athlete/activities"
    const headers = {
      Authorization: `Bearer ${token}`
    }
    const params = new URLSearchParams({
      after: afterDate,
      before: beforeDate,
      page: page.toString(),
      per_page: perPage.toString()
    }).toString()
    const data = await stravaApi.getData(baseUrl, "GET", { headers: headers, params: params })
    return data.reverse()
  },
  getAllActivities: async (token: string, year: number): Promise<StravaActivity[]> => {
    // continuously fetch all activities until we get less than 200 activities (we've reached the last page)
    const perPage = 200
    let currPage = 1
    const allActivities: StravaActivity[] = []
    while (true) {
      const activities = await stravaApi.getActivities(token, {
        page: currPage,
        perPage: perPage,
        year: year
      })
      allActivities.push(...activities)
      if (activities.length < perPage) {
        break
      }
      currPage++
    }
    return allActivities
  },
  getAthleteZones: async (token: string): Promise<StravaAthleteZones> => {
    const baseUrl = "https://www.strava.com/api/v3/athlete/zones"
    const headers = {
      Authorization: `Bearer ${token}`
    }
    const data = await stravaApi.getData(baseUrl, "GET", { headers: headers })
    return data
  },
  getGear: async (token: string, gearId: string): Promise<StravaGear[]> => {
    const baseUrl = "https://www.strava.com/api/v3/gear"
    const headers = {
      Authorization: `Bearer ${token}`
    }
    const data = await stravaApi.getData(baseUrl, "GET", { headers: headers, params: gearId })
    return data
  },
  getActivityPhotos: async (token: string, activityId: number): Promise<StravaPhoto[]> => {
    const baseUrl = `https://www.strava.com/api/v3/activities/${activityId}/photos`
    const headers = {
      Authorization: `Bearer ${token}`
    }
    const params = new URLSearchParams({
      size: "2000",
      photo_sources: "true"
    }).toString()
    const data = await stravaApi.getData(baseUrl, "GET", { headers: headers, params: params })
    return data
  }
}