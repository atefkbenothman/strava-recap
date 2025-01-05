import { useCurrentYearContext } from "../../hooks/useCurrentYearContext"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { useThemeContext } from "../../hooks/useThemeContext"



export default function NoActivities() {
  const { currentYear, updateYear } = useCurrentYearContext()
  const { darkMode } = useThemeContext()
  const { filter, setFilter } = useStravaActivityContext()

  const thisYear = new Date().getFullYear()

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="w-screen h-screen flex flex-col items-center justify-center dark:text-white dark:bg-[#121212]">
        <div className="flex flex-col gap-4 text-lg">
          {filter !== "All" ? (
            <>
              <p>No activities [{filter}] from <span className="font-bold text-xl">{currentYear}</span></p>
              <div className="flex gap-6">
                <a className="underline text-left hover:cursor-pointer w-fit text-blue-500" onClick={() => setFilter("All")}>reset filter</a>
                <p>or</p>
                <a className="underline text-left hover:cursor-pointer w-fit text-blue-500" onClick={() => updateYear(thisYear)}>/{thisYear}</a>
              </div>
            </>
          ) : (
            <>
              <p>No activities from <span className="font-bold text-xl">{currentYear}</span></p>
              <div className="flex gap-6">
                <a className="underline text-left hover:cursor-pointer w-fit text-blue-500" onClick={() => updateYear(2024)}>/{2024}</a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}