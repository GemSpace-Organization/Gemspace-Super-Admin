export type AuthUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  institutionId: string | null
  isActive: boolean
  refreshTokenExpiresAt: string | null
  lastSeenAt: string | null
  createdAt: string
  updatedAt: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  user: AuthUser
  access_token: string
  refresh_token: string
}

export type RefreshRequest = {
  refresh_token: string
}

export type RefreshResponse = {
  access_token: string
  refresh_token: string
}

export type ActivateRequest = {
  token: string
  firstName: string
  lastName: string
  password: string
}

export type ActivateResponse = {
  user: AuthUser
  access_token?: string
  refresh_token?: string
}

export type MeResponse = {
  authenticated: boolean
  user: AuthUser
}
export type ProfileResponse = AuthUser

export type LogoutResponse = {
  message?: string
}
