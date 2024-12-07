import { useContext } from "react"
import { RecapContext } from "../contexts/recapContext"
import { THEME, ThemeKey } from "../themes/themeConfig"
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
  const { athlete, setThemeKey, logout } = useContext(RecapContext)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <img
          src={athlete?.profile}
          width={28}
          height={28}
          className="rounded-full border-2 border-gray-600 hover:cursor-pointer max-w-full"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {Object.keys(THEME).map((theme, idx) => (
              <DropdownMenuItem
                key={idx}
                className="hover:cursor-pointer"
                onClick={() => setThemeKey(theme as ThemeKey)}
              >
                {theme}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="hover:cursor-pointer focus:bg-red-500 focus:text-white">
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}