import { StravaActivity, StravaAthlete } from "../types/strava"

export const stravaApi = {
  clientId: import.meta.env.VITE_STRAVA_CLIENT_ID,
  clientSecret: import.meta.env.VITE_STRAVA_CLIENT_SECRET,
  defaultRedirectUri: import.meta.env.VITE_STRAVA_REDIRECT_URI,
  redirectUri: import.meta.env.VITE_STRAVA_REDIRECT_URI,
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
  exchangeToken: async (code: string): Promise<{ accessToken: string, athlete: StravaAthlete } | null> => {
    const baseUrl = "https://www.strava.com/oauth/token"
    try {
      const params = new URLSearchParams({
        client_id: stravaApi.clientId,
        client_secret: stravaApi.clientSecret,
        code: code,
        grant_type: "authorization_code"
      }).toString()
      const exchangeUrl = `${baseUrl}?${params}`
      const res = await fetch(exchangeUrl, {
        method: "POST"
      })
      if (!res.ok) { throw new Error("Failed to exchange token") }
      const data = await res.json()
      return { accessToken: data.access_token, athlete: data.athlete }
    } catch (err) {
      console.error("Token exchange error: ", err)
      return null
    }
  },
  getActivities: async (token: string, options?: { page?: number, perPage?: number, year?: number }): Promise<StravaActivity[]> => {
    const { page = 1, perPage = 200, year = new Date().getFullYear() } = options || {}
    if (year < 2010 || year > new Date().getFullYear() + 1) {
      return []
    }
    const baseUrl = "https://strava.com/api/v3/athlete/activities"
    const beforeDate = Math.floor(new Date(`${year + 1}-01-01`).getTime() / 1000).toString()
    const afterDate = Math.floor(new Date(`${year}-01-01`).getTime() / 1000).toString()
    const params = new URLSearchParams({
      after: afterDate,
      before: beforeDate,
      page: page.toString(),
      per_page: perPage.toString()
    })
    const activitiesUrl = `${baseUrl}?${params}`
    try {
      const res = await fetch(activitiesUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (!res.ok) { throw new Error("Failed to fetch activities") }
      const data = await res.json()
      return data.reverse()
    } catch (err) {
      console.error("Activities fetch error: ", err)
      return []
    }
  },
  getAllActivities: async (token: string, year: number): Promise<StravaActivity[]> => {
    const allActivities: StravaActivity[] = []
    let page = 1
    const perPage = 200
    while (true) {
      const activities = await stravaApi.getActivities(token, { page, perPage, year })
      if (activities.length === 0) { break }
      allActivities.push(...activities)
      page++
      break
    }
    return allActivities
  },
  updateRedirectUri: (year: number): void => {
    stravaApi.redirectUri = stravaApi.defaultRedirectUri
    stravaApi.redirectUri = `${stravaApi.defaultRedirectUri}/${year}`
  }
}