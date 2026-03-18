"use client"

import { useMemo, useState } from "react"
import { MegaphoneIcon, Loader2Icon } from "lucide-react"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/http"
import {
  useAnnouncementsQuery,
  useArchiveAnnouncementMutation,
  useCreateAnnouncementMutation,
  useInstitutionsQuery,
  usePublishAnnouncementMutation,
} from "@/features/super-admin/hooks/use-super-admin"
import type {
  Announcement,
  AnnouncementStatus,
  AnnouncementTargetType,
} from "@/features/super-admin/types/super-admin.types"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CreateAnnouncementModal } from "@/components/dashboard/announcements/modals/create-announcement-modal"
import { AnnouncementDetailModal } from "@/components/dashboard/announcements/modals/announcement-detail-modal"
import { ArchiveAnnouncementModal } from "@/components/dashboard/announcements/modals/archive-announcement-modal"
import { AnnouncementsTable } from "@/components/dashboard/announcements/tables/announcements-table"

type StatusFilter = AnnouncementStatus | "ALL"
type TargetFilter = AnnouncementTargetType | "ALL"

const statusOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: "All statuses", value: "ALL" },
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Archived", value: "ARCHIVED" },
]

const targetOptions: Array<{ label: string; value: TargetFilter }> = [
  { label: "All targets", value: "ALL" },
  { label: "All Platform Users", value: "ALL_PLATFORM_USERS" },
  { label: "All Institutions", value: "ALL_INSTITUTIONS" },
  { label: "Specific Institution", value: "SPECIFIC_INSTITUTION" },
]

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) return error.message
  return fallback
}

