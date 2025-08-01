// lib/store/useLoadingStore.ts
import { create } from 'zustand'

type LoadingState = {
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
}))
