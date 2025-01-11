import { useStravaAuthContext } from "../../hooks/useStravaAuthContext"
import { useThemeContext } from "../../hooks/useThemeContext"


interface ErrorProps {
  message: string
  code: number | null
}

export default function Error({ message, code }: ErrorProps) {
  const { logout } = useStravaAuthContext()
  const { darkMode } = useThemeContext()

  if (code && code === 401) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div className="w-screen h-screen flex flex-col items-center justify-center dark:bg-[#121212] dark:text-white">
          <div className="flex flex-col gap-4 px-8">
            <div className="flex flex-col gap-2 grow-0">
              <div className="flex flex-col gap-6">
                <div className="flex gap-2">
                  <p className="text-red-500 font-bold">Error: </p>
                  <p className="break-word">Access token expired. Please reauthenticate</p>
                </div>
                <div className="flex gap-12">
                  <p className="text-blue-500 underline hover:cursor-pointer w-fit" onClick={logout}>Reauthenticate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (code && code === 403) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div className="w-screen h-screen flex flex-col items-center justify-center dark:bg-[#121212] dark:text-white">
          <div className="flex flex-col gap-4 px-8">
            <div className="flex flex-col gap-2 grow-0">
              <div className="flex flex-col gap-6">
                <p className="break-word">Thank you for taking the time to check out Fitness Recap 🙏</p>
                <p className="break-word">Unfortunately Strava's athlete count limit has been exceeded for this website at the moment</p>
                <p className="break-word">I have contacted Strava support to increase the limits and waiting to hear back</p>
                <p className="break-word font-semibold">Please check back later today or tomorrow</p>
                <p className="break-word">Thank you for your patience and understanding!</p>
                <div className="flex gap-12">
                  <p className="text-blue-500 underline hover:cursor-pointer w-fit" onClick={logout}>Logout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (code && code === 404) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div className="w-screen h-screen flex flex-col items-center justify-center dark:bg-[#121212] dark:text-white">
          <div className="flex flex-col gap-4 px-8">
            <div className="flex flex-col gap-2 grow-0">
              <div className="flex flex-col gap-6">
                <div className="flex gap-2">
                  <p className="text-red-500 font-bold">Error: </p>
                  <p className="break-word">Page not found</p>
                </div>
                <div className="flex gap-12">
                  <p className="text-blue-500 underline hover:cursor-pointer w-fit" onClick={logout}>Reauthenticate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (code && code === 429) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div className="w-screen h-screen dark:bg-[#121212] dark:text-white">
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex-col p-2 space-y-6">
              <p className="break-word">Thank you for taking the time to check out Fitness Recap 🙏</p>
              <p className="break-word">Unfortunately Strava's API rate limit has been exceeded at the moment</p>
              <p className="break-word font-semibold">Please check back later today or tomorrow</p>
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
      <div className="w-screen h-screen flex flex-col items-center justify-center dark:bg-[#121212] dark:text-white">
        <div className="flex flex-col gap-4 px-8">
          <div className="flex flex-col gap-2 grow-0">
            <div className="flex flex-col gap-6">
              <p className="break-word">Strava is having issues</p>
              <p className="break-word">Please try again later</p>
              <div className="flex gap-12">
                <p className="text-blue-500 underline hover:cursor-pointer w-fit" onClick={logout}>Logout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}