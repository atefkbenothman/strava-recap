import { useCurrentYearContext } from "../../hooks/useCurrentYearContext"
import { useThemeContext } from "../../hooks/useThemeContext"



export default function NoActivities() {
  const { currentYear, updateYear } = useCurrentYearContext()
  const { darkMode } = useThemeContext()

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="w-dvw h-dvh flex flex-col items-center justify-center dark:text-white dark:bg-[#121212]">
        <div className="flex flex-col gap-4 text-lg">
          <>
            <p>No activities from <span className="font-bold text-xl">{currentYear}</span></p>
            <div className="flex gap-6">
              <a className="underline text-left hover:cursor-pointer w-fit text-blue-500" onClick={() => updateYear(2025)}>/{2025}</a>
            </div>
          </>
        </div>
      </div>
    </div>
  )
}