# Fitness Recap
Explore yearly recaps of your Strava activities

![Screen Shot 2025-01-05 at 10 55 22 PM](https://github.com/user-attachments/assets/e9ac8068-6d69-4b51-81a4-e1fdb25016a3)

## Tech Stack
* React + Vite
* Tailwind + Shadcn
* Recharts
* Mapbox

## Local Development
1. Create a `.env` file in the root directory with the following key/value pairs:
```txt
VITE_STRAVA_CLIENT_ID=<strava client id>
VITE_STRAVA_CLIENT_SECRET=<strava client secret>
VITE_STRAVA_REDIRECT_URI_DEV=<localhost>
VITE_MAPBOX_ACCESS_TOKEN=<mapbox access token>
```

2. Install dependencies
```bash
npm install
```

3. Start dev server
```bash
npm run dev
```
