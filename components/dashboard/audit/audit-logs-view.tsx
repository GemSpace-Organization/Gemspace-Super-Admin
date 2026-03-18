"use client"

import { useMemo, useState } from "react"
import { FileTextIcon } from "lucide-react"
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
import {
  useAuditLogsQuery,
  useInstitutionsQuery,
} from "@/features/super-admin/hooks/use-super-admin"
import type { AuditLogTargetType } from "@/features/super-admin/types/super-admin.types"
import { AuditLogsTable } from "@/components/dashboard/audit/tables/audit-logs-table"

const targetTypeOptions: Array<{
  label: string
  value: AuditLogTargetType | "ALL"
}> = [
  { label: "All target types", value: "ALL" },
  { label: "Institution", value: "INSTITUTION" },
  { label: "User", value: "USER" },
  { label: "Feature Flag", value: "FEATURE_FLAG" },
  { label: "Announcement", value: "ANNOUNCEMENT" },
  { label: "Plan", value: "PLAN" },
  { label: "Limit", value: "LIMIT" },
  { label: "Auth", value: "AUTH" },
  { label: "System", value: "SYSTEM" },
]

function formatDateTime(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

export function AuditLogsView() {
  const [page, setPage] = useState(1)

  const [actorIdInput, setActorIdInput] = useState("")
  const [actionInput, setActionInput] = useState("")
  const [institutionIdInput, setInstitutionIdInput] = useState("")
  const [targetTypeInput, setTargetTypeInput] = useState<
    AuditLogTargetType | "ALL"
  >("ALL")
  const [dateFromInput, setDateFromInput] = useState("")
  const [dateToInput, setDateToInput] = useState("")

  const [filters, setFilters] = useState({
    actorId: "",
    action: "",
    institutionId: "",
    targetType: "ALL" as AuditLogTargetType | "ALL",
    dateFrom: "",
    dateTo: "",
  })

  const queryFilters = useMemo(
    () => ({
      page,
      limit: 20,
      actorId: filters.actorId || undefined,
      action: filters.action || undefined,
      institutionId: filters.institutionId || undefined,
      targetType: filters.targetType === "ALL" ? undefined : filters.targetType,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
    }),
    [filters, page]
  )

  const logsQuery = useAuditLogsQuery(queryFilters)
  const institutionsQuery = useInstitutionsQuery({ page: 1, limit: 100 })

  const items = logsQuery.data?.items ?? []
  const totalPages = Math.max(logsQuery.data?.totalPages ?? 1, 1)

  const dateRangeInvalid =
    Boolean(dateFromInput) &&
    Boolean(dateToInput) &&
    new Date(dateFromInput).getTime() > new Date(dateToInput).getTime()

  return (
    <div className="space-y-6 py-4">
      <PageHeader
        badge={
          <>
            <FileTextIcon className="size-3.5 text-indigo" />
            Operational Audit Trail
          </>
        }
        title="Super Admin Audit Logs"
        description="Search and review super admin operational activity across institutions, users, auth, and system events."
        infoTitle="How To Use This Page"
        infoContent="Apply one or more filters, then click View on any row to open its full event details. Use the expanded panel for target context and complete metadata."
      />

      <div className="space-y-4 rounded-xl border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input
            placeholder="Actor ID"
            value={actorIdInput}
            onChange={(event) => setActorIdInput(event.target.value)}
            className="h-9"
          />
          <Input
            placeholder="Action"
            value={actionInput}
            onChange={(event) => setActionInput(event.target.value)}
            className="h-9"
          />
          <Select
            value={institutionIdInput || "ALL"}
            onValueChange={(value) =>
              setInstitutionIdInput(value === "ALL" ? "" : value)
            }
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
          <Select
            value={targetTypeInput}
            onValueChange={(value) =>
              setTargetTypeInput(value as AuditLogTargetType | "ALL")
            }
          >
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Target type" />
            </SelectTrigger>
            <SelectContent>
              {targetTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="datetime-local"
            value={dateFromInput}
            onChange={(event) => setDateFromInput(event.target.value)}
            className="h-9"
          />
          <Input
            type="datetime-local"
            value={dateToInput}
            onChange={(event) => setDateToInput(event.target.value)}
            className="h-9"
          />

          <Button
            variant="indigo"
            className="h-9"
            disabled={dateRangeInvalid || logsQuery.isFetching}
            onClick={() => {
              setPage(1)
              setFilters({
                actorId: actorIdInput.trim(),
                action: actionInput.trim(),
                institutionId: institutionIdInput,
                targetType: targetTypeInput,
                dateFrom: dateFromInput
                  ? new Date(dateFromInput).toISOString()
                  : "",
                dateTo: dateToInput ? new Date(dateToInput).toISOString() : "",
              })
            }}
          >
            Apply Filters
          </Button>

          <Button
            variant="outline"
            className="h-9"
            onClick={() => {
              setPage(1)
              setActorIdInput("")
              setActionInput("")
              setInstitutionIdInput("")
              setTargetTypeInput("ALL")
              setDateFromInput("")
              setDateToInput("")
              setFilters({
                actorId: "",
                action: "",
                institutionId: "",
                targetType: "ALL",
                dateFrom: "",
                dateTo: "",
              })
            }}
          >
            Clear
          </Button>
        </div>

        {dateRangeInvalid ? (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            Date range is invalid. "From" must be before "To".
          </p>
        ) : null}

        <AuditLogsTable
          items={items}
          page={page}
          isLoading={logsQuery.isLoading}
        />
      </div>

      <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Page {logsQuery.data?.page ?? page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7"
            disabled={page <= 1 || logsQuery.isFetching}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7"
            disabled={page >= totalPages || logsQuery.isFetching}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {(filters.dateFrom || filters.dateTo) && !dateRangeInvalid ? (
        <p className="text-xs text-muted-foreground">
          Active date filter: {formatDateTime(filters.dateFrom)} to{" "}
          {formatDateTime(filters.dateTo)}
        </p>
      ) : null}
    </div>
  )
}
