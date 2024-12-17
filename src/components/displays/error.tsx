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
      <div className="w-screen h-screen flex flex-col items-center justify-center dark:bg-[#121212] dark:text-white">
        <div className="flex flex-col gap-2 text-lg mx-[30%]">
          <div className="flex gap-2">
            <p className="text-red-500 font-bold">Error: </p>
            <p>{message}</p>
          </div>
          <div className="flex gap-6">
            <p className="text-blue-500 underline hover:cursor-pointer w-fit" onClick={logout}>Reauthenticate</p>
            <p>or</p>
            <a className="underline text-left hover:cursor-pointer w-fit text-blue-500" onClick={() => updateYear(thisYear)}>/{thisYear}</a>
          </div>
        </div>
      </div>
    </div>
  )
}