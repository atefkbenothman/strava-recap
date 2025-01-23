import { useEffect } from "react"
import { Analytics } from "@vercel/analytics/react"

import ThemeContextProvider from "./contexts/themeContext"
import StravaAuthContextProvider from "./contexts/stravaAuthContext"
import CurrentYearContextProvider from "./contexts/currentYearContext"
import StravaActivityContextProvider from "./contexts/stravaActivityContext"

import { useThemeContext } from "./hooks/useThemeContext"
import { useStravaAuthContext } from "./hooks/useStravaAuthContext"

import Unauthenticated from "./components/displays/unauthenticated"
import Dashboard from "./components/dashboard"


const Content = () => {
  const { isAuthenticated } = useStravaAuthContext()
  const { darkMode } = useThemeContext()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      document.documentElement.style.backgroundColor = "#121212"
      document.body.style.backgroundColor = "#121212"
    } else {
      document.documentElement.classList.remove("dark")
      document.documentElement.style.backgroundColor = "white"
      document.body.style.backgroundColor = "white"
    }
  }, [darkMode])

  if (!isAuthenticated) {
    return (
      <div>
        <Unauthenticated />
        <Analytics mode="production" />
      </div>
    )
  }

  return (
    <StravaActivityContextProvider>
      <Dashboard />
    </StravaActivityContextProvider>
  )
}

function App() {
  return (
    <CurrentYearContextProvider>
      <StravaAuthContextProvider>
        <ThemeContextProvider>
          <Content />
        </ThemeContextProvider>
      </StravaAuthContextProvider>
    </CurrentYearContextProvider>
  )
}

export default App