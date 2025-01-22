import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import './index.css'
import App from './App.tsx'
import * as Sentry from "@sentry/browser"

Sentry.init({
  environment: process.env.NODE_ENV,
  dsn: import.meta.env.VITE_GLITCH_TIP_DSN,
  enableTracing: false,
})

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
