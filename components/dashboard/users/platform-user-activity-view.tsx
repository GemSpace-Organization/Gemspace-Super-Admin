"use client"

import Link from "next/link"
import { useMemo } from "react"
import { ArrowLeftIcon } from "lucide-react"
import { usePlatformUserActivityQuery } from "@/features/super-admin/hooks/use-super-admin"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function formatDate(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

type Props = {
  id: string
}

export function PlatformUserActivityView({ id }: Props) {
  const activityQuery = usePlatformUserActivityQuery(id)

  const activity = useMemo(() => activityQuery.data ?? [], [activityQuery.data])

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between rounded-2xl border bg-gradient-to-br from-orange-500/10 via-background to-sky-500/10 p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Platform User Activity
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Recent activity events where this platform user is actor or target.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/user-management">
            <ArrowLeftIcon className="size-4" />
            Back
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Activity Context</CardTitle>
          <CardDescription>User ID: {id}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="outline">Platform User</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>{activity.length} records available</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityQuery.isLoading &&
                Array.from({ length: 6 }).map((_, index) => (
                  <TableRow key={`user-activity-skeleton-${index}`}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-7 w-full" />
                    </TableCell>
                  </TableRow>
                ))}

              {!activityQuery.isLoading && activity.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-sm text-muted-foreground"
                  >
                    No activity records found for this user.
                  </TableCell>
                </TableRow>
              )}

              {activity.map((entry, index) => (
                <TableRow key={entry.id ?? `user-activity-${index}`}>
                  <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                    {formatDate(
                      (typeof entry.timestamp === "string" &&
                        entry.timestamp) ||
                        (typeof entry.createdAt === "string" &&
                          entry.createdAt) ||
                        null
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {entry.action || "Unknown"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {entry.actorEmail || entry.actorId || "-"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {entry.targetEmail || entry.targetId || "-"}
                  </TableCell>
                  <TableCell className="max-w-[380px] text-xs text-muted-foreground">
                    {entry.metadata ? JSON.stringify(entry.metadata) : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
