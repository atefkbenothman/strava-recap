import { useEffect } from "react"
import { Analytics } from "@vercel/analytics/react"
import ThemeContextProvider from "./contexts/themeContext"
import { useThemeContext } from "./hooks/useThemeContext"
import StravaAuthContextProvider from "./contexts/stravaAuthContext"
import CurrentYearContextProvider from "./contexts/currentYearContext"
import { useStravaAuthContext } from "./hooks/useStravaAuthContext"
import Unauthenticated from "./components/displays/unauthenticated"
import StravaActivityContextProvider from "./contexts/stravaActivityContext"
import Dashboard from "./components/dashboard"


const Content = () => {
  const { isAuthenticated } = useStravaAuthContext()
  const { darkMode } = useThemeContext()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  if (!isAuthenticated) {
    return (
      <div>
        <Unauthenticated />
        <Analytics />
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