"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { superAdminApi } from "@/features/super-admin/api/super-admin.api"
import { useAuthStore } from "@/features/auth/store/auth.store"
import type {
  AnnouncementFilters,
  AuditLogFilters,
  CreateAnnouncementRequest,
  CreateSchoolAdminRequest,
  InstitutionListFilters,
  OnboardInstitutionRequest,
  PlatformUserFilters,
  RejectInstitutionRequest,
  RequestMoreInfoRequest,
  SchoolAdminListFilters,
  UpdateInstitutionRequest,
  UpdateInstitutionFeaturesRequest,
  UpdateInstitutionLimitsRequest,
  UpdateInstitutionPlanRequest,
} from "@/features/super-admin/types/super-admin.types"

export const superAdminKeys = {
  monitoring: ["super-admin", "monitoring"] as const,
  dashboard: ["super-admin", "dashboard"] as const,
  announcements: (filters: AnnouncementFilters) =>
    ["super-admin", "announcements", filters] as const,
  announcementDetail: (id: string) =>
    ["super-admin", "announcements", "detail", id] as const,
  auditLogs: (filters: AuditLogFilters) =>
    ["super-admin", "audit-logs", filters] as const,
  institutions: (filters: InstitutionListFilters) =>
    ["super-admin", "institutions", filters] as const,
  verificationQueue: (filters: Omit<InstitutionListFilters, "status">) =>
    ["super-admin", "institutions", "verification-queue", filters] as const,
  deletedInstitutions: (filters: InstitutionListFilters) =>
    ["super-admin", "institutions", "deleted", filters] as const,
  institutionDetail: (id: string) =>
    ["super-admin", "institutions", "detail", id] as const,
  institutionFeatures: (id: string) =>
    ["super-admin", "institutions", "features", id] as const,
  schoolAdmins: (filters: SchoolAdminListFilters) =>
    ["super-admin", "school-admins", filters] as const,
  schoolAdminDetail: (id: string) =>
    ["super-admin", "school-admins", "detail", id] as const,
  schoolAdminActivity: (id: string) =>
    ["super-admin", "school-admins", "activity", id] as const,
  users: (filters: PlatformUserFilters) =>
    ["super-admin", "users", filters] as const,
  userActivity: (id: string) =>
    ["super-admin", "users", "activity", id] as const,
}

function useAccessToken() {
  return useAuthStore((state) => state.accessToken)
}

export function useSuperAdminDashboardQuery() {
  const accessToken = useAccessToken()

  return useQuery({
    queryKey: superAdminKeys.dashboard,
    queryFn: () => superAdminApi.getDashboardOverview(accessToken as string),
    enabled: Boolean(accessToken),
    select: (result) => result.data,
    staleTime: 30_000,
  })
}

export function useMonitoringOverviewQuery() {
  const accessToken = useAccessToken()

  return useQuery({
    queryKey: superAdminKeys.monitoring,
    queryFn: () => superAdminApi.getMonitoringOverview(accessToken as string),
    enabled: Boolean(accessToken),
    select: (result) => result.data,
    staleTime: 30_000,
  })
}

export function useAnnouncementsQuery(filters: AnnouncementFilters) {
  const accessToken = useAccessToken()

  return useQuery({
    queryKey: superAdminKeys.announcements(filters),
    queryFn: () =>
      superAdminApi.listAnnouncements(accessToken as string, filters),
    enabled: Boolean(accessToken),
    select: (result) => result.data,
  })
}

export function useAnnouncementDetailQuery(id?: string) {
  const accessToken = useAccessToken()

  return useQuery({
    queryKey: superAdminKeys.announcementDetail(id ?? ""),
    queryFn: () =>
      superAdminApi.getAnnouncement(accessToken as string, id as string),
    enabled: Boolean(accessToken && id),
    select: (result) => result.data,
  })
}

export function useCreateAnnouncementMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: (payload: CreateAnnouncementRequest) =>
      superAdminApi.createAnnouncement(accessToken as string, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "announcements"],
      })
    },
  })
}

export function usePublishAnnouncementMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: (id: string) =>
      superAdminApi.publishAnnouncement(accessToken as string, id),
    onSuccess: (_, id) => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "announcements"],
      })
      void queryClient.invalidateQueries({
        queryKey: superAdminKeys.announcementDetail(id),
      })
    },
  })
}

export function useArchiveAnnouncementMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: (id: string) =>
      superAdminApi.archiveAnnouncement(accessToken as string, id),
    onSuccess: (_, id) => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "announcements"],
      })
      void queryClient.invalidateQueries({
        queryKey: superAdminKeys.announcementDetail(id),
      })
    },
  })
}

