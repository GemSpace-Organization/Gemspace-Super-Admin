"use client"

import { EyeIcon, Loader2Icon } from "lucide-react"
import type {
  Announcement,
  AnnouncementStatus,
} from "@/features/super-admin/types/super-admin.types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { TableGuide } from "@/components/shared/table-guide"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function formatDateTime(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function getStatusBadgeVariant(
  status: AnnouncementStatus
): "outline" | "secondary" | "destructive" {
  if (status === "PUBLISHED") return "secondary"
  if (status === "ARCHIVED") return "outline"
  return "destructive"
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

type AnnouncementsTableProps = {
  items: Announcement[]
  page: number
  isLoading: boolean
  isFetching: boolean
  activeActionToken: string | null
  onView: (announcementId: string) => void
  onPublish: (announcementId: string) => void
  onArchive: (announcement: Announcement) => void
}

export function AnnouncementsTable({
  items,
  page,
  isLoading,
  isFetching,
  activeActionToken,
  onView,
  onPublish,
  onArchive,
}: AnnouncementsTableProps) {
  return (
    <div className="rounded-xl border bg-card">
      <TableGuide
        title="Announcements Table Guide"
        summary="This table intentionally shows concise rows. Click View to read full announcement details before publishing or archiving."
        points={[
          "Title is the quick identifier for each message.",
          "Target Scope shows who receives the announcement.",
          "Status indicates if the announcement is draft, published, or archived.",
          "Use View to inspect complete content and timeline before actions.",
        ]}
      />
      <Table className="min-w-215">
        <TableHeader>
          <TableRow>
            <TableHead className="w-14 text-center">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Target Scope</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={`announcement-skeleton-${index}`}>
                <TableCell colSpan={6}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ))}

          {!isLoading && items.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-8 text-center text-sm text-muted-foreground"
              >
                No announcements found for this filter.
              </TableCell>
            </TableRow>
          )}

          {items.map((announcement, index) => (
            <TableRow key={announcement.id}>
              <TableCell className="text-center text-muted-foreground">
                {(page - 1) * 20 + index + 1}
              </TableCell>
              <TableCell className="max-w-75 whitespace-normal">
                <p className="font-medium">{announcement.title}</p>
              </TableCell>
              <TableCell className="max-w-55 whitespace-normal">
                <p className="text-xs">{getScopeSummary(announcement)}</p>
                <p className="text-xs text-muted-foreground">
                  {getTargetLabel(announcement.targetType)}
                </p>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(announcement.status)}>
                  {announcement.status}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDateTime(
                  announcement.updatedAt ?? announcement.createdAt
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7"
                    onClick={() => onView(announcement.id)}
                  >
                    <EyeIcon className="size-3.5" />
                    View
                  </Button>

                  {announcement.status === "DRAFT" ? (
                    <Button
                      variant="indigo"
                      size="sm"
                      className="h-7"
                      disabled={Boolean(activeActionToken) || isFetching}
                      onClick={() => onPublish(announcement.id)}
                    >
                      {activeActionToken === `publish:${announcement.id}` ? (
                        <Loader2Icon className="size-3.5 animate-spin" />
                      ) : null}
                      Publish
                    </Button>
                  ) : null}

                  {announcement.status === "PUBLISHED" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7"
                      disabled={Boolean(activeActionToken) || isFetching}
                      onClick={() => onArchive(announcement)}
                    >
                      {activeActionToken === `archive:${announcement.id}` ? (
                        <Loader2Icon className="size-3.5 animate-spin" />
                      ) : null}
                      Archive
                    </Button>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
