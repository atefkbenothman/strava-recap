import { useCurrentYearContext } from "../../hooks/useCurrentYearContext"
import { useThemeContext } from "../../hooks/useThemeContext"


export default function Loading() {
  const { darkMode } = useThemeContext()
  const { currentYear } = useCurrentYearContext()

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="w-dvw h-dvh dark:bg-[#121212] dark:text-white overscroll-none">
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex-col p-2 space-y-4">
            <p className="">
              Retrieving <span className="font-bold text-xl">{currentYear}</span> activities
              <span className="loading-dots inline-block w-[12px]"></span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}