export function useAuditLogsQuery(filters: AuditLogFilters) {
  const accessToken = useAccessToken()

  return useQuery({
    queryKey: superAdminKeys.auditLogs(filters),
    queryFn: () => superAdminApi.listAuditLogs(accessToken as string, filters),
    enabled: Boolean(accessToken),
    select: (result) => result.data,
  })
}

export function useInstitutionsQuery(filters: InstitutionListFilters) {
  const accessToken = useAccessToken()

  return useQuery({
    queryKey: superAdminKeys.institutions(filters),
    queryFn: () =>
      superAdminApi.listInstitutions(accessToken as string, filters),
    enabled: Boolean(accessToken),
    select: (result) => result.data,
  })
}

export function useVerificationQueueQuery(
  filters: Omit<InstitutionListFilters, "status">
) {
  const accessToken = useAccessToken()

  return useQuery({
    queryKey: superAdminKeys.verificationQueue(filters),
    queryFn: () =>
      superAdminApi.listVerificationQueue(accessToken as string, filters),
    enabled: Boolean(accessToken),
    select: (result) => result.data,
  })
}

export function useDeletedInstitutionsQuery(filters: InstitutionListFilters) {
  const accessToken = useAccessToken()

  return useQuery({
    queryKey: superAdminKeys.deletedInstitutions(filters),
    queryFn: () =>
      superAdminApi.listDeletedInstitutions(accessToken as string, filters),
    enabled: Boolean(accessToken),
    select: (result) => result.data,
  })
}

export function useInstitutionDetailQuery(id?: string) {
  const accessToken = useAccessToken()

  return useQuery({
    queryKey: superAdminKeys.institutionDetail(id ?? ""),
    queryFn: () =>
      superAdminApi.getInstitutionDetail(accessToken as string, id as string),
    enabled: Boolean(accessToken && id),
    select: (result) => result.data,
  })
}

export function useInstitutionFeaturesQuery(id?: string) {
  const accessToken = useAccessToken()

  return useQuery({
    queryKey: superAdminKeys.institutionFeatures(id ?? ""),
    queryFn: () =>
      superAdminApi.getInstitutionFeatures(accessToken as string, id as string),
    enabled: Boolean(accessToken && id),
    select: (result) => result.data,
  })
}

export function useOnboardInstitutionMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: (payload: OnboardInstitutionRequest) =>
      superAdminApi.onboardInstitution(accessToken as string, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "institutions"],
      })
      void queryClient.invalidateQueries({ queryKey: superAdminKeys.dashboard })
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "institutions", "verification-queue"],
      })
    },
  })
}

export function useApproveInstitutionMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: (id: string) =>
      superAdminApi.approveInstitution(accessToken as string, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "institutions"],
      })
      void queryClient.invalidateQueries({ queryKey: superAdminKeys.dashboard })
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "institutions", "verification-queue"],
      })
    },
  })
}

export function useSuspendInstitutionMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: (id: string) =>
      superAdminApi.suspendInstitution(accessToken as string, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "institutions"],
      })
      void queryClient.invalidateQueries({ queryKey: superAdminKeys.dashboard })
    },
  })
}

export function useRejectInstitutionMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: RejectInstitutionRequest
    }) => superAdminApi.rejectInstitution(accessToken as string, id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "institutions"],
      })
      void queryClient.invalidateQueries({ queryKey: superAdminKeys.dashboard })
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "institutions", "verification-queue"],
      })
    },
  })
}

export function useRequestMoreInfoMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: RequestMoreInfoRequest
    }) => superAdminApi.requestMoreInfo(accessToken as string, id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "institutions"],
      })
      void queryClient.invalidateQueries({ queryKey: superAdminKeys.dashboard })
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "institutions", "verification-queue"],
      })
    },
  })
}

export function useDeleteInstitutionMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: (id: string) =>
      superAdminApi.deleteInstitution(accessToken as string, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "institutions"],
      })
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "institutions", "deleted"],
      })
      void queryClient.invalidateQueries({ queryKey: superAdminKeys.dashboard })
    },
  })
}

export function useRestoreInstitutionMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: (id: string) =>
      superAdminApi.restoreInstitution(accessToken as string, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "institutions"],
      })
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "institutions", "deleted"],
      })
      void queryClient.invalidateQueries({ queryKey: superAdminKeys.dashboard })
    },
  })
}

export function useResendOnboardingInviteMutation() {
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: (id: string) =>
      superAdminApi.resendOnboardingInvite(accessToken as string, id),
  })
}

export function useUpdateInstitutionPlanMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateInstitutionPlanRequest
    }) =>
      superAdminApi.updateInstitutionPlan(accessToken as string, id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "institutions"],
      })
      void queryClient.invalidateQueries({ queryKey: superAdminKeys.dashboard })
    },
  })
}

export function useUpdateInstitutionLimitsMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateInstitutionLimitsRequest
    }) =>
      superAdminApi.updateInstitutionLimits(accessToken as string, id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "institutions"],
      })
      void queryClient.invalidateQueries({ queryKey: superAdminKeys.dashboard })
    },
  })
}

export function useUpdateInstitutionFeaturesMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateInstitutionFeaturesRequest
    }) =>
      superAdminApi.updateInstitutionFeatures(
        accessToken as string,
        id,
        payload
      ),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: superAdminKeys.institutionFeatures(variables.id),
      })
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "institutions"],
      })
    },
  })
}

export function useUpdateInstitutionMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateInstitutionRequest
    }) => superAdminApi.updateInstitution(accessToken as string, id, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "institutions"],
      })
      void queryClient.invalidateQueries({
        queryKey: superAdminKeys.institutionDetail(variables.id),
      })
      void queryClient.invalidateQueries({ queryKey: superAdminKeys.dashboard })
    },
  })
}

export function useSchoolAdminsQuery(filters: SchoolAdminListFilters) {
  const accessToken = useAccessToken()

  return useQuery({
    queryKey: superAdminKeys.schoolAdmins(filters),
    queryFn: () =>
      superAdminApi.listSchoolAdmins(accessToken as string, filters),
    enabled: Boolean(accessToken),
    select: (result) => result.data,
  })
}

export function useSchoolAdminDetailQuery(id?: string) {
  const accessToken = useAccessToken()

  return useQuery({
    queryKey: superAdminKeys.schoolAdminDetail(id ?? ""),
    queryFn: () =>
      superAdminApi.getSchoolAdmin(accessToken as string, id as string),
    enabled: Boolean(accessToken && id),
    select: (result) => result.data,
  })
}

export function useSchoolAdminActivityQuery(id?: string) {
  const accessToken = useAccessToken()

  return useQuery({
    queryKey: superAdminKeys.schoolAdminActivity(id ?? ""),
    queryFn: () =>
      superAdminApi.getSchoolAdminActivity(accessToken as string, id as string),
    enabled: Boolean(accessToken && id),
    select: (result) => result.data,
  })
}

export function useCreateSchoolAdminMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: (payload: CreateSchoolAdminRequest) =>
      superAdminApi.createSchoolAdmin(accessToken as string, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "school-admins"],
      })
      void queryClient.invalidateQueries({ queryKey: superAdminKeys.dashboard })
    },
  })
}

export function useActivateSchoolAdminMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: (id: string) =>
      superAdminApi.activateSchoolAdmin(accessToken as string, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "school-admins"],
      })
    },
  })
}

export function useDeactivateSchoolAdminMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: (id: string) =>
      superAdminApi.deactivateSchoolAdmin(accessToken as string, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "school-admins"],
      })
    },
  })
}

export function useResetSchoolAdminCredentialsMutation() {
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: (id: string) =>
      superAdminApi.resetSchoolAdminCredentials(accessToken as string, id),
  })
}

export function usePlatformUsersQuery(filters: PlatformUserFilters) {
  const accessToken = useAccessToken()

  return useQuery({
    queryKey: superAdminKeys.users(filters),
    queryFn: () =>
      superAdminApi.listPlatformUsers(accessToken as string, filters),
    enabled: Boolean(accessToken),
    select: (result) => result.data,
  })
}

export function usePlatformUserActivityQuery(id?: string) {
  const accessToken = useAccessToken()

  return useQuery({
    queryKey: superAdminKeys.userActivity(id ?? ""),
    queryFn: () =>
      superAdminApi.getPlatformUserActivity(
        accessToken as string,
        id as string
      ),
    enabled: Boolean(accessToken && id),
    select: (result) => result.data,
  })
}

export function useActivatePlatformUserMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: (id: string) =>
      superAdminApi.activatePlatformUser(accessToken as string, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["super-admin", "users"] })
    },
  })
}

export function useSuspendPlatformUserMutation() {
  const queryClient = useQueryClient()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: (id: string) =>
      superAdminApi.suspendPlatformUser(accessToken as string, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["super-admin", "users"] })
    },
  })
}

export function useResetPlatformUserAccountMutation() {
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: (id: string) =>
      superAdminApi.resetPlatformUserAccount(accessToken as string, id),
  })
}
