# Fitness Recap
![Vercel](https://vercelbadge.vercel.app/api/atefkbenothman/strava-recap)

Explore yearly recaps of your Strava activities

<img src="https://github.com/user-attachments/assets/e9ac8068-6d69-4b51-81a4-e1fdb25016a3" alt="Screenshot" width="400">

## Tech Stack
* React + Vite
* Tailwind + Shadcn
* Recharts
* Mapbox

## Local Development
1. Create an API application on Strava. Obtain your `Client ID` and `Client Secret`

2. Clone the repo
```bash
git clone https://github.com/atefkbenothman/strava-recap.git
```

3. Create a `.env` file in the root directory with the following key/value pairs:
```txt
VITE_STRAVA_CLIENT_ID=<strava client id>
VITE_STRAVA_CLIENT_SECRET=<strava client secret>
VITE_STRAVA_REDIRECT_URI_DEV=http://localhost:5173
VITE_MAPBOX_ACCESS_TOKEN=<mapbox access token>
```

4. Install dependencies
```bash
npm install
```

5. Start dev server
```bash
npm run dev
```
