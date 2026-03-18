import { apiRequest } from "@/lib/api/http"
import type {
  Announcement,
  AnnouncementFilters,
  AuditLogFilters,
  AuditActivityEntry,
  CreateAnnouncementRequest,
  CreateSchoolAdminRequest,
  InstitutionDetail,
  InstitutionFeature,
  InstitutionListFilters,
  MonitoringOverview,
  PaginatedAnnouncementsResponse,
  PaginatedAuditLogsResponse,
  OnboardInstitutionRequest,
  PaginatedPlatformUsersResponse,
  PaginatedSchoolAdminsResponse,
  PlatformUserFilters,
  PaginatedInstitutionsResponse,
  RejectInstitutionRequest,
  RequestMoreInfoRequest,
  SchoolAdmin,
  SchoolAdminListFilters,
  SuperAdminDashboardResponse,
  UpdateInstitutionFeaturesRequest,
  UpdateInstitutionLimitsRequest,
  UpdateInstitutionPlanRequest,
  UpdateInstitutionRequest,
} from "@/features/super-admin/types/super-admin.types"

function toQueryString(filters: InstitutionListFilters = {}) {
  const params = new URLSearchParams()

  if (filters.page) params.set("page", String(filters.page))
  if (filters.limit) params.set("limit", String(filters.limit))
  if (filters.search) params.set("search", filters.search)
  if (filters.status) params.set("status", filters.status)

  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

function toSchoolAdminQueryString(filters: SchoolAdminListFilters = {}) {
  const params = new URLSearchParams()

  if (filters.page) params.set("page", String(filters.page))
  if (filters.limit) params.set("limit", String(filters.limit))
  if (filters.search) params.set("search", filters.search)
  if (filters.institutionId) params.set("institutionId", filters.institutionId)
  if (typeof filters.isActive === "boolean") {
    params.set("isActive", String(filters.isActive))
  }

  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

function toUsersQueryString(filters: PlatformUserFilters = {}) {
  const params = new URLSearchParams()

  if (filters.page) params.set("page", String(filters.page))
  if (filters.limit) params.set("limit", String(filters.limit))
  if (filters.name) params.set("name", filters.name)
  if (filters.email) params.set("email", filters.email)
  if (filters.institutionId) params.set("institutionId", filters.institutionId)
  if (filters.role) params.set("role", filters.role)
  if (typeof filters.isActive === "boolean") {
    params.set("isActive", String(filters.isActive))
  }

  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

function toAnnouncementsQueryString(filters: AnnouncementFilters = {}) {
  const params = new URLSearchParams()

  if (filters.page) params.set("page", String(filters.page))
  if (filters.limit) params.set("limit", String(filters.limit))
  if (filters.status) params.set("status", filters.status)
  if (filters.targetType) params.set("targetType", filters.targetType)
  if (filters.institutionId) params.set("institutionId", filters.institutionId)
  if (filters.search) params.set("search", filters.search)

  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

function toAuditLogsQueryString(filters: AuditLogFilters = {}) {
  const params = new URLSearchParams()

  if (filters.page) params.set("page", String(filters.page))
  if (filters.limit) params.set("limit", String(filters.limit))
  if (filters.actorId) params.set("actorId", filters.actorId)
  if (filters.action) params.set("action", filters.action)
  if (filters.institutionId) params.set("institutionId", filters.institutionId)
  if (filters.targetType) params.set("targetType", filters.targetType)
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom)
  if (filters.dateTo) params.set("dateTo", filters.dateTo)

  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

export const superAdminApi = {
  getMonitoringOverview: (accessToken: string) =>
    apiRequest<MonitoringOverview>("/api/v1/super-admin/monitoring", {
      method: "GET",
      accessToken,
    }),

  getDashboardOverview: (accessToken: string) =>
    apiRequest<SuperAdminDashboardResponse>("/api/v1/super-admin/dashboard", {
      method: "GET",
      accessToken,
    }),

  createAnnouncement: (
    accessToken: string,
    payload: CreateAnnouncementRequest
  ) =>
    apiRequest<Announcement>("/api/v1/super-admin/announcements", {
      method: "POST",
      accessToken,
      body: payload,
    }),

  listAnnouncements: (accessToken: string, filters: AnnouncementFilters = {}) =>
    apiRequest<PaginatedAnnouncementsResponse>(
      `/api/v1/super-admin/announcements${toAnnouncementsQueryString(filters)}`,
      {
        method: "GET",
        accessToken,
      }
    ),

  getAnnouncement: (accessToken: string, id: string) =>
    apiRequest<Announcement>(`/api/v1/super-admin/announcements/${id}`, {
      method: "GET",
      accessToken,
    }),

  publishAnnouncement: (accessToken: string, id: string) =>
    apiRequest<Announcement>(
      `/api/v1/super-admin/announcements/${id}/publish`,
      {
        method: "PATCH",
        accessToken,
      }
    ),

  archiveAnnouncement: (accessToken: string, id: string) =>
    apiRequest<Announcement>(
      `/api/v1/super-admin/announcements/${id}/archive`,
      {
        method: "PATCH",
        accessToken,
      }
    ),

  listAuditLogs: (accessToken: string, filters: AuditLogFilters = {}) =>
    apiRequest<PaginatedAuditLogsResponse>(
      `/api/v1/super-admin/audit-logs${toAuditLogsQueryString(filters)}`,
      {
        method: "GET",
        accessToken,
      }
    ),

  createSchoolAdmin: (accessToken: string, payload: CreateSchoolAdminRequest) =>
    apiRequest<SchoolAdmin>("/api/v1/super-admin/school-admins", {
      method: "POST",
      accessToken,
      body: payload,
    }),

  listSchoolAdmins: (
    accessToken: string,
    filters: SchoolAdminListFilters = {}
  ) =>
    apiRequest<PaginatedSchoolAdminsResponse>(
      `/api/v1/super-admin/school-admins${toSchoolAdminQueryString(filters)}`,
      {
        method: "GET",
        accessToken,
      }
    ),

  getSchoolAdmin: (accessToken: string, id: string) =>
    apiRequest<SchoolAdmin>(`/api/v1/super-admin/school-admins/${id}`, {
      method: "GET",
      accessToken,
    }),

  activateSchoolAdmin: (accessToken: string, id: string) =>
    apiRequest<SchoolAdmin>(
      `/api/v1/super-admin/school-admins/${id}/activate`,
      {
        method: "PATCH",
        accessToken,
      }
    ),

  deactivateSchoolAdmin: (accessToken: string, id: string) =>
    apiRequest<SchoolAdmin>(
      `/api/v1/super-admin/school-admins/${id}/deactivate`,
      {
        method: "PATCH",
        accessToken,
      }
    ),

  resetSchoolAdminCredentials: (accessToken: string, id: string) =>
    apiRequest<{ message?: string }>(
      `/api/v1/super-admin/school-admins/${id}/reset-credentials`,
      {
        method: "POST",
        accessToken,
      }
    ),

  getSchoolAdminActivity: (accessToken: string, id: string) =>
    apiRequest<AuditActivityEntry[]>(
      `/api/v1/super-admin/school-admins/${id}/activity`,
      {
        method: "GET",
        accessToken,
      }
    ),

  listPlatformUsers: (accessToken: string, filters: PlatformUserFilters = {}) =>
    apiRequest<PaginatedPlatformUsersResponse>(
      `/api/v1/super-admin/users${toUsersQueryString(filters)}`,
      {
        method: "GET",
        accessToken,
      }
    ),

  activatePlatformUser: (accessToken: string, id: string) =>
    apiRequest<{ message?: string }>(
      `/api/v1/super-admin/users/${id}/activate`,
      {
        method: "PATCH",
        accessToken,
      }
    ),

  suspendPlatformUser: (accessToken: string, id: string) =>
    apiRequest<{ message?: string }>(
      `/api/v1/super-admin/users/${id}/suspend`,
      {
        method: "PATCH",
        accessToken,
      }
    ),

  resetPlatformUserAccount: (accessToken: string, id: string) =>
    apiRequest<{ message?: string }>(
      `/api/v1/super-admin/users/${id}/reset-account`,
      {
        method: "POST",
        accessToken,
      }
    ),

  getPlatformUserActivity: (accessToken: string, id: string) =>
    apiRequest<AuditActivityEntry[]>(
      `/api/v1/super-admin/users/${id}/activity`,
      {
        method: "GET",
        accessToken,
      }
    ),

  onboardInstitution: (
    accessToken: string,
    payload: OnboardInstitutionRequest
  ) =>
    apiRequest<InstitutionDetail>("/api/v1/super-admin/institutions/onboard", {
      method: "POST",
      accessToken,
      body: payload,
    }),

  listInstitutions: (
    accessToken: string,
    filters: InstitutionListFilters = {}
  ) =>
    apiRequest<PaginatedInstitutionsResponse>(
      `/api/v1/super-admin/institutions${toQueryString(filters)}`,
      {
        method: "GET",
        accessToken,
      }
    ),

  listVerificationQueue: (
    accessToken: string,
    filters: Omit<InstitutionListFilters, "status"> = {}
  ) =>
    apiRequest<PaginatedInstitutionsResponse>(
      `/api/v1/super-admin/institutions/verification-queue${toQueryString(filters)}`,
      {
        method: "GET",
        accessToken,
      }
    ),

  listDeletedInstitutions: (
    accessToken: string,
    filters: InstitutionListFilters = {}
  ) =>
    apiRequest<PaginatedInstitutionsResponse>(
      `/api/v1/super-admin/institutions/deleted${toQueryString(filters)}`,
      {
        method: "GET",
        accessToken,
      }
    ),

  getInstitutionDetail: (accessToken: string, id: string) =>
    apiRequest<InstitutionDetail>(`/api/v1/super-admin/institutions/${id}`, {
      method: "GET",
      accessToken,
    }),

  updateInstitution: (
    accessToken: string,
    id: string,
    payload: UpdateInstitutionRequest
  ) =>
    apiRequest<InstitutionDetail>(`/api/v1/super-admin/institutions/${id}`, {
      method: "PATCH",
      accessToken,
      body: payload,
    }),

  deleteInstitution: (accessToken: string, id: string) =>
    apiRequest<{ message?: string }>(`/api/v1/super-admin/institutions/${id}`, {
      method: "DELETE",
      accessToken,
    }),

  approveInstitution: (accessToken: string, id: string) =>
    apiRequest<InstitutionDetail>(
      `/api/v1/super-admin/institutions/${id}/approve`,
      {
        method: "PATCH",
        accessToken,
      }
    ),

  suspendInstitution: (accessToken: string, id: string) =>
    apiRequest<InstitutionDetail>(
      `/api/v1/super-admin/institutions/${id}/suspend`,
      {
        method: "PATCH",
        accessToken,
      }
    ),

  rejectInstitution: (
    accessToken: string,
    id: string,
    payload: RejectInstitutionRequest
  ) =>
    apiRequest<InstitutionDetail>(
      `/api/v1/super-admin/institutions/${id}/reject`,
      {
        method: "PATCH",
        accessToken,
        body: payload,
      }
    ),

  requestMoreInfo: (
    accessToken: string,
    id: string,
    payload: RequestMoreInfoRequest
  ) =>
    apiRequest<InstitutionDetail>(
      `/api/v1/super-admin/institutions/${id}/request-more-info`,
      {
        method: "PATCH",
        accessToken,
        body: payload,
      }
    ),

  updateInstitutionPlan: (
    accessToken: string,
    id: string,
    payload: UpdateInstitutionPlanRequest
  ) =>
    apiRequest<InstitutionDetail>(
      `/api/v1/super-admin/institutions/${id}/plan`,
      {
        method: "PATCH",
        accessToken,
        body: payload,
      }
    ),

  updateInstitutionLimits: (
    accessToken: string,
    id: string,
    payload: UpdateInstitutionLimitsRequest
  ) =>
    apiRequest<InstitutionDetail>(
      `/api/v1/super-admin/institutions/${id}/limits`,
      {
        method: "PATCH",
        accessToken,
        body: payload,
      }
    ),

  restoreInstitution: (accessToken: string, id: string) =>
    apiRequest<{ message?: string }>(
      `/api/v1/super-admin/institutions/${id}/restore`,
      {
        method: "PATCH",
        accessToken,
      }
    ),

  resendOnboardingInvite: (accessToken: string, id: string) =>
    apiRequest<{ message?: string }>(
      `/api/v1/super-admin/institutions/${id}/resend-onboarding-invite`,
      {
        method: "POST",
        accessToken,
      }
    ),

  getInstitutionFeatures: (accessToken: string, id: string) =>
    apiRequest<InstitutionFeature[]>(
      `/api/v1/super-admin/institutions/${id}/features`,
      {
        method: "GET",
        accessToken,
      }
    ),

  updateInstitutionFeatures: (
    accessToken: string,
    id: string,
    payload: UpdateInstitutionFeaturesRequest
  ) =>
    apiRequest<InstitutionFeature[]>(
      `/api/v1/super-admin/institutions/${id}/features`,
      {
        method: "PATCH",
        accessToken,
        body: payload,
      }
    ),
}
