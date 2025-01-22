import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import './index.css'
import App from './App.tsx'
// import { H } from "highlight.run"


// Logging
// H.init("jgo9lnzg", {
//   serviceName: "fitness-recap",
//   environment: "development",
//   disableSessionRecording: true,
//   disableNetworkRecording: true,
//   disableBackgroundRecording: true,
//   tracingOrigins: false,
// })


const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
