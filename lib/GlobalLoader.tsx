'use client'

import { useLoadingStore } from "./router/useLoadingStore"


export function GlobalLoader() {
  const isLoading = useLoadingStore((s) => s.isLoading)
  if (!isLoading) return null
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse z-[9999]" />
  )
}
