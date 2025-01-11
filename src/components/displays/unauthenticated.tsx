import { useState } from "react"
import { useThemeContext } from "../../hooks/useThemeContext"
import { useStravaAuthContext } from "../../hooks/useStravaAuthContext"
import { AboutDialog } from "../common/aboutDialog"
import { Info } from "lucide-react"
import connectWithStravaLogo from "/connect-with-strava.svg"
import { useCurrentYearContext } from "../../hooks/useCurrentYearContext"

const emojis = [
  "️🏃‍♀️",
  "🏃‍♂️",
  "🚴‍♂️",
  "🚴‍♀️",
  "🛶",
  "🚣‍♂️",
  "🏄‍♂️",
  "🏄‍♀️",
  "🏊‍♂️",
  "🏊‍♀️",
  "🎿",
  "⛸️",
  "⛷️",
  "🏂",
  "🛼",
  "⛳",
  "🛹",
  "🏸",
  "🎾",
  "🏋️‍♂️",
  "🏋️‍♀️",
  "🧘‍♂️",
  "🧘‍♀️",
  "🏓",
  "⚽️",
  "🏐",
]

function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)]
}

export default function Unauthenticated() {
  const { currentYear } = useCurrentYearContext()
  const { login } = useStravaAuthContext()
  const { darkMode } = useThemeContext()

  const [showAthleteLimitError, setShowAthleteLimitError] = useState<boolean>(false)
  const [icon] = useState<string>(getRandomEmoji())

  const handleLogin = () => {
    setShowAthleteLimitError(true)
  }

  if (showAthleteLimitError) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div className="w-screen h-screen flex flex-col items-center justify-center dark:bg-[#121212] dark:text-white">
          <div className="flex flex-col gap-4 px-8">
            <div className="flex flex-col gap-2 grow-0">
              <div className="flex flex-col gap-6">
                <p className="break-word">Thank you for taking the time to check out Fitness Recap 🙏</p>
                <p className="break-word">Unfortunately Strava's athlete count limit has been exceeded for this website at the moment</p>
                <p className="break-word">If you are a new user, you may run into a 403 error</p>
                <p className="break-word">I have contacted Strava support to increase the limits and waiting to hear back</p>
                <p className="break-word font-semibold">Please check back later today or tomorrow</p>
                <p className="break-word">Thank you for your patience and understanding!</p>
                <div className="flex gap-12">
                  <p className="text-blue-500 underline hover:cursor-pointer w-fit" onClick={() => setShowAthleteLimitError(false)}>Back</p>
                  <p className="text-blue-500 underline hover:cursor-pointer w-fit" onClick={() => login(currentYear)}>Continue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="w-screen h-screen flex flex-col items-center justify-center dark:bg-[#121212] dark:text-white">
        <div className="flex flex-col gap-4 px-8">
          <div className="flex flex-col gap-2 grow-0">
            <p className="text-2xl font-semibold text-balance">{currentYear} Fitness Recap {icon}</p>
            <div>
              <p className="text-sm text-gray-500 dark:text-white/80">Explore yearly recaps of your Strava activities</p>
            </div>
          </div>
          <img
            className="hover:cursor-pointer relative -translate-x-0.5"
            width={160}
            src={connectWithStravaLogo}
            alt="login with strava"
            onClick={handleLogin}
          />
        </div>
      </div>
      <AboutDialog
        trigger={
          <Info
            size={28}
            strokeWidth={2}
            color={darkMode ? "#ebebeb" : "#525252"}
            className="hover:cursor-pointer hover:scale-125 fixed bottom-6 right-6"
          />
        }
      />
    </div>
  )
}