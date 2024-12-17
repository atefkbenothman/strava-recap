import { useThemeContext } from "../../hooks/useThemeContext"
import { useStravaAuthContext } from "../../hooks/useStravaAuthContext"
import { AboutDialog } from "../common/aboutDialog"
import { Info } from "lucide-react"
import connectWithStravaLogo from "/connect-with-strava.svg"
import { useCurrentYearContext } from "../../hooks/useCurrentYearContext"


export default function Unauthenticated() {
  const { currentYear } = useCurrentYearContext()
  const { login } = useStravaAuthContext()
  const { darkMode } = useThemeContext()

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="w-screen h-screen flex flex-col items-center justify-center dark:bg-[#121212] dark:text-white">
        <div className="flex flex-col gap-4 px-8">
          <div className="flex flex-col gap-2 grow-0">
            <div className="flex items-center gap-6">
              <p className="text-2xl font-semibold flex">{currentYear} Fitness Recap</p>
              <AboutDialog
                trigger={
                  <Info
                    size={18}
                    strokeWidth={2}
                    color={darkMode ? "#ebebeb" : "#525252"}
                    className="hover:cursor-pointer hover:scale-125"
                  />
                }
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-white/80">Explore yearly recaps of your Strava activities</p>
            </div>
          </div>
          <img
            className="hover:cursor-pointer"
            width={160}
            src={connectWithStravaLogo}
            alt="login with strava"
            onClick={() => login(currentYear)}
          />
        </div>
      </div>
    </div>
  )
}