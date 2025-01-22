import YearPicker from "./yearPicker"
import Menu from "./menu"

import { useStravaAuthContext } from "../../hooks/useStravaAuthContext"

import poweredByStravaLogo from "/powered-by-strava.svg"
import { useCurrentYearContext } from "../../hooks/useCurrentYearContext"


type NavbarProps = {
  toggleShuffle: () => void
}

export default function Navbar({ toggleShuffle }: NavbarProps) {
  const { athlete } = useStravaAuthContext()
  const { currentYear } = useCurrentYearContext()

  return (
    <>
      <div className="w-full h-full grid grid-cols-2 items-center gap-4 p-1">

        <div className="h-full w-full items-center flex">
          <div className="font-semibold text-xl w-full text-balance">
            <p className="text-balance">{athlete?.firstname} {athlete?.lastname}'s {currentYear} Recap</p>
          </div>
        </div>

        <div className="w-fit h-full ml-auto">
          <div className="w-full h-full grid grid-rows-2 sm:grid-rows-1 grid-flow-col gap-x-6">
            <div className="flex items-center justify-center">
              <YearPicker />
            </div>
            <div className="flex items-center justify-end">
              <Menu shuffle={toggleShuffle} />
            </div>
            <div className="items-center hidden sm:block w-fit ml-auto">
              <div className="flex items-center h-full">
                <img
                  src={poweredByStravaLogo}
                  alt="powered by strava logo"
                  width={70}
                  height={80}
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}