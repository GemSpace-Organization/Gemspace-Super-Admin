export type ApiSuccess<T> = {
  success: true
  data: T
  requestId?: string
}

export type ApiFailure = {
  success: false
  error: {
    code: string
    message: string
    requestId?: string
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure

export class ApiError extends Error {
  code: string
  requestId?: string
  status: number

  constructor(
    message: string,
    code: string,
    status: number,
    requestId?: string
  ) {
    super(message)
    this.name = "ApiError"
    this.code = code
    this.status = status
    this.requestId = requestId
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  accessToken?: string | null
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.gemspace.live"

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiSuccess<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    credentials: "include",
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const json = (await response.json()) as ApiResponse<T>

  if (!response.ok || !json.success) {
    if ("error" in json) {
      throw new ApiError(
        json.error.message,
        json.error.code,
        response.status,
        json.error.requestId
      )
    }

    throw new ApiError("Request failed", "UNKNOWN_ERROR", response.status)
  }

  return json
}
