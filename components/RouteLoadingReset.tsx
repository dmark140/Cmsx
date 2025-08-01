// components/RouteLoadingReset.tsx
'use client'

import { useLoadingStore } from '@/lib/router/useLoadingStore'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function RouteLoadingReset() {
  const pathname = usePathname()
  const setLoading = useLoadingStore((s) => s.setLoading)

  useEffect(() => {
    // whenever the route changes, stop loading
    setLoading(false)
  }, [pathname])

  return null
}
