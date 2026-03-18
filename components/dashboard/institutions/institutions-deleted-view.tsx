"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/http"
import {
  useDeletedInstitutionsQuery,
  useRestoreInstitutionMutation,
} from "@/features/super-admin/hooks/use-super-admin"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { RotateCcwIcon, Loader2Icon } from "lucide-react"

export function InstitutionsDeletedView() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [activeRestoreId, setActiveRestoreId] = useState<string | null>(null)

  const params = useMemo(
    () => ({
      page,
      limit: 20,
      search: search.trim() || undefined,
    }),
    [page, search]
  )

  const query = useDeletedInstitutionsQuery(params)
  const restoreMutation = useRestoreInstitutionMutation()

  const items = query.data?.items ?? []
  const totalPages = query.data?.totalPages ?? 1

  async function onRestore(id: string) {
    setActiveRestoreId(id)
    try {
      await restoreMutation.mutateAsync(id)
      toast.success("Institution restored")
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Unable to restore institution")
      }
    } finally {
      setActiveRestoreId(null)
    }
  }

  return (
    <div className="space-y-6 py-4">
      <div className="rounded-2xl border bg-gradient-to-br from-amber/10 via-background to-indigo/10 p-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Deleted Institutions
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Restore soft-deleted institutions while preserving full audit history.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search by institution, admin email, or subdomain"
            value={search}
            onChange={(e) => {
              setPage(1)
              setSearch(e.target.value)
            }}
            className="h-9"
          />
          <Button
            variant="outline"
            className="h-9"
            onClick={() => {
              void query.refetch()
            }}
            disabled={query.isFetching}
          >
            {query.isFetching ? (
              <Loader2Icon className="size-3.5 animate-spin" />
            ) : null}
            Refresh
          </Button>
        </div>

        <Table className="min-w-[820px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-14 text-center">#</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Status At Delete</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {query.isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {!query.isLoading && items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No deleted institutions found.
                </TableCell>
              </TableRow>
            )}

            {items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="text-center text-muted-foreground">
                  {(page - 1) * 20 + index + 1}
                </TableCell>
                <TableCell className="max-w-[320px] whitespace-normal">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.adminEmail} • {item.subdomain}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {item.status.replaceAll("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.planType}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7"
                    disabled={Boolean(activeRestoreId)}
                    onClick={() => {
                      void onRestore(item.id)
                    }}
                  >
                    {activeRestoreId === item.id ? (
                      <Loader2Icon className="size-3.5 animate-spin" />
                    ) : (
                      <RotateCcwIcon className="size-3.5" />
                    )}
                    Restore
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Page {query.data?.page ?? page} of {Math.max(totalPages, 1)}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7"
              disabled={page <= 1 || query.isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7"
              disabled={page >= totalPages || query.isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
