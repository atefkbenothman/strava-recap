import { useContext } from "react"
import { RecapContext } from "../contexts/recapContext"
import { Theme, ThemeName } from "../themes/theme"
import { Units, UnitDefinitions } from "../types/activity"
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

export default function Menu() {
  const { athlete, units, setUnits, setThemeName, logout } = useContext(RecapContext)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <img
          src={athlete?.profile}
          width={28}
          height={28}
          className="rounded-full border-2 hover:border-gray-600 hover:cursor-pointer max-w-full hover:shadow-lg hover:scale-110"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSub>
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
          <DropdownMenuSubTrigger className="font-semibold">Theme</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {Object.keys(Theme).map((theme, idx) => (
              <div key={idx}>
                <DropdownMenuItem
                  className="hover:cursor-pointer font-semibold"
                  onClick={() => setThemeName(theme as ThemeName)}
                >
                  {theme}
                </DropdownMenuItem>
                {idx !== Object.keys(Theme).length - 1 ? (
                  <DropdownMenuSeparator />
                ) : null}
              </div>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
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
        <DropdownMenuItem
          onClick={logout}
          className="hover:cursor-pointer bg-red-500 focus:bg-red-600 focus:text-white text-white font-semibold"
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent >
    </DropdownMenu >
  )
}