import { useCurrentYearContext } from "../../hooks/useCurrentYearContext"
import { useThemeContext } from "../../hooks/useThemeContext"


export default function Loading() {
  const { darkMode } = useThemeContext()
  const { currentYear } = useCurrentYearContext()

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="w-screen h-screen flex flex-col items-center justify-center dark:bg-[#121212] dark:text-white">
        <div className="flex flex-col gap-2 text-lg">
          <p>Retrieving <span className="font-bold text-xl">{currentYear}</span> activities...</p>
        </div>
      </div>
    </div>
  )
}