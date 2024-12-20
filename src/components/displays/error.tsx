import { useCurrentYearContext } from "../../hooks/useCurrentYearContext"
import { useStravaAuthContext } from "../../hooks/useStravaAuthContext"
import { useThemeContext } from "../../hooks/useThemeContext"


interface ErrorProps {
  message: string
}

export default function Error({ message }: ErrorProps) {
  const { updateYear } = useCurrentYearContext()
  const { logout } = useStravaAuthContext()
  const { darkMode } = useThemeContext()

  const thisYear = new Date().getFullYear()

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