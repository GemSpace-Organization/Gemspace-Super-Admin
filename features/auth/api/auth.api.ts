import { apiRequest } from "@/lib/api/http"
import type {
  ActivateRequest,
  ActivateResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  MeResponse,
  ProfileResponse,
  RefreshRequest,
  RefreshResponse,
} from "@/features/auth/types/auth.types"

export const authApi = {
  login: (payload: LoginRequest) =>
    apiRequest<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: payload,
    }),

  profile: (accessToken: string) =>
    apiRequest<ProfileResponse>("/api/v1/auth/profile", {
      method: "GET",
      accessToken,
    }),

  activate: (payload: ActivateRequest) =>
    apiRequest<ActivateResponse>("/api/v1/auth/activate", {
      method: "POST",
      body: payload,
    }),

  me: (accessToken: string) =>
    apiRequest<MeResponse>("/api/v1/auth/me", {
      method: "GET",
      accessToken,
    }),

  refresh: (payload: RefreshRequest) =>
    apiRequest<RefreshResponse>("/api/v1/auth/refresh", {
      method: "POST",
      body: payload,
    }),

  logout: (accessToken?: string | null) =>
    apiRequest<LogoutResponse>("/api/v1/auth/logout", {
      method: "POST",
      accessToken,
    }),
}
