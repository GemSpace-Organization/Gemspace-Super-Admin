"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { InstitutionStatusBadge } from "@/components/dashboard/institutions/institution-status-badge"
import {
  useInstitutionDetailQuery,
  useInstitutionFeaturesQuery,
} from "@/features/super-admin/hooks/use-super-admin"

export function InstitutionDetailsModal({
  institutionId,
  open,
  onOpenChange,
  onOpenFeatures,
  onOpenMetadata,
  onOpenPlan,
  onOpenLimits,
  onOpenReject,
}: {
  institutionId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenFeatures?: () => void
  onOpenMetadata?: () => void
  onOpenPlan?: () => void
  onOpenLimits?: () => void
  onOpenReject?: () => void
}) {
  const detailQuery = useInstitutionDetailQuery(institutionId ?? undefined)
  const featuresQuery = useInstitutionFeaturesQuery(institutionId ?? undefined)

  const detail = detailQuery.data

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-auto max-h-[90vh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] gap-0 overflow-hidden p-0 md:w-[50vw] md:max-w-[50vw]">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle className="text-base">Institution Profile</DialogTitle>
          <DialogDescription>
            Operational profile, limits, and feature readiness for this
            institution.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[82vh] space-y-6 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {detailQuery.isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {detail && (
            <>
              <div className="grid gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold">{detail.name}</h3>
                  <InstitutionStatusBadge status={detail.status} />
                  <Badge variant="outline">{detail.planType}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {detail.adminEmail} • {detail.officialDomain} •{" "}
                  {detail.country}
                </p>
                <p className="text-xs text-muted-foreground">
                  Subdomain: {detail.subdomain} • Timezone: {detail.timezone}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Students</p>
                  <p className="text-lg font-semibold">
                    {detail.activeStudentCount} / {detail.studentLimit}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Lecturers</p>
                  <p className="text-lg font-semibold">
                    {detail.activeLecturerCount} / {detail.lecturerLimit}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">School Admins</p>
                  <p className="text-lg font-semibold">
                    {detail.activeSchoolAdminCount}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    Daily AI Limit
                  </p>
                  <p className="text-lg font-semibold">
                    {detail.dailyAiRequestLimit.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Action Controls
                </p>
                <div className="flex flex-wrap gap-2">
                  {onOpenMetadata && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onOpenMetadata}
                    >
                      Edit Metadata
                    </Button>
                  )}
                  {onOpenPlan && (
                    <Button size="sm" variant="outline" onClick={onOpenPlan}>
                      Edit Plan
                    </Button>
                  )}
                  {onOpenLimits && (
                    <Button size="sm" variant="outline" onClick={onOpenLimits}>
                      Edit Limits
                    </Button>
                  )}
                  {onOpenFeatures && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onOpenFeatures}
                    >
                      Edit Features
                    </Button>
                  )}
                  {onOpenReject &&
                    (detail.status === "PENDING_REVIEW" ||
                      detail.status === "REQUIRES_INFO") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={onOpenReject}
                      >
                        Set Reject Reason
                      </Button>
                    )}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold">Feature Flags</h4>
                {featuresQuery.isLoading ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(featuresQuery.data ?? []).map((feature) => (
                      <div
                        key={feature.featureKey}
                        className="flex flex-col gap-2 rounded-lg border p-2.5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="text-xs font-medium break-all">
                          {feature.featureKey}
                        </span>
                        <Badge
                          variant={
                            feature.effectiveEnabled ? "default" : "secondary"
                          }
                        >
                          {feature.effectiveEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
