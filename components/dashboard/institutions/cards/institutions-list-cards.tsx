"use client"

import { useMemo, useState } from "react"
import { Building2Icon, SearchIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { InstitutionDetailsModal } from "@/components/dashboard/institutions/modals/institution-details-modal"
import { useInstitutionsQuery } from "@/features/super-admin/hooks/use-super-admin"
import type {
  Institution,
  InstitutionStatus,
} from "@/features/super-admin/types/super-admin.types"

function StatusBadge({ status }: { status: InstitutionStatus }) {
  const className =
    status === "ACTIVE"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : status === "PENDING_REVIEW"
        ? "bg-amber/10 text-amber-foreground"
        : status === "SUSPENDED"
          ? "bg-destructive/10 text-destructive"
          : "bg-muted text-muted-foreground"

  return <Badge className={className}>{status.replaceAll("_", " ")}</Badge>
}

function InstitutionCard({
  item,
  onOpen,
}: {
  item: Institution
  onOpen: (id: string) => void
}) {
  return (
    <Card className="rounded-2xl border-border/70">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">
              {item.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {item.adminEmail}
            </p>
          </div>
          <StatusBadge status={item.status} />
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          <p className="truncate">{item.subdomain}.gemspace.live</p>
          <p className="truncate">{item.officialDomain}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Card className="rounded-2xl border-border/70 bg-muted/20 shadow-none">
            <CardContent className="p-2.5">
              <p className="text-[0.625rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Plan
              </p>
              <p className="mt-1 text-xs font-semibold">{item.planType}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/70 bg-muted/20 shadow-none">
            <CardContent className="p-2.5">
              <p className="text-[0.625rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Students
              </p>
              <p className="mt-1 text-xs font-semibold">
                {item.studentLimit.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-2xl"
          onClick={() => onOpen(item.id)}
        >
          Open Profile
        </Button>
      </CardContent>
    </Card>
  )
}

export function InstitutionsListCards({
  initialStatus = "ALL",
}: {
  initialStatus?: InstitutionStatus | "ALL"
}) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<InstitutionStatus | "ALL">(initialStatus)
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<
    string | null
  >(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const params = useMemo(
    () => ({
      page,
      limit: 12,
      search: search || undefined,
      status: status === "ALL" ? undefined : status,
    }),
    [page, search, status]
  )

  const query = useInstitutionsQuery(params)
  const items = query.data?.items ?? []
  const total = query.data?.total ?? 0
  const totalPages = query.data?.totalPages ?? 1

  return (
    <>
      <Card className="rounded-2xl border-border/70">
        <CardContent className="space-y-3 p-3 md:p-4">
          <div className="grid gap-2 md:grid-cols-[1fr_200px]">
            <div className="relative">
              <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="rounded-2xl pl-9"
                placeholder="Search institution, admin, or domain"
              />
            </div>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value as InstitutionStatus | "ALL")
                setPage(1)
              }}
            >
              <SelectTrigger className="rounded-2xl">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="REQUIRES_INFO">Requires Info</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {query.isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="rounded-2xl border-border/70">
                  <CardContent className="space-y-3 p-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : query.error ? (
            <Card className="rounded-2xl border-border/70 bg-muted/20 shadow-none">
              <CardContent className="flex min-h-40 flex-col items-center justify-center gap-2 p-4 text-center">
                <Building2Icon className="size-5 text-muted-foreground" />
                <p className="text-sm font-medium">
                  Unable to load institutions
                </p>
                <p className="text-xs text-muted-foreground">
                  Please retry in a moment.
                </p>
              </CardContent>
            </Card>
          ) : items.length === 0 ? (
            <Card className="rounded-2xl border-border/70 bg-muted/20 shadow-none">
              <CardContent className="flex min-h-40 flex-col items-center justify-center gap-2 p-4 text-center">
                <Building2Icon className="size-5 text-muted-foreground" />
                <p className="text-sm font-medium">No institutions found</p>
                <p className="text-xs text-muted-foreground">
                  Try adjusting your search or status filter.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <InstitutionCard
                  key={item.id}
                  item={item}
                  onOpen={(id) => {
                    setSelectedInstitutionId(id)
                    setDetailOpen(true)
                  }}
                />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2 text-xs md:flex-row md:items-center md:justify-between">
            <p className="text-muted-foreground">
              {total.toLocaleString()} institutions
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-2xl"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || query.isFetching}
              >
                Previous
              </Button>
              <Badge
                variant="outline"
                className="rounded-2xl border-border/70 px-2 py-1 text-[0.7rem]"
              >
                {page} / {Math.max(totalPages, 1)}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="rounded-2xl"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages || query.isFetching}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <InstitutionDetailsModal
        institutionId={selectedInstitutionId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  )
}
