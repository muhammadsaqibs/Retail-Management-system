import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// // ✅ Register Firebase Service Worker (FCM ke liye mandatory)
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/firebase-messaging-sw.js")
//       .then((registration) => { 
//         console.log("✅ Firebase Service Worker registered:", registration.scope);
//       })
//       .catch((error) => {
//         console.error("❌ Service Worker registration failed:", error);
//       });
//   });
// }

const queryclient = new QueryClient()
createRoot(document.getElementById('root')).render(
  <QueryClientProvider  client={queryclient}>
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
  </QueryClientProvider>
)
