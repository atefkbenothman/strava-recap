import { useContext, useEffect, useState } from "react"
import { ActivityDataContext, AuthContext, ThemeContext } from "../contexts/context"
import { Theme, ThemeName } from "../themes/theme"
import { UnitDefinitions } from "../types/activity"
import { SportType } from "../types/strava"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "./ui/tabs"
import { AboutDialog } from "./aboutDialog"
import { cn } from "../utils/utils"
import { ChevronDown } from "lucide-react"

export default function Menu() {
  const { athlete, logout } = useContext(AuthContext)
  const { setThemeName, themeName, darkMode, setDarkMode } = useContext(ThemeContext)
  const { activityData, filter, units, setUnits, setFilter } = useContext(ActivityDataContext)

  const [sportTypes, setSportTypes] = useState<SportType[]>([])
  const [openAboutDialog, setOpenAboutDialog] = useState<boolean>(false)

  useEffect(() => {
    function getSportTypes() {
      if (!activityData) return
      const sports = Object.keys(activityData.bySportType!) as SportType[]
      setSportTypes(sports)
    }
    getSportTypes()
  }, [activityData])

  return (
    <div >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 hover:cursor-pointer">
            <img
              src={athlete?.profile}
              width={28}
              height={28}
              className="rounded-full border-2 hover:border-gray-600 hover:cursor-pointer max-w-full hover:shadow-lg"
            />
            <ChevronDown size={14} />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className={darkMode ? "dark bg-[#0a0a0a] text-white border-white/30" : "bg-white"}>
          {/* Strava Profile */}
          <DropdownMenuItem
            className="hover:cursor-pointer font-semibold dark:hover:bg-[#1d1d1e] dark:hover:text-white"
          >
            {athlete ? (
              <a
                href={`https://www.strava.com/athletes/${athlete.id}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                Strava Profile
              </a>
            ) : null}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="dark:bg-[#1d1d1e]" />

          {/* Filter Picker */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="font-semibold dark:hover:bg-[#1d1d1e] dark:hover:text-white dark:data-[state=open]:bg-[#1d1d1e]">Filter</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="dark:bg-[#0a0a0a] dark:text-white border-white/30">
              <DropdownMenuItem
                className={cn(
                  'hover:cursor-pointer font-semibold dark:hover:bg-[#1d1d1e] dark:hover:text-white',
                  filter === "All" && `text-white bg-slate-700`
                )}
                onClick={() => setFilter("All")}
                onSelect={(e) => e.preventDefault()}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuSeparator className="dark:bg-[#1d1d1e]" />
              {sportTypes.map((sport, idx) => (
                <div key={idx}>
                  <DropdownMenuItem
                    className={cn(
                      'hover:cursor-pointer font-semibold dark:hover:bg-[#1d1d1e] dark:hover:text-white',
                      sport === filter && `text-white bg-slate-700`
                    )}
                    onClick={() => setFilter(sport)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {sport}
                  </DropdownMenuItem>
                  {idx !== sportTypes.length - 1 ? (
                    <DropdownMenuSeparator className="dark:bg-[#1d1d1e]" />
                  ) : null}
                </div>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator className="dark:bg-[#1d1d1e]" />

          {/* Theme Picker */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="font-semibold dark:hover:bg-[#1d1d1e] dark:hover:text-white dark:data-[state=open]:bg-[#1d1d1e]">Theme</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="dark:bg-[#0a0a0a] dark:text-white border-white/30">
              {Object.keys(Theme).map((t, idx) => (
                <div key={idx}>
                  <DropdownMenuItem
                    className={cn(
                      'hover:cursor-pointer font-semibold dark:hover:bg-[#1d1d1e] dark:hover:text-white',
                      t === themeName && `text-white bg-slate-700`
                    )}
                    onClick={() => setThemeName(t as ThemeName)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {t}
                  </DropdownMenuItem>
                  {idx !== Object.keys(Theme).length - 1 ? (
                    <DropdownMenuSeparator className="dark:bg-[#1d1d1e]" />
                  ) : null}
                </div>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator className="dark:bg-[#1d1d1e]" />

          {/* Unit Picker */}
          <DropdownMenuItem
            className="font-semibol dark:hover:bg-[#1d1d1e] dark:hover:text-white"
            onSelect={(e) => e.preventDefault()}
          >
            <div className="flex w-full items-center gap-4 font-semibold">
              <p>Units</p>
              <div className="hover:cursor-pointer w-full flex justify-end">
                <Tabs defaultValue={UnitDefinitions[units].distance} className="">
                  <TabsList className="bg-slate-200 dark:bg-[#232527] dark:text-white">
                    <TabsTrigger
                      value="mi"
                      onClick={() => setUnits("imperial")}
                      className="dark:text-white/80 dark:data-[state=active]:bg-[#0a0a0a] dark:data-[state=active]:text-white"
                    >
                      Mi
                    </TabsTrigger>
                    <TabsTrigger
                      value="km"
                      onClick={() => setUnits("metric")}
                      className="dark:text-white/80 dark:data-[state=active]:bg-[#0a0a0a] dark:data-[state=active]:text-white"
                    >
                      Km
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="dark:bg-[#1d1d1e]" />

          {/* Dark Mode */}
          <DropdownMenuItem
            className="font-semibol dark:hover:bg-[#1d1d1e] dark:hover:text-white"
            onSelect={(e) => e.preventDefault()}
          >
            <div className="flex w-full items-center gap-4 font-semibold">
              <p>Dark Mode</p>
              <div className="hover:cursor-pointer flex justify-end">
                <Tabs defaultValue={darkMode ? "on" : "off"} className="flex w-fit">
                  <TabsList className="bg-slate-200 dark:bg-[#232527] dark:text-white">
                    <TabsTrigger
                      value="on"
                      onClick={() => setDarkMode(true)}
                      className="dark:text-white/80 dark:data-[state=active]:bg-[#0a0a0a] dark:data-[state=active]:text-white"
                    >
                      On
                    </TabsTrigger>
                    <TabsTrigger
                      value="off"
                      onClick={() => setDarkMode(false)}
                      className="dark:text-white/80 dark:data-[state=active]:bg-[#0a0a0a] dark:data-[state=active]:text-white"
                    >
                      Off
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="dark:bg-[#1d1d1e]" />

          {/* About */}
          <DropdownMenuItem
            className="hover:cursor-pointer font-semibold dark:hover:bg-[#1d1d1e] dark:hover:text-white dark:focus:bg-[#1d1d1e] dark:focus:text-white"
            onSelect={(e) => e.preventDefault()}
          >
            <AboutDialog
              open={openAboutDialog}
              onOpenChange={setOpenAboutDialog}
              trigger={
                <p onClick={() => setOpenAboutDialog(true)} className="w-full">About</p>
              }
            />
          </DropdownMenuItem>
          <DropdownMenuSeparator className="dark:bg-[#1d1d1e]" />

          {/* Donate */}
          <DropdownMenuItem
            className="hover:cursor-pointer font-semibold dark:hover:bg-[#1d1d1e] dark:hover:text-white"
          >
            <a href="https://www.buymeacoffee.com/atefkbenothman" target="_blank" className="w-full">Donate</a>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="dark:bg-[#1d1d1e]" />

          {/* Sign Out */}
          <DropdownMenuItem
            onClick={logout}
            className="hover:cursor-pointer bg-red-500 focus:bg-red-600 focus:text-white text-white font-semibold"
          >
            Sign Out
          </DropdownMenuItem>

        </DropdownMenuContent >
      </DropdownMenu >
      {/* <InfoDialog /> */}
    </div >
  )
}