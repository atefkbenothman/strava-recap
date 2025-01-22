import { useState } from "react"
import { useStravaAuthContext } from "../../hooks/useStravaAuthContext"
import { useThemeContext } from "../../hooks/useThemeContext"
import { UnitDefinitions } from "../../types/activity"
import { SportType } from "../../types/strava"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "../ui/tabs"
import { AboutDialog } from "../common/aboutDialog"
import { cn } from "../../utils/utils"
import { ChevronDown } from "lucide-react"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { Themes, Theme } from "../../contexts/themeContext"
import * as Sentry from "@sentry/browser"


type MenuProps = {
  shuffle: () => void
}

export default function Menu({ shuffle }: MenuProps) {
  const { activitiesData, filter, units, setUnits, setFilter } = useStravaActivityContext()
  const { athlete, logout } = useStravaAuthContext()
  const { theme, updateTheme, darkMode, setDarkMode } = useThemeContext()
  const [openAboutDialog, setOpenAboutDialog] = useState<boolean>(false)

  const handleSetFilter = (filter: SportType | "All") => {
    Sentry.captureMessage("filter by sport", {
      level: "info",
      tags: {
        action: "filter",
        sport: filter
      }
    });
    setFilter(filter ?? null)
  }

  return (
    <div >
      <DropdownMenu modal={false}>
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

        <DropdownMenuContent className={darkMode ? "dark bg-[#121212] text-white border-white/30" : "bg-white"}>
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
            <DropdownMenuSubContent className="dark:bg-[#121212] dark:text-white border-white/30 max-w-[100px]">
              <DropdownMenuItem
                className={cn(
                  'hover:cursor-pointer font-semibold dark:hover:bg-[#1d1d1e] dark:hover:text-white',
                  filter === "All" && `text-white bg-slate-700`
                )}
                onClick={() => handleSetFilter("All")}
                onSelect={(e) => e.preventDefault()}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuSeparator className="dark:bg-[#1d1d1e]" />
              {Object.keys(activitiesData.byType).map((sport, idx) => (
                <div key={idx}>
                  <DropdownMenuItem
                    className={cn(
                      'hover:cursor-pointer font-semibold dark:hover:bg-[#1d1d1e] dark:hover:text-white break-all',
                      sport === filter && `text-white bg-slate-700`
                    )}
                    onClick={() => handleSetFilter(sport as SportType)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {sport}
                  </DropdownMenuItem>
                  {idx !== Object.keys(activitiesData.byType).length - 1 ? (
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
            <DropdownMenuSubContent className="dark:bg-[#121212] dark:text-white border-white/30">
              {Object.keys(Themes).map((t, idx) => (
                <div key={idx}>
                  <DropdownMenuItem
                    className={cn(
                      'hover:cursor-pointer font-semibold dark:hover:bg-[#1d1d1e] dark:hover:text-white',
                      t === theme && `text-white bg-slate-700`
                    )}
                    onClick={() => updateTheme(t as Theme)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {t}
                  </DropdownMenuItem>
                  {idx !== Object.keys(Themes).length - 1 ? (
                    <DropdownMenuSeparator className="dark:bg-[#1d1d1e]" />
                  ) : null}
                </div>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator className="dark:bg-[#1d1d1e]" />

          {/* Reshuffle */}
          <DropdownMenuItem
            className="hover:cursor-pointer font-semibold dark:hover:bg-[#1d1d1e] dark:hover:text-white dark:focus:bg-[#1d1d1e] dark:focus:text-white"
            onClick={shuffle}
            onSelect={(e) => e.preventDefault()}
          >
            <p>Reshuffle</p>
          </DropdownMenuItem>
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
                      className="dark:text-white/80 dark:data-[state=active]:bg-[#121212] dark:data-[state=active]:text-white"
                    >
                      Mi
                    </TabsTrigger>
                    <TabsTrigger
                      value="km"
                      onClick={() => setUnits("metric")}
                      className="dark:text-white/80 dark:data-[state=active]:bg-[#121212] dark:data-[state=active]:text-white"
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
                      className="dark:text-white/80 dark:data-[state=active]:bg-[#121212] dark:data-[state=active]:text-white"
                    >
                      On
                    </TabsTrigger>
                    <TabsTrigger
                      value="off"
                      onClick={() => setDarkMode(false)}
                      className="dark:text-white/80 dark:data-[state=active]:bg-[#121212] dark:data-[state=active]:text-white"
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
    </div >
  )
}