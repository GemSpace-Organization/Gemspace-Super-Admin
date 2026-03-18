"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ApiError } from "@/lib/api/http"
import { toast } from "sonner"
import {
  useActivateSchoolAdminMutation,
  useDeactivateSchoolAdminMutation,
  useResetSchoolAdminCredentialsMutation,
  useSchoolAdminsQuery,
} from "@/features/super-admin/hooks/use-super-admin"
import type {
  Institution,
  SchoolAdmin,
} from "@/features/super-admin/types/super-admin.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  KeyRoundIcon,
  Loader2Icon,
  ShieldCheckIcon,
  ShieldXIcon,
  Building2Icon,
  UserPlusIcon,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { TableGuide } from "@/components/shared/table-guide"
import { CreateSchoolAdminModal } from "@/components/dashboard/school-admins/create-school-admin-modal"

function formatDate(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

type ActiveFilter = "ALL" | "ACTIVE" | "INACTIVE"

export function SchoolAdminsView() {
  const [search, setSearch] = useState("")
  const [institutionId, setInstitutionId] = useState("")
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("ALL")
  const [page, setPage] = useState(1)

  const [createOpen, setCreateOpen] = useState(false)
  const [defaultInstitution, setDefaultInstitution] = useState<Pick<
    Institution,
    "id" | "name" | "subdomain"
  > | null>(null)

  const [actionError, setActionError] = useState<string | null>(null)
  const [activeActionToken, setActiveActionToken] = useState<string | null>(
    null
  )

  const filters = useMemo(
    () => ({
      page,
      limit: 20,
      search: search.trim() || undefined,
      institutionId: institutionId.trim() || undefined,
      isActive: activeFilter === "ALL" ? undefined : activeFilter === "ACTIVE",
    }),
    [activeFilter, institutionId, page, search]
  )

  const query = useSchoolAdminsQuery(filters)
  const activateMutation = useActivateSchoolAdminMutation()
  const deactivateMutation = useDeactivateSchoolAdminMutation()
  const resetMutation = useResetSchoolAdminCredentialsMutation()

  const items = query.data?.items ?? []
  const totalPages = Math.max(query.data?.totalPages ?? 1, 1)

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
      if (error instanceof ApiError) {
        setActionError(error.message)
        toast.error(error.message)
      } else {
        setActionError("Action failed. Please retry.")
        toast.error("Action failed. Please retry.")
      }
    } finally {
      setActiveActionToken(null)
    }
  }

  return (
    <div className="space-y-6 py-4">
      <PageHeader
        badge={
          <>
            <Building2Icon className="size-3.5 text-indigo" />
            Institution Administration Workspace
          </>
        }
        title="Institution Admins"
        description="Provision, activate, recover, and audit school administrator accounts."
        infoTitle="How To Use This Page"
        infoContent="Filter by name, email, institution, or status. Use actions to activate or deactivate admins, reset credentials, and open activity to inspect account history."
        actions={
          <Button
            variant="indigo"
            className="w-full lg:w-auto"
            onClick={() => {
              setDefaultInstitution(null)
              setCreateOpen(true)
              setActionError(null)
            }}
          >
            <UserPlusIcon className="size-4" />
            Create Institution Admin
          </Button>
        }
      />

      <div className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-[1fr_1fr_220px_auto]">
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(event) => {
            setPage(1)
            setSearch(event.target.value)
          }}
          className="h-9"
        />
        <Input
          placeholder="Filter by institution ID"
          value={institutionId}
          onChange={(event) => {
            setPage(1)
            setInstitutionId(event.target.value)
          }}
          className="h-9"
        />
        <Select
          value={activeFilter}
          onValueChange={(value) => {
            setPage(1)
            setActiveFilter(value as ActiveFilter)
          }}
        >
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="Activation status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="h-9"
          onClick={() => {
            void query.refetch()
          }}
          disabled={query.isFetching}
        >
          {query.isFetching ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : null}
          Refresh
        </Button>
      </div>

      {actionError && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {actionError}
        </p>
      )}

      <div className="rounded-xl border bg-card">
        <TableGuide
          title="Institution Admins Table Guide"
          summary="Find administrators quickly, verify status, and run account actions from the right column."
          points={[
            "Admin and Institution columns provide identity and assignment context.",
            "Status and Last Login help identify dormant or active accounts.",
            "Use Activity to audit behavior before account changes.",
            "Activate, Deactivate, and Reset are immediate account controls.",
          ]}
        />
        <Table className="min-w-245">
          <TableHeader>
            <TableRow>
              <TableHead className="w-14 text-center">#</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {query.isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={`school-admin-skeleton-${index}`}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {!query.isLoading && items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No institution admins found for this filter.
                </TableCell>
              </TableRow>
            )}

            {items.map((admin: SchoolAdmin, index) => (
              <TableRow key={admin.id}>
                <TableCell className="text-center text-muted-foreground">
                  {(page - 1) * 20 + index + 1}
                </TableCell>
                <TableCell className="max-w-70 whitespace-normal">
                  <p className="font-medium">
                    {[admin.firstName, admin.lastName]
                      .filter(Boolean)
                      .join(" ") || "Unnamed"}
                  </p>
                  <p className="text-xs text-muted-foreground">{admin.email}</p>
                </TableCell>
                <TableCell className="max-w-60 whitespace-normal">
                  <p className="font-medium">
                    {admin.institutionName || "Unknown Institution"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {admin.institutionId}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant={admin.isActive ? "secondary" : "outline"}>
                    {admin.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(admin.lastLoginAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button asChild variant="outline" size="sm" className="h-7">
                      <Link href={`/institution-admins/${admin.id}/activity`}>
                        Activity
                      </Link>
                    </Button>

                    {admin.isActive ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        disabled={Boolean(activeActionToken)}
                        onClick={() =>
                          void runAction(
                            () => deactivateMutation.mutateAsync(admin.id),
                            "Institution admin deactivated",
                            `deactivate:${admin.id}`
                          )
                        }
                      >
                        {activeActionToken === `deactivate:${admin.id}` ? (
                          <Loader2Icon className="size-3.5 animate-spin" />
                        ) : (
                          <ShieldXIcon className="size-3.5" />
                        )}
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="h-7"
                        disabled={Boolean(activeActionToken)}
                        onClick={() =>
                          void runAction(
                            () => activateMutation.mutateAsync(admin.id),
                            "Institution admin activated",
                            `activate:${admin.id}`
                          )
                        }
                      >
                        {activeActionToken === `activate:${admin.id}` ? (
                          <Loader2Icon className="size-3.5 animate-spin" />
                        ) : (
                          <ShieldCheckIcon className="size-3.5" />
                        )}
                        Activate
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7"
                      disabled={Boolean(activeActionToken)}
                      onClick={() =>
                        void runAction(
                          () => resetMutation.mutateAsync(admin.id),
                          "Credential reset email sent",
                          `reset:${admin.id}`
                        )
                      }
                    >
                      {activeActionToken === `reset:${admin.id}` ? (
                        <Loader2Icon className="size-3.5 animate-spin" />
                      ) : (
                        <KeyRoundIcon className="size-3.5" />
                      )}
                      Reset
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Page {query.data?.page ?? page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7"
            disabled={page <= 1 || query.isFetching}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7"
            disabled={page >= totalPages || query.isFetching}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <CreateSchoolAdminModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultInstitution={defaultInstitution}
      />
    </div>
  )
}
