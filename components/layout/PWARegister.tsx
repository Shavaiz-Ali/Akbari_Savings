"use client"

import * as React from "react"

export function PWARegister() {
  React.useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("PWA Service Worker registered successfully with scope:", registration.scope)
        })
        .catch((error) => {
          console.error("PWA Service Worker registration failed:", error)
        })
    }
  }, [])

  return null
}
