import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthUser } from "@/features/auth/types/auth.types"

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  authenticated: boolean
  hydrated: boolean
  setSession: (payload: {
    user: AuthUser
    accessToken: string
    refreshToken: string
  }) => void
  setTokens: (payload: { accessToken: string; refreshToken: string }) => void
  setUser: (user: AuthUser | null) => void
  setAuthenticated: (authenticated: boolean) => void
  setHydrated: (hydrated: boolean) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      authenticated: false,
      hydrated: false,
      setSession: ({ user, accessToken, refreshToken }) =>
        set({ user, accessToken, refreshToken, authenticated: true }),
      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      setAuthenticated: (authenticated) => set({ authenticated }),
      setHydrated: (hydrated) => set({ hydrated }),
      clearSession: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          authenticated: false,
        }),
    }),
    {
      name: "gemspace-super-admin-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        authenticated: state.authenticated,
      }),
    }
  )
)
