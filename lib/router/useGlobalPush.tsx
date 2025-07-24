'use client'
import { useRouter } from 'next/navigation'
import { useLoadingStore } from './useLoadingStore'

export function useGlobalPush() {
  const router = useRouter()
  const setLoading = useLoadingStore((s) => s.setLoading)

  const push = async (path: string) => {
    setLoading(true)
    router.push(path)
  }

  return { push }
}
