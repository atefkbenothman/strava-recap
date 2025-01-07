import { useCurrentYearContext } from "../../hooks/useCurrentYearContext"
import { useStravaAuthContext } from "../../hooks/useStravaAuthContext"
import { useThemeContext } from "../../hooks/useThemeContext"


interface ErrorProps {
  message: string
  code: number | null
}

export default function Error({ message, code }: ErrorProps) {
  const { updateYear } = useCurrentYearContext()
  const { logout } = useStravaAuthContext()
  const { darkMode } = useThemeContext()

  const thisYear = new Date().getFullYear()

  if (code && (code === 429 || code === 403)) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div className="w-screen h-screen dark:bg-[#121212] dark:text-white">
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex-col p-2 space-y-6">
              <p className="break-word">Thank you for taking the time to check out Fitness Recap 🙏</p>
              <p className="break-word">Unfortunately Strava's API rate limit has been exceeded at the moment.</p>
              <p className="break-word font-semibold">Please check back later today or tomorrow.</p>
              <p className="break-word">Thank you for your patience and understanding!</p>
              <p className="text-blue-500 underline hover:cursor-pointer w-fit" onClick={logout}>Logout</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="w-screen h-screen dark:bg-[#121212] dark:text-white">
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex-col p-2 space-y-4">
            <div>
              <p className="text-red-500 font-bold">Error: </p>
              <p className="break-all">{message}</p>
            </div>
            <div className="flex gap-6">
              <p className="text-blue-500 underline hover:cursor-pointer w-fit" onClick={logout}>Reauthenticate</p>
              <p>or</p>
              <a className="underline text-left hover:cursor-pointer w-fit text-blue-500" onClick={() => updateYear(thisYear)}>/{thisYear}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}