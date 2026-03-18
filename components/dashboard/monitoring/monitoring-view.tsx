"use client"

import { useMemo } from "react"
import {
  ActivityIcon,
  AlertTriangleIcon,
  Building2Icon,
  Clock3Icon,
  RefreshCwIcon,
  ServerIcon,
} from "lucide-react"
import { useMonitoringOverviewQuery } from "@/features/super-admin/hooks/use-super-admin"
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
import { PageHeader } from "@/components/shared/page-header"
import { TableGuide } from "@/components/shared/table-guide"

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

function formatDateTime(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function formatUptime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds))
  const days = Math.floor(safeSeconds / 86_400)
  const hours = Math.floor((safeSeconds % 86_400) / 3_600)
  const minutes = Math.floor((safeSeconds % 3_600) / 60)

  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export function MonitoringView() {
  const query = useMonitoringOverviewQuery()

  const metrics = useMemo(() => {
    const data = query.data

    const uptimeSeconds = toNumber(data?.uptimeSeconds ?? data?.uptime)
    const requestsToday = toNumber(
      data?.requestsToday ?? data?.requestCountToday
    )
    const errorsToday = toNumber(data?.errorsToday ?? data?.errorCountToday)
    const activeSessions = toNumber(
      data?.activeSessionCount ?? data?.activeSessions
    )

    const rows = Array.isArray(data?.dailyMetrics)
      ? data.dailyMetrics
      : Array.isArray(data?.metrics)
        ? data.metrics
        : Array.isArray(data?.rows)
          ? data.rows
          : []

    const errorRate =
      requestsToday > 0 ? (errorsToday / requestsToday) * 100 : 0

    return {
      uptimeSeconds,
      requestsToday,
      errorsToday,
      activeSessions,
      rows,
      errorRate,
    }
  }, [query.data])

  return (
    <div className="space-y-6 py-4">
      <PageHeader
        badge={
          <>
            <Building2Icon className="size-3.5 text-indigo" />
            Platform Health Operations
          </>
        }
        title="Monitoring Overview"
        description="Real-time technical health and usage metrics across the platform."
        infoTitle="How To Use This Page"
        infoContent="Use this page for quick health checks: watch uptime, request volume, error rate, and daily metrics. Refresh when validating incidents or post-deployment stability."
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Uptime</CardDescription>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock3Icon className="size-4 text-muted-foreground" />
              {query.isLoading ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                formatUptime(metrics.uptimeSeconds)
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Requests Today</CardDescription>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ServerIcon className="size-4 text-muted-foreground" />
              {query.isLoading ? (
                <Skeleton className="h-5 w-16" />
              ) : (
                metrics.requestsToday.toLocaleString()
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Errors Today</CardDescription>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangleIcon className="size-4 text-amber-500" />
              {query.isLoading ? (
                <Skeleton className="h-5 w-16" />
              ) : (
                metrics.errorsToday.toLocaleString()
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Active Sessions</CardDescription>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ActivityIcon className="size-4 text-muted-foreground" />
              {query.isLoading ? (
                <Skeleton className="h-5 w-16" />
              ) : (
                metrics.activeSessions.toLocaleString()
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Metric Rows</CardTitle>
          <CardDescription>
            Error rate today:{" "}
            <Badge variant="outline">{metrics.errorRate.toFixed(2)}%</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TableGuide
            title="Daily Metrics Table Guide"
            summary="Compare traffic, errors, and active sessions day by day to identify health trends."
            points={[
              "Requests shows workload volume for each day.",
              "Errors helps track reliability and incident impact.",
              "Active Sessions indicates concurrent engagement.",
              "Use this table with Error Rate above for faster diagnosis.",
            ]}
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Requests</TableHead>
                <TableHead className="text-right">Errors</TableHead>
                <TableHead className="text-right">Active Sessions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.isLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`monitoring-skeleton-${index}`}>
                    <TableCell colSpan={4}>
                      <Skeleton className="h-7 w-full" />
                    </TableCell>
                  </TableRow>
                ))}

              {!query.isLoading && metrics.rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-sm text-muted-foreground"
                  >
                    No daily metric rows are available yet.
                  </TableCell>
                </TableRow>
              )}

              {metrics.rows.map((row, index) => {
                const label =
                  (typeof row.date === "string" && row.date) ||
                  (typeof row.day === "string" && row.day) ||
                  null

                const requests = toNumber(row.requests ?? row.requestCount)
                const errors = toNumber(row.errors ?? row.errorCount)
                const activeSessions = toNumber(
                  row.activeSessions ?? row.sessions
                )

                return (
                  <TableRow key={row.id ?? `${label ?? "day"}-${index}`}>
                    <TableCell>
                      {label ? formatDateTime(label) : `Row ${index + 1}`}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {requests.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {errors.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {activeSessions.toLocaleString()}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
