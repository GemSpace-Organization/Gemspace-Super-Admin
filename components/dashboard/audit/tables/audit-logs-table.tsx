"use client"

import { Fragment, useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import type { SuperAdminAuditLog } from "@/features/super-admin/types/super-admin.types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

function metadataPreview(entry: SuperAdminAuditLog) {
  if (!entry.metadata) return "-"

  const serialized = JSON.stringify(entry.metadata)
  if (serialized.length <= 120) return serialized
  return `${serialized.slice(0, 120)}...`
}

function metadataDetail(entry: SuperAdminAuditLog) {
  if (!entry.metadata) return "No metadata captured for this event."
  return JSON.stringify(entry.metadata, null, 2)
}

type AuditLogsTableProps = {
  items: SuperAdminAuditLog[]
  page: number
  isLoading: boolean
}

export function AuditLogsTable({
  items,
  page,
  isLoading,
}: AuditLogsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function toggleDetails(id: string) {
    setExpandedId((current) => (current === id ? null : id))
  }

  return (
    <div className="rounded-xl border bg-card">
      <TableGuide
        title="Audit Table Guide"
        summary="Use filters to narrow records, then click View to expand any row for complete event context."
        points={[
          "Timestamp and Action help you identify what happened and when.",
          "Actor and Institution identify who performed the action and where.",
          "Target shows the domain of change (user, institution, plan, auth, or system).",
          "Expanded details include target identifiers and full metadata payload.",
        ]}
      />
      <Table className="min-w-230">
        <TableHeader>
          <TableRow>
            <TableHead className="w-14 text-center">#</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Actor</TableHead>
            <TableHead>Institution</TableHead>
            <TableHead>Target</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={`audit-skeleton-${index}`}>
                <TableCell colSpan={7}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ))}

          {!isLoading && items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-8 text-center text-sm text-muted-foreground"
              >
                No audit log entries found for this filter.
              </TableCell>
            </TableRow>
          ) : null}

          {items.map((entry, index) => {
            const isExpanded = expandedId === entry.id

            return (
              <Fragment key={entry.id}>
                <TableRow>
                  <TableCell className="text-center text-muted-foreground">
                    {(page - 1) * 20 + index + 1}
                  </TableCell>
                  <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                    {formatDateTime(entry.createdAt)}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {entry.action}
                  </TableCell>
                  <TableCell className="max-w-55 text-xs whitespace-normal">
                    <p className="font-medium">
                      {entry.actorEmail || "System"}
                    </p>
                    <p className="text-muted-foreground">
                      {entry.actorId || "-"}
                    </p>
                  </TableCell>
                  <TableCell className="max-w-55 text-xs whitespace-normal text-muted-foreground">
                    <p>{entry.institutionName || "-"}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{entry.targetType}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7"
                      onClick={() => toggleDetails(entry.id)}
                    >
                      {isExpanded ? (
                        <ChevronUpIcon className="size-3.5" />
                      ) : (
                        <ChevronDownIcon className="size-3.5" />
                      )}
                      {isExpanded ? "Hide" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
                {isExpanded ? (
                  <TableRow>
                    <TableCell colSpan={7} className="bg-muted/30 py-3">
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-lg border bg-background p-3">
                          <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                            Target Details
                          </p>
                          <p className="mt-1.5 text-xs">
                            Type: {entry.targetType}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Target ID: {entry.targetId || "-"}
                          </p>
                        </div>
                        <div className="rounded-lg border bg-background p-3">
                          <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                            Institution Context
                          </p>
                          <p className="mt-1.5 text-xs">
                            {entry.institutionName || "No institution context"}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            ID: {entry.institutionId || "-"}
                          </p>
                        </div>
                        <div className="rounded-lg border bg-background p-3">
                          <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                            Metadata Preview
                          </p>
                          <p className="mt-1.5 line-clamp-3 text-xs text-muted-foreground">
                            {metadataPreview(entry)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 rounded-lg border bg-background p-3">
                        <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                          Full Metadata
                        </p>
                        <pre className="mt-1.5 overflow-x-auto text-xs whitespace-pre-wrap text-muted-foreground">
                          {metadataDetail(entry)}
                        </pre>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null}
              </Fragment>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
