"use client"

import { Loader2Icon } from "lucide-react"
import type { Announcement } from "@/features/super-admin/types/super-admin.types"
import { useAnnouncementDetailQuery } from "@/features/super-admin/hooks/use-super-admin"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

function formatDateTime(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function getTargetLabel(targetType: Announcement["targetType"]) {
  switch (targetType) {
    case "ALL_PLATFORM_USERS":
      return "All Platform Users"
    case "ALL_INSTITUTIONS":
      return "All Institutions"
    case "SPECIFIC_INSTITUTION":
      return "Specific Institution"
    default:
      return targetType
  }
}

function getScopeSummary(announcement: Announcement) {
  if (
    announcement.targetType === "SPECIFIC_INSTITUTION" &&
    announcement.institutionName
  ) {
    return announcement.institutionName
  }

  if (
    announcement.targetType === "SPECIFIC_INSTITUTION" &&
    announcement.institutionId
  ) {
    return `Institution ${announcement.institutionId}`
  }

  return getTargetLabel(announcement.targetType)
}

function getStatusBadgeVariant(
  status: Announcement["status"]
): "outline" | "secondary" | "destructive" {
  if (status === "PUBLISHED") return "secondary"
  if (status === "ARCHIVED") return "outline"
  return "destructive"
}

type AnnouncementDetailModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  announcementId: string | null
  activeActionToken: string | null
  onPublish: (id: string) => void
  onRequestArchive: (announcement: Announcement) => void
}

export function AnnouncementDetailModal({
  open,
  onOpenChange,
  announcementId,
  activeActionToken,
  onPublish,
  onRequestArchive,
}: AnnouncementDetailModalProps) {
  const detailQuery = useAnnouncementDetailQuery(announcementId ?? undefined)
  const announcement = detailQuery.data

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-auto max-h-[90vh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] overflow-hidden sm:max-w-2xl">
        <div className="max-h-[82vh] space-y-4 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Announcement Detail</DialogTitle>
            <DialogDescription>
              Review full announcement content and lifecycle state.
            </DialogDescription>
          </DialogHeader>

          {detailQuery.isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : announcement ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="text-base font-semibold">{announcement.title}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Body</p>
                <p className="text-sm whitespace-pre-wrap">
                  {announcement.body}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={getStatusBadgeVariant(announcement.status)}>
                    {announcement.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target</p>
                  <p className="text-sm">{getScopeSummary(announcement)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Starts At</p>
                  <p className="text-sm">
                    {formatDateTime(announcement.startsAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expires At</p>
                  <p className="text-sm">
                    {formatDateTime(announcement.expiresAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Published At</p>
                  <p className="text-sm">
                    {formatDateTime(announcement.publishedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Archived At</p>
                  <p className="text-sm">
                    {formatDateTime(announcement.archivedAt)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Unable to load this announcement.
            </p>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>

            {announcement?.status === "DRAFT" && announcementId ? (
              <Button
                variant="indigo"
                disabled={Boolean(activeActionToken)}
                onClick={() => onPublish(announcementId)}
              >
                {activeActionToken === `publish:${announcementId}` ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : null}
                Publish
              </Button>
            ) : null}

            {announcement?.status === "PUBLISHED" ? (
              <Button
                variant="outline"
                disabled={Boolean(activeActionToken)}
                onClick={() => onRequestArchive(announcement)}
              >
                Archive
              </Button>
            ) : null}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
