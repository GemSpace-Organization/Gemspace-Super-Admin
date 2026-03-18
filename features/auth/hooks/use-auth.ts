"use client"

import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authApi } from "@/features/auth/api/auth.api"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { ApiError } from "@/lib/api/http"
import type {
  ActivateRequest,
  LoginRequest,
  RefreshRequest,
} from "@/features/auth/types/auth.types"

export const authKeys = {
  me: ["auth", "me"] as const,
  profile: ["auth", "profile"] as const,
}

export function useLoginMutation() {
  const queryClient = useQueryClient()
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
    onSuccess: (result) => {
      setSession({
        user: result.data.user,
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token,
      })
      queryClient.setQueryData(authKeys.me, {
        authenticated: true,
        user: result.data.user,
      })
      queryClient.setQueryData(authKeys.profile, result.data.user)
    },
  })
}

export function useRefreshMutation() {
  const setTokens = useAuthStore((state) => state.setTokens)

  return useMutation({
    mutationFn: (payload: RefreshRequest) => authApi.refresh(payload),
    onSuccess: (result) => {
      setTokens({
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token,
      })
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) => state.accessToken)
  const clearSession = useAuthStore((state) => state.clearSession)

  return useMutation({
    mutationFn: () => authApi.logout(accessToken),
    onSettled: () => {
      clearSession()
      queryClient.removeQueries({ queryKey: authKeys.me })
      queryClient.removeQueries({ queryKey: authKeys.profile })
    },
  })
}

export function useMeQuery() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const setUser = useAuthStore((state) => state.setUser)
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated)

  const query = useQuery({
    queryKey: authKeys.me,
    queryFn: () => authApi.me(accessToken as string),
    enabled: Boolean(accessToken),
    select: (result) => result.data.user,
    staleTime: 30_000,
    retry: false,
    refetchOnWindowFocus: false,
    meta: { requiresAuth: true },
  })

  useEffect(() => {
    if (query.data) {
      setUser(query.data)
      setAuthenticated(true)
    }
  }, [query.data, setAuthenticated, setUser])

  return query
}

export function useProfileQuery() {
  const accessToken = useAuthStore((state) => state.accessToken)

  return useQuery({
    queryKey: authKeys.profile,
    queryFn: () => authApi.profile(accessToken as string),
    enabled: Boolean(accessToken),
    select: (result) => result.data,
    staleTime: 60_000,
    retry: false,
  })
}

export function useActivateMutation() {
  return useMutation({
    mutationFn: (payload: ActivateRequest) => authApi.activate(payload),
  })
}

export function useAuthBootstrap() {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) => state.accessToken)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const clearSession = useAuthStore((state) => state.clearSession)
  const meQuery = useMeQuery()
  const { mutateAsync: refresh, isPending: isRefreshing } = useRefreshMutation()

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      return
    }

    if (!(meQuery.error instanceof ApiError)) {
      return
    }

    if (meQuery.error.status !== 401) {
      return
    }

    if (isRefreshing) {
      return
    }

    void refresh({ refresh_token: refreshToken })
      .then(() => {
        void queryClient.invalidateQueries({ queryKey: authKeys.me })
        void queryClient.invalidateQueries({ queryKey: authKeys.profile })
      })
      .catch(() => {
        clearSession()
      })
  }, [
    accessToken,
    clearSession,
    isRefreshing,
    meQuery.error,
    queryClient,
    refresh,
    refreshToken,
  ])

  return meQuery
}