export function AnnouncementsView() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<StatusFilter>("ALL")
  const [targetType, setTargetType] = useState<TargetFilter>("ALL")
  const [institutionId, setInstitutionId] = useState("")

  const [createOpen, setCreateOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [archiveCandidate, setArchiveCandidate] = useState<Announcement | null>(
    null
  )

  const [actionError, setActionError] = useState<string | null>(null)
  const [activeActionToken, setActiveActionToken] = useState<string | null>(
    null
  )

  const filters = useMemo(
    () => ({
      page,
      limit: 20,
      search: search.trim() || undefined,
      status: status === "ALL" ? undefined : status,
      targetType: targetType === "ALL" ? undefined : targetType,
      institutionId:
        targetType === "SPECIFIC_INSTITUTION"
          ? institutionId || undefined
          : undefined,
    }),
    [institutionId, page, search, status, targetType]
  )

  const announcementsQuery = useAnnouncementsQuery(filters)
  const institutionsQuery = useInstitutionsQuery({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  })

  const createMutation = useCreateAnnouncementMutation()
  const publishMutation = usePublishAnnouncementMutation()
  const archiveMutation = useArchiveAnnouncementMutation()

  const items = announcementsQuery.data?.items ?? []
  const totalPages = Math.max(announcementsQuery.data?.totalPages ?? 1, 1)

  async function runAction(
    action: () => Promise<unknown>,
    successMessage: string,
    actionToken: string
  ) {
    setActionError(null)
    setActiveActionToken(actionToken)

    try {
      await action()
      toast.success(successMessage)
    } catch (error) {
      const message = getErrorMessage(error, "Action failed. Please retry.")
      setActionError(message)
      toast.error(message)
    } finally {
      setActiveActionToken(null)
    }
  }

  async function handleCreateAnnouncement(payload: {
    title: string
    body: string
    targetType: AnnouncementTargetType
    institutionId?: string
    startsAt?: string
    expiresAt?: string
  }) {
    setActionError(null)
    return createMutation.mutateAsync(payload)
  }

  function openArchiveModal(announcement: Announcement) {
    setArchiveCandidate(announcement)
    setArchiveOpen(true)
  }

  async function handleArchiveAnnouncement(announcementId: string) {
    await runAction(
      () => archiveMutation.mutateAsync(announcementId),
      "Announcement archived",
      `archive:${announcementId}`
    )
    setArchiveOpen(false)
    setArchiveCandidate(null)
    if (selectedId === announcementId) {
      setDetailOpen(false)
    }
  }

  return (
    <div className="space-y-6 py-4">
      <PageHeader
        badge={
          <>
            <MegaphoneIcon className="size-3.5 text-indigo" />
            Announcement Operations
          </>
        }
        title="Super Admin Announcements"
        description="Draft, publish, and archive platform-wide announcements with precise targeting and scheduling."
        infoTitle="How To Use This Page"
        infoContent="Create announcements as drafts first, filter by status or target, then click View to read complete content and run publish or archive actions safely."
        actions={
          <Button
            variant="indigo"
            className="w-full lg:w-auto"
            onClick={() => {
              setCreateOpen(true)
              setActionError(null)
            }}
          >
            Create Announcement
          </Button>
        }
      />

      <div className="space-y-3 rounded-xl border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_220px_auto_auto]">
          <Input
            placeholder="Search title or body"
            value={search}
            onChange={(event) => {
              setPage(1)
              setSearch(event.target.value)
            }}
            className="h-9"
          />

          <Select
            value={status}
            onValueChange={(value) => {
              setPage(1)
              setStatus(value as StatusFilter)
            }}
          >
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={targetType}
            onValueChange={(value) => {
              setPage(1)
              setTargetType(value as TargetFilter)
              if (value !== "SPECIFIC_INSTITUTION") {
                setInstitutionId("")
              }
            }}
          >
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Target" />
            </SelectTrigger>
            <SelectContent>
              {targetOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="h-9"
            disabled={announcementsQuery.isFetching}
            onClick={() => {
              void announcementsQuery.refetch()
            }}
          >
            {announcementsQuery.isFetching ? (
              <Loader2Icon className="size-3.5 animate-spin" />
            ) : null}
            Refresh
          </Button>

          <Button
            variant="outline"
            className="h-9"
            onClick={() => {
              setPage(1)
              setSearch("")
              setStatus("ALL")
              setTargetType("ALL")
              setInstitutionId("")
            }}
          >
            Clear
          </Button>
        </div>

        {targetType === "SPECIFIC_INSTITUTION" ? (
          <div className="grid gap-3 md:grid-cols-[200px_minmax(0,1fr)] md:items-center">
            <p className="text-xs font-medium text-muted-foreground">
              Specific Institution Filter
            </p>
            <Select
              value={institutionId || "ALL"}
              onValueChange={(value) => {
                setPage(1)
                setInstitutionId(value === "ALL" ? "" : value)
              }}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Institution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All institutions</SelectItem>
                {(institutionsQuery.data?.items ?? []).map((institution) => (
                  <SelectItem key={institution.id} value={institution.id}>
                    {institution.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>

      {actionError ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {actionError}
        </p>
      ) : null}

      <AnnouncementsTable
        items={items}
        page={page}
        isLoading={announcementsQuery.isLoading}
        isFetching={announcementsQuery.isFetching}
        activeActionToken={activeActionToken}
        onView={(announcementId) => {
          setSelectedId(announcementId)
          setDetailOpen(true)
        }}
        onPublish={(announcementId) => {
          void runAction(
            () => publishMutation.mutateAsync(announcementId),
            "Announcement published",
            `publish:${announcementId}`
          )
        }}
        onArchive={(announcement) => openArchiveModal(announcement)}
      />

      <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Page {announcementsQuery.data?.page ?? page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7"
            disabled={page <= 1 || announcementsQuery.isFetching}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7"
            disabled={page >= totalPages || announcementsQuery.isFetching}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <CreateAnnouncementModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        isPending={createMutation.isPending}
        institutions={institutionsQuery.data?.items ?? []}
        onCreate={handleCreateAnnouncement}
      />

      <AnnouncementDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        announcementId={selectedId}
        activeActionToken={activeActionToken}
        onPublish={(id) => {
          void runAction(
            () => publishMutation.mutateAsync(id),
            "Announcement published",
            `publish:${id}`
          )
        }}
        onRequestArchive={(announcement) => openArchiveModal(announcement)}
      />

      <ArchiveAnnouncementModal
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        announcement={archiveCandidate}
        isPending={Boolean(activeActionToken)}
        onConfirm={(announcementId) => {
          void handleArchiveAnnouncement(announcementId)
        }}
      />
    </div>
  )
}
