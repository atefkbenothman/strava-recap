import { useEffect, useState, createContext } from "react"
import { track } from "@vercel/analytics"


type CurrentYearContextType = {
  currentYear: number
  updateYear: (year: number) => void
}

export const CurrentYearContext = createContext<CurrentYearContextType>({
  currentYear: 0,
  updateYear: () => { }
})

type CurrentYearContextProviderProps = {
  children: React.ReactNode
}

export default function CurrentYearContextProvider({ children }: CurrentYearContextProviderProps) {
  const [currentYear, setCurrentYear] = useState<number>(Number(window.location.pathname.split("/")[1]) || 0)

  // redirect to this year if no year was set in the url path
  useEffect(() => {
    if (window.location.pathname === "/") {
      const year = new Date().getFullYear()
      updateYear(year)
    }
  }, [])

  const updateYear = (year: number) => {
    setCurrentYear(year)
    window.history.pushState({}, "", `/${year}`)
    track("changed year", {
      year: currentYear
    })
  }

  return (
    <CurrentYearContext.Provider
      value={{
        currentYear,
        updateYear
      }}
    >
      {children}
    </CurrentYearContext.Provider>
  )
}