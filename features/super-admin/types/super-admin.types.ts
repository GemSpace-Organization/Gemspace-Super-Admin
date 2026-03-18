export type InstitutionStatus =
  | "PENDING_REVIEW"
  | "ACTIVE"
  | "SUSPENDED"
  | "REQUIRES_INFO"
  | "REJECTED"

export type InstitutionPlanType = "FREE" | "PREMIUM" | "ENTERPRISE"

export type Institution = {
  id: string
  name: string
  normalizedName: string
  country: string
  adminEmail: string
  officialDomain: string
  planType: InstitutionPlanType
  subdomain: string
  status: InstitutionStatus
  inviteExpiresAt: string | null
  estimatedStudentCount: number
  studentLimit: number
  lecturerLimit: number
  dailyAiRequestLimit: number
  storageLimitGb: number
  logoUrl: string | null
  brandColors: Record<string, string> | null
  timezone: string
  verificationNotes: string | null
  createdBySuperAdminId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type InstitutionDetail = Institution & {
  activeStudentCount: number
  activeLecturerCount: number
  activeSchoolAdminCount: number
}

export type PaginatedInstitutionsResponse = {
  items: Institution[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type DashboardSummary = {
  totalInstitutions: number
  activeInstitutions: number
  pendingVerifications: number
  suspendedInstitutions: number
  totalStudents: number
  totalLecturers: number
  totalSchoolAdmins: number
  dailyActiveUsers: number
}

export type DateValuePoint = {
  date: string
  value: number
}

export type UserGrowthPoint = {
  date: string
  students: number
  lecturers: number
  schoolAdmins: number
}

export type FeatureAdoptionPoint = {
  featureKey: string
  enabledInstitutionCount: number
}

export type PlanDistributionPoint = {
  planType: InstitutionPlanType
  count: number
}

export type DashboardAlert = {
  severity: "info" | "warning" | "critical"
  code: string
  message: string
}

export type SuperAdminDashboardResponse = {
  summary: DashboardSummary
  growth: {
    institutions7d: DateValuePoint[]
    users7d: UserGrowthPoint[]
    approvals7d: DateValuePoint[]
    rejections7d: DateValuePoint[]
  }
  usage: {
    aiRequestsToday: number
    attendanceSessionsToday: number
    aiRequests7d: DateValuePoint[]
    attendanceSessions7d: DateValuePoint[]
    featureAdoption: FeatureAdoptionPoint[]
    topInstitutions: Array<{ id: string; name: string; value: number }>
  }
  operations: {
    apiRequestsToday: number
    errorsToday: number
    errorRate: number
    authFailuresToday: number
    activeSessions: number
    emailFailuresToday: number
    inviteAcceptanceRate: number
    pendingVerifications: number
  }
  commercial: {
    planDistribution: PlanDistributionPoint[]
    institutionsNearCapacity: Institution[]
    upgradeSignals: Institution[]
  }
  alerts: DashboardAlert[]
}

export type OnboardInstitutionRequest = {
  name: string
  country: string
  adminEmail: string
  officialDomain: string
  planType: InstitutionPlanType
  estimatedStudentCount: number
  timezone: string
  studentLimit: number
  lecturerLimit: number
  dailyAiRequestLimit: number
  storageLimitGb: number
}

export type UpdateInstitutionRequest = Partial<{
  name: string
  country: string
  adminEmail: string
  officialDomain: string
  planType: InstitutionPlanType
  estimatedStudentCount: number
  timezone: string
  verificationNotes: string
}>

export type RejectInstitutionRequest = {
  verificationNotes: string
}

export type RequestMoreInfoRequest = {
  verificationNotes: string
}

export type UpdateInstitutionPlanRequest = {
  planType: InstitutionPlanType
}

export type UpdateInstitutionLimitsRequest = {
  studentLimit: number
  lecturerLimit: number
  dailyAiRequestLimit: number
  storageLimitGb: number
}

export type InstitutionFeature = {
  featureKey: string
  enabled: boolean
  planIncluded: boolean
  effectiveEnabled: boolean
  overriddenBy: string | null
  updatedAt: string
}

export type UpdateInstitutionFeaturesRequest = {
  features: Array<{
    featureKey: string
    enabled: boolean
  }>
}

export type InstitutionListFilters = {
  page?: number
  limit?: number
  search?: string
  status?: InstitutionStatus
}

export type MonitoringDailyMetric = {
  id?: string
  date?: string
  day?: string
  requests?: number
  requestCount?: number
  errors?: number
  errorCount?: number
  activeSessions?: number
  sessions?: number
  [key: string]: unknown
}

export type MonitoringOverview = {
  uptime?: number | string
  uptimeSeconds?: number
  requestsToday?: number
  requestCountToday?: number
  errorsToday?: number
  errorCountToday?: number
  activeSessions?: number
  activeSessionCount?: number
  dailyMetrics?: MonitoringDailyMetric[]
  metrics?: MonitoringDailyMetric[]
  rows?: MonitoringDailyMetric[]
  [key: string]: unknown
}

export type SchoolAdmin = {
  id: string
  email: string
  institutionId: string
  institutionName?: string | null
  firstName?: string | null
  lastName?: string | null
  isActive: boolean
  createdAt?: string
  updatedAt?: string
  lastLoginAt?: string | null
}

export type CreateSchoolAdminRequest = {
  email: string
  institutionId: string
  firstName: string
  lastName: string
}

export type SchoolAdminListFilters = {
  page?: number
  limit?: number
  search?: string
  institutionId?: string
  isActive?: boolean
}

export type PaginatedSchoolAdminsResponse = {
  items: SchoolAdmin[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type AuditActivityEntry = {
  id?: string
  action?: string
  actorId?: string
  actorEmail?: string
  targetId?: string
  targetEmail?: string
  timestamp?: string
  createdAt?: string
  metadata?: Record<string, unknown>
  [key: string]: unknown
}

export type PlatformUserRole =
  | "SUPER_ADMIN"
  | "SCHOOL_ADMIN"
  | "LECTURER"
  | "STUDENT"

export type PlatformUser = {
  id: string
  firstName?: string | null
  lastName?: string | null
  name?: string | null
  email: string
  institutionId?: string | null
  institutionName?: string | null
  role: PlatformUserRole
  isActive: boolean
  createdAt?: string
  lastLoginAt?: string | null
}

export type PlatformUserFilters = {
  page?: number
  limit?: number
  name?: string
  email?: string
  institutionId?: string
  role?: PlatformUserRole
  isActive?: boolean
}

export type PaginatedPlatformUsersResponse = {
  items: PlatformUser[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type AnnouncementStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"

export type AnnouncementTargetType =
  | "ALL_PLATFORM_USERS"
  | "ALL_INSTITUTIONS"
  | "SPECIFIC_INSTITUTION"

export type Announcement = {
  id: string
  title: string
  body: string
  status: AnnouncementStatus
  targetType: AnnouncementTargetType
  institutionId?: string | null
  institutionName?: string | null
  startsAt?: string | null
  expiresAt?: string | null
  publishedAt?: string | null
  archivedAt?: string | null
  createdAt?: string
  updatedAt?: string
}

export type AnnouncementFilters = {
  page?: number
  limit?: number
  status?: AnnouncementStatus
  targetType?: AnnouncementTargetType
  institutionId?: string
  search?: string
}

export type CreateAnnouncementRequest = {
  title: string
  body: string
  targetType: AnnouncementTargetType
  institutionId?: string
  startsAt?: string
  expiresAt?: string
}

export type PaginatedAnnouncementsResponse = {
  items: Announcement[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type AuditLogTargetType =
  | "INSTITUTION"
  | "USER"
  | "FEATURE_FLAG"
  | "ANNOUNCEMENT"
  | "PLAN"
  | "LIMIT"
  | "AUTH"
  | "SYSTEM"

export type SuperAdminAuditLog = {
  id: string
  actorId?: string | null
  actorEmail?: string | null
  action: string
  institutionId?: string | null
  institutionName?: string | null
  targetType: AuditLogTargetType
  targetId?: string | null
  metadata?: Record<string, unknown> | null
  createdAt: string
}

export type AuditLogFilters = {
  page?: number
  limit?: number
  actorId?: string
  action?: string
  institutionId?: string
  targetType?: AuditLogTargetType
  dateFrom?: string
  dateTo?: string
}

export type PaginatedAuditLogsResponse = {
  items: SuperAdminAuditLog[]
  total: number
  page: number
  limit: number
  totalPages: number
}
