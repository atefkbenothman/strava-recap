import { useContext } from "react"
import { RecapContext } from "../contexts/recapContext"
import { Theme, ThemeName } from "../themes/theme"
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

export default function Menu() {
  const { athlete, setThemeName, logout } = useContext(RecapContext)
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
              <DropdownMenuItem
                key={idx}
                className="hover:cursor-pointer font-semibold"
                onClick={() => setThemeName(theme as ThemeName)}
              >
                {theme}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {/* <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer font-semibold"
        >
          Info
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="hover:cursor-pointer focus:bg-red-500 focus:text-white font-semibold"
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent >
    </DropdownMenu >
  )
}