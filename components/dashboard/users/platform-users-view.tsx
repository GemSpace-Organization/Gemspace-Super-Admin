"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ApiError } from "@/lib/api/http"
import { toast } from "sonner"
import {
  useActivatePlatformUserMutation,
  usePlatformUsersQuery,
  useResetPlatformUserAccountMutation,
  useSuspendPlatformUserMutation,
} from "@/features/super-admin/hooks/use-super-admin"
import type {
  PlatformUser,
  PlatformUserRole,
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
  Building2Icon,
  Loader2Icon,
  KeyRoundIcon,
  ShieldCheckIcon,
  ShieldXIcon,
  RefreshCwIcon,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { TableGuide } from "@/components/shared/table-guide"

const roleOptions: Array<{ label: string; value: PlatformUserRole | "ALL" }> = [
  { label: "All Roles", value: "ALL" },
  { label: "Super Admin", value: "SUPER_ADMIN" },
  { label: "Institution Admin", value: "SCHOOL_ADMIN" },
  { label: "Lecturer", value: "LECTURER" },
  { label: "Student", value: "STUDENT" },
]

type ActiveFilter = "ALL" | "ACTIVE" | "INACTIVE"

function formatDate(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function getDisplayName(user: PlatformUser) {
  const explicit = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim()
  if (explicit) return explicit
  if (user.name && user.name.trim()) return user.name
  return "Unnamed user"
}

export function PlatformUsersView() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [institutionId, setInstitutionId] = useState("")
  const [role, setRole] = useState<PlatformUserRole | "ALL">("ALL")
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("ALL")
  const [page, setPage] = useState(1)

  const [actionError, setActionError] = useState<string | null>(null)
  const [activeActionToken, setActiveActionToken] = useState<string | null>(
    null
  )

  const filters = useMemo(
    () => ({
      page,
      limit: 20,
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      institutionId: institutionId.trim() || undefined,
      role: role === "ALL" ? undefined : role,
      isActive: activeFilter === "ALL" ? undefined : activeFilter === "ACTIVE",
    }),
    [activeFilter, email, institutionId, name, page, role]
  )

  const query = usePlatformUsersQuery(filters)
  const activateMutation = useActivatePlatformUserMutation()
  const suspendMutation = useSuspendPlatformUserMutation()
  const resetMutation = useResetPlatformUserAccountMutation()

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
            Global Identity Operations
          </>
        }
        title="Global User Search"
        description="Search all platform users and manage account lifecycle controls."
        infoTitle="How To Use This Page"
        infoContent="Combine filters for role, institution, and account status to narrow results. Open Activity for history and use Suspend, Activate, or Reset based on investigation outcome."
        actions={
          <Button
            variant="outline"
            className="w-full lg:w-auto"
            onClick={() => {
              void query.refetch()
            }}
            disabled={query.isFetching}
          >
            <RefreshCwIcon
              className={query.isFetching ? "size-4 animate-spin" : "size-4"}
            />
            Refresh
          </Button>
        }
      />

      <div className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-2 xl:grid-cols-6">
        <Input
          placeholder="Filter by name"
          value={name}
          onChange={(event) => {
            setPage(1)
            setName(event.target.value)
          }}
          className="h-9"
        />
        <Input
          placeholder="Filter by email"
          value={email}
          onChange={(event) => {
            setPage(1)
            setEmail(event.target.value)
          }}
          className="h-9"
        />
        <Input
          placeholder="Institution ID"
          value={institutionId}
          onChange={(event) => {
            setPage(1)
            setInstitutionId(event.target.value)
          }}
          className="h-9"
        />

        <Select
          value={role}
          onValueChange={(value) => {
            setPage(1)
            setRole(value as PlatformUserRole | "ALL")
          }}
        >
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={activeFilter}
          onValueChange={(value) => {
            setPage(1)
            setActiveFilter(value as ActiveFilter)
          }}
        >
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {actionError && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {actionError}
        </p>
      )}

      <div className="rounded-xl border bg-card">
        <TableGuide
          title="Global Users Table Guide"
          summary="Use filters first, then inspect each user row and apply account actions with confidence."
          points={[
            "User and Role define identity and permission context.",
            "Institution shows tenancy scope for non-platform accounts.",
            "Activity gives event history for investigations.",
            "Suspend, Activate, and Reset should follow your policy workflow.",
          ]}
        />
        <Table className="min-w-270">
          <TableHeader>
            <TableRow>
              <TableHead className="w-14 text-center">#</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {query.isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={`users-skeleton-${index}`}>
                  <TableCell colSpan={7}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {!query.isLoading && items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No users found for the selected filters.
                </TableCell>
              </TableRow>
            )}

            {items.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="text-center text-muted-foreground">
                  {(page - 1) * 20 + index + 1}
                </TableCell>
                <TableCell className="max-w-65 whitespace-normal">
                  <p className="font-medium">{getDisplayName(user)}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell className="max-w-55 text-xs whitespace-normal text-muted-foreground">
                  <p>{user.institutionName || "Platform level"}</p>
                  <p>{user.institutionId || "-"}</p>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "secondary" : "outline"}>
                    {user.isActive ? "Active" : "Suspended"}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(user.lastLoginAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button asChild variant="outline" size="sm" className="h-7">
                      <Link href={`/user-management/${user.id}/activity`}>
                        Activity
                      </Link>
                    </Button>

                    {user.isActive ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        disabled={Boolean(activeActionToken)}
                        onClick={() =>
                          void runAction(
                            () => suspendMutation.mutateAsync(user.id),
                            "User suspended",
                            `suspend:${user.id}`
                          )
                        }
                      >
                        {activeActionToken === `suspend:${user.id}` ? (
                          <Loader2Icon className="size-3.5 animate-spin" />
                        ) : (
                          <ShieldXIcon className="size-3.5" />
                        )}
                        Suspend
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="h-7"
                        disabled={Boolean(activeActionToken)}
                        onClick={() =>
                          void runAction(
                            () => activateMutation.mutateAsync(user.id),
                            "User activated",
                            `activate:${user.id}`
                          )
                        }
                      >
                        {activeActionToken === `activate:${user.id}` ? (
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
                          () => resetMutation.mutateAsync(user.id),
                          "Reset account email sent",
                          `reset:${user.id}`
                        )
                      }
                    >
                      {activeActionToken === `reset:${user.id}` ? (
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
    </div>
  )
}
