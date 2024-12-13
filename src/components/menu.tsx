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
import { cn } from "../utils/utils"
import { ChevronDown } from "lucide-react"

export default function Menu() {
  const { athlete, logout } = useContext(AuthContext)
  const { setThemeName, themeName } = useContext(ThemeContext)
  const { activityData, filter, units, setUnits, setFilter } = useContext(ActivityDataContext)

  const [sportTypes, setSportTypes] = useState<SportType[]>([])

  useEffect(() => {
    function getSportTypes() {
      if (!activityData) return
      const sports = Object.keys(activityData.bySportType!) as SportType[]
      setSportTypes(sports)
    }
    getSportTypes()
  }, [activityData])

  return (
    <div>
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

        <DropdownMenuContent>
          {/* <DropdownMenuLabel className="bg-black rounded text-white">Menu</DropdownMenuLabel>
          <DropdownMenuSeparator /> */}

          {/* Strava Profile */}
          <DropdownMenuItem
            className="hover:cursor-pointer font-semibold"
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
          <DropdownMenuSeparator />

          {/* Filter Picker */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="font-semibold">Filter</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                className={cn(
                  'hover:cursor-pointer font-semibold',
                  filter === "All" && `text-white bg-slate-700`
                )}
                onClick={() => setFilter("All")}
                onSelect={(e) => e.preventDefault()}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {sportTypes.map((sport, idx) => (
                <div key={idx}>
                  <DropdownMenuItem
                    className={cn(
                      'hover:cursor-pointer font-semibold',
                      sport === filter && `text-white bg-slate-700`
                    )}
                    onClick={() => setFilter(sport)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {sport}
                  </DropdownMenuItem>
                  {idx !== sportTypes.length - 1 ? (
                    <DropdownMenuSeparator />
                  ) : null}
                </div>
              ))}
              {/* <DropdownMenuItem
                className="font-semibold"
                onSelect={(e) => e.preventDefault()}
              >
                <RadioGroup defaultValue="all">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="font-semibold">All</Label>
                  </div>
                </RadioGroup>
              </DropdownMenuItem> */}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />

          {/* Theme Picker */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="font-semibold">Theme</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {Object.keys(Theme).map((t, idx) => (
                <div key={idx}>
                  <DropdownMenuItem
                    className={cn(
                      'hover:cursor-pointer font-semibold',
                      t === themeName && `text-white bg-slate-700`
                    )}
                    onClick={() => setThemeName(t as ThemeName)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {t}
                  </DropdownMenuItem>
                  {idx !== Object.keys(Theme).length - 1 ? (
                    <DropdownMenuSeparator />
                  ) : null}
                </div>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />

          {/* Unit Picker */}
          <DropdownMenuItem
            className="font-semibold"
            onSelect={(e) => e.preventDefault()}
          >
            <div className="flex w-fit items-center gap-4">
              <p>Units</p>
              <div className="ml-auto hover:cursor-pointer">
                <Tabs defaultValue={UnitDefinitions[units].distance} className="flex w-fit">
                  <TabsList className="bg-slate-200">
                    <TabsTrigger value="mi" onClick={() => setUnits("imperial")}>Mi</TabsTrigger>
                    <TabsTrigger value="km" onClick={() => setUnits("metric")}>Km</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {/* Sign Out */}
          <DropdownMenuItem
            className="hover:cursor-pointer font-semibold"
          >
            <a href="https://www.buymeacoffee.com/atefkbenothman" target="_blank" className="w-full">Donate</a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

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