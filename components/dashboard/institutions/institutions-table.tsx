"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ApiError } from "@/lib/api/http"
import { toast } from "sonner"
import {
  useApproveInstitutionMutation,
  useDeleteInstitutionMutation,
  useDeletedInstitutionsQuery,
  useInstitutionsQuery,
  useRequestMoreInfoMutation,
  useResendOnboardingInviteMutation,
  useRestoreInstitutionMutation,
  useSuspendInstitutionMutation,
  useVerificationQueueQuery,
} from "@/features/super-admin/hooks/use-super-admin"
import type {
  Institution,
  InstitutionStatus,
} from "@/features/super-admin/types/super-admin.types"
import { InstitutionStatusBadge } from "@/components/dashboard/institutions/institution-status-badge"
import { CreateSchoolAdminModal } from "@/components/dashboard/school-admins/create-school-admin-modal"
import { TableGuide } from "@/components/shared/table-guide"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  EyeIcon,
  MailIcon,
  Loader2Icon,
  Settings2Icon,
  SlidersHorizontalIcon,
  ShieldCheckIcon,
  PauseCircleIcon,
  InfoIcon,
  CircleXIcon,
  Trash2Icon,
  RotateCcwIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import { InstitutionDetailsModal } from "@/components/dashboard/institutions/modals/institution-details-modal"
import {
  RequestMoreInfoModal,
  RejectInstitutionModal,
  UpdateInstitutionMetadataModal,
  UpdateInstitutionFeaturesModal,
  UpdateInstitutionLimitsModal,
  UpdateInstitutionPlanModal,
} from "@/components/dashboard/institutions/modals/institution-action-modals"

const statusFilters: Array<{
  label: string
  value: InstitutionStatus | "ALL"
}> = [
  { label: "All Statuses", value: "ALL" },
  { label: "Pending Review", value: "PENDING_REVIEW" },
  { label: "Active", value: "ACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Requires Info", value: "REQUIRES_INFO" },
  { label: "Rejected", value: "REJECTED" },
]

export function InstitutionsTable() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<InstitutionStatus | "ALL">("ALL")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Institution | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [metadataModalOpen, setMetadataModalOpen] = useState(false)
  const [planModalOpen, setPlanModalOpen] = useState(false)
  const [limitsModalOpen, setLimitsModalOpen] = useState(false)
  const [requestInfoModalOpen, setRequestInfoModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [featuresModalOpen, setFeaturesModalOpen] = useState(false)
  const [assignPromptOpen, setAssignPromptOpen] = useState(false)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [assignInstitution, setAssignInstitution] = useState<Pick<
    Institution,
    "id" | "name" | "subdomain"
  > | null>(null)
  const [isRunningAction, setIsRunningAction] = useState(false)
  const [activeActionToken, setActiveActionToken] = useState<string | null>(
    null
  )
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filters = useMemo(
    () => ({
      page,
      limit: 20,
      search: search.trim() || undefined,
      status: status === "ALL" ? undefined : status,
    }),
    [page, search, status]
  )

  const institutionsQuery = useInstitutionsQuery(filters)
  const deletedQuery = useDeletedInstitutionsQuery({
    page: 1,
    limit: 100,
    status: undefined,
  })
  const verificationQueueQuery = useVerificationQueueQuery({
    page: 1,
    limit: 1,
  })

  const approveMutation = useApproveInstitutionMutation()
  const suspendMutation = useSuspendInstitutionMutation()
  const deleteMutation = useDeleteInstitutionMutation()
  const restoreMutation = useRestoreInstitutionMutation()
  const resendInviteMutation = useResendOnboardingInviteMutation()

  const [actionError, setActionError] = useState<string | null>(null)

  const items = institutionsQuery.data?.items ?? []
  const deletedItems = deletedQuery.data?.items ?? []
  const totalPages = institutionsQuery.data?.totalPages ?? 1
  const pendingVerificationCount = verificationQueueQuery.data?.total ?? 0

  async function runAction(
    action: () => Promise<unknown>,
    successMessage?: string,
    actionToken?: string
  ) {
    setActionError(null)
    setIsRunningAction(true)
    setActiveActionToken(actionToken ?? null)
    try {
      await action()
      if (successMessage) {
        toast.success(successMessage)
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setActionError(error.message)
        toast.error(error.message)
      } else {
        setActionError("Action failed. Please retry.")
        toast.error("Action failed. Please retry.")
      }
    } finally {
      setIsRunningAction(false)
      setActiveActionToken(null)
    }
  }

  function isActionActive(actionToken: string) {
    return isRunningAction && activeActionToken === actionToken
  }

  function openAssignAdminFlow(institution: Institution) {
    setAssignInstitution({
      id: institution.id,
      name: institution.name,
      subdomain: institution.subdomain,
    })
    setAssignModalOpen(true)
  }

  function handleApprovedInstitution(institution: Institution) {
    setAssignInstitution({
      id: institution.id,
      name: institution.name,
      subdomain: institution.subdomain,
    })
    setAssignPromptOpen(true)
  }

  async function handleRefresh() {
    setActionError(null)
    setIsRefreshing(true)

    try {
      const result = await institutionsQuery.refetch()
      if (result.error) {
        throw result.error
      }
      toast.success("Institutions refreshed")
    } catch (error) {
      if (error instanceof ApiError) {
        setActionError(error.message)
        toast.error(error.message)
      } else {
        setActionError("Unable to refresh institutions")
        toast.error("Unable to refresh institutions")
      }
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
        <Input
          placeholder="Search by institution, admin email, or subdomain"
          value={search}
          onChange={(e) => {
            setPage(1)
            setSearch(e.target.value)
          }}
          className="h-9"
        />

        <Select
          value={status}
          onValueChange={(value) => {
            setPage(1)
            setStatus(value as InstitutionStatus | "ALL")
          }}
        >
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            {statusFilters.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="h-9 w-full md:w-auto">
            <Link href="/institutions/verification">
              Verification Queue
              {pendingVerificationCount > 0 ? (
                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">
                  {pendingVerificationCount}
                </Badge>
              ) : null}
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-9 w-full md:w-auto"
            onClick={() => {
              void handleRefresh()
            }}
            disabled={isRunningAction || isRefreshing}
          >
            {isRefreshing ? (
              <Loader2Icon className="size-3.5 animate-spin" />
            ) : null}
            Refresh
          </Button>
        </div>
      </div>

      {isRunningAction && (
        <p className="inline-flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <Loader2Icon className="size-3.5 animate-spin" />
          Processing institution action...
        </p>
      )}

      {actionError && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {actionError}
        </p>
      )}

      {pendingVerificationCount > 0 && (
        <div className="flex flex-col gap-2 rounded-lg border border-indigo/20 bg-indigo/5 px-3 py-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {pendingVerificationCount} institutions are waiting for verification
            actions. You can approve directly here or open the queue for focused
            review.
          </p>
          <Button asChild size="sm" variant="brand-mix">
            <Link href="/institutions/verification">
              Open Verification Queue
            </Link>
          </Button>
        </div>
      )}

      <div className="rounded-xl border bg-card">
        <TableGuide
          title="Institution Registry Guide"
          summary="Review institution status and limits, then use View or Actions to run lifecycle operations safely."
          points={[
            "Status and Plan show operational and commercial state.",
            "Limits provide current capacity configuration at a glance.",
            "Use View for profile details before sensitive changes.",
            "Approve, suspend, assign admin, and edit settings from action controls.",
          ]}
        />
        <Table className="min-w-220">
          <TableHeader>
            <TableRow>
              <TableHead className="w-14 text-center">#</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="text-right">Limits</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {institutionsQuery.isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {!institutionsQuery.isLoading && items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No institutions found for this filter.
                </TableCell>
              </TableRow>
            )}

            {items.map((institution, index) => (
              <TableRow key={institution.id}>
                <TableCell className="text-center font-medium text-muted-foreground">
                  {(page - 1) * 20 + index + 1}
                </TableCell>
                <TableCell className="max-w-70 whitespace-normal">
                  <div className="grid">
                    <span className="font-medium">{institution.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {institution.adminEmail} • {institution.subdomain}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <InstitutionStatusBadge status={institution.status} />
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{institution.planType}</Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {institution.studentLimit.toLocaleString()} students •{" "}
                  {institution.lecturerLimit.toLocaleString()} lecturers
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7"
                      disabled={isRunningAction}
                      onClick={() => {
                        setSelected(institution)
                        setDetailsOpen(true)
                      }}
                    >
                      <EyeIcon className="size-3.5" />
                      View
                    </Button>

                    {institution.status === "PENDING_REVIEW" && (
                      <Button
                        size="sm"
                        variant="brand-mix"
                        className="h-7"
                        disabled={Boolean(activeActionToken)}
                        onClick={() =>
                          void runAction(
                            async () => {
                              await approveMutation.mutateAsync(institution.id)
                              handleApprovedInstitution(institution)
                            },
                            "Institution approved",
                            `approve:${institution.id}`
                          )
                        }
                      >
                        {isActionActive(`approve:${institution.id}`) ? (
                          <Loader2Icon className="size-3.5 animate-spin" />
                        ) : (
                          <ShieldCheckIcon className="size-3.5" />
                        )}
                        Approve
                      </Button>
                    )}

                    {institution.status === "ACTIVE" && (
                      <Button
                        size="sm"
                        variant="brand-mix"
                        className="h-7"
                        disabled={Boolean(activeActionToken)}
                        onClick={() => openAssignAdminFlow(institution)}
                      >
                        Assign Admin
                      </Button>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          disabled={isRunningAction}
                        >
                          <MoreHorizontalIcon className="size-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel>
                          Institution Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(institution)
                            setMetadataModalOpen(true)
                          }}
                        >
                          <Settings2Icon className="size-3.5" />
                          Edit Metadata
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(institution)
                            setPlanModalOpen(true)
                          }}
                        >
                          <Settings2Icon className="size-3.5" />
                          Edit Plan
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(institution)
                            setLimitsModalOpen(true)
                          }}
                        >
                          <SlidersHorizontalIcon className="size-3.5" />
                          Edit Limits
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(institution)
                            setFeaturesModalOpen(true)
                          }}
                        >
                          <InfoIcon className="size-3.5" />
                          Edit Features
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            runAction(
                              () =>
                                resendInviteMutation.mutateAsync(
                                  institution.id
                                ),
                              "Onboarding invite resent",
                              `resend:${institution.id}`
                            )
                          }
                        >
                          {isActionActive(`resend:${institution.id}`) ? (
                            <Loader2Icon className="size-3.5 animate-spin" />
                          ) : (
                            <MailIcon className="size-3.5" />
                          )}
                          Resend Invite
                        </DropdownMenuItem>

                        {institution.status === "PENDING_REVIEW" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                runAction(
                                  async () => {
                                    await approveMutation.mutateAsync(
                                      institution.id
                                    )
                                    handleApprovedInstitution(institution)
                                  },
                                  "Institution approved",
                                  `approve:${institution.id}`
                                )
                              }
                            >
                              {isActionActive(`approve:${institution.id}`) ? (
                                <Loader2Icon className="size-3.5 animate-spin" />
                              ) : (
                                <ShieldCheckIcon className="size-3.5" />
                              )}
                              Approve
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setSelected(institution)
                                setRequestInfoModalOpen(true)
                              }}
                            >
                              <InfoIcon className="size-3.5" />
                              Request Info
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setSelected(institution)
                                setRejectModalOpen(true)
                              }}
                            >
                              <CircleXIcon className="size-3.5" />
                              Set Reject Reason
                            </DropdownMenuItem>
                          </>
                        )}

                        {institution.status === "ACTIVE" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => openAssignAdminFlow(institution)}
                            >
                              <ShieldCheckIcon className="size-3.5" />
                              Assign Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                runAction(
                                  () =>
                                    suspendMutation.mutateAsync(institution.id),
                                  "Institution suspended",
                                  `suspend:${institution.id}`
                                )
                              }
                            >
                              {isActionActive(`suspend:${institution.id}`) ? (
                                <Loader2Icon className="size-3.5 animate-spin" />
                              ) : (
                                <PauseCircleIcon className="size-3.5" />
                              )}
                              Suspend
                            </DropdownMenuItem>
                          </>
                        )}

                        {!institution.deletedAt && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() =>
                                runAction(
                                  () =>
                                    deleteMutation.mutateAsync(institution.id),
                                  "Institution deleted",
                                  `delete:${institution.id}`
                                )
                              }
                            >
                              {isActionActive(`delete:${institution.id}`) ? (
                                <Loader2Icon className="size-3.5 animate-spin" />
                              ) : (
                                <Trash2Icon className="size-3.5" />
                              )}
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Page {institutionsQuery.data?.page ?? page} of{" "}
          {Math.max(totalPages, 1)}
        </p>
        <div className="flex flex-wrap gap-2">
          {deletedItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-7"
              disabled={isRunningAction}
              onClick={() =>
                runAction(
                  () => restoreMutation.mutateAsync(deletedItems[0].id),
                  "Institution restored",
                  `restore:${deletedItems[0].id}`
                )
              }
            >
              {isActionActive(`restore:${deletedItems[0].id}`) ? (
                <Loader2Icon className="size-3.5 animate-spin" />
              ) : (
                <RotateCcwIcon className="size-3.5" />
              )}
              Restore Latest Deleted
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-7"
            disabled={
              page <= 1 || isRunningAction || institutionsQuery.isFetching
            }
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {institutionsQuery.isFetching ? (
              <Loader2Icon className="size-3.5 animate-spin" />
            ) : null}
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7"
            disabled={
              page >= totalPages ||
              isRunningAction ||
              institutionsQuery.isFetching
            }
            onClick={() => setPage((p) => p + 1)}
          >
            {institutionsQuery.isFetching ? (
              <Loader2Icon className="size-3.5 animate-spin" />
            ) : null}
            Next
          </Button>
        </div>
      </div>

      <InstitutionDetailsModal
        institutionId={selected?.id ?? null}
        open={detailsOpen}
        onOpenChange={(nextOpen) => {
          setDetailsOpen(nextOpen)
        }}
        onOpenFeatures={() => {
          setFeaturesModalOpen(true)
        }}
        onOpenMetadata={() => {
          setMetadataModalOpen(true)
        }}
        onOpenPlan={() => {
          setPlanModalOpen(true)
        }}
        onOpenLimits={() => {
          setLimitsModalOpen(true)
        }}
        onOpenReject={() => {
          setRejectModalOpen(true)
        }}
      />

      <UpdateInstitutionMetadataModal
        institution={selected}
        open={metadataModalOpen}
        onOpenChange={(nextOpen) => {
          setMetadataModalOpen(nextOpen)
          if (
            !nextOpen &&
            !detailsOpen &&
            !planModalOpen &&
            !limitsModalOpen &&
            !requestInfoModalOpen &&
            !featuresModalOpen &&
            !rejectModalOpen
          ) {
            setSelected(null)
          }
        }}
      />

      <UpdateInstitutionPlanModal
        institution={selected}
        open={planModalOpen}
        onOpenChange={(nextOpen) => {
          setPlanModalOpen(nextOpen)
          if (
            !nextOpen &&
            !detailsOpen &&
            !metadataModalOpen &&
            !limitsModalOpen &&
            !requestInfoModalOpen &&
            !featuresModalOpen &&
            !rejectModalOpen
          ) {
            setSelected(null)
          }
        }}
      />

      <UpdateInstitutionLimitsModal
        institution={selected}
        open={limitsModalOpen}
        onOpenChange={(nextOpen) => {
          setLimitsModalOpen(nextOpen)
          if (
            !nextOpen &&
            !detailsOpen &&
            !metadataModalOpen &&
            !planModalOpen &&
            !requestInfoModalOpen &&
            !featuresModalOpen &&
            !rejectModalOpen
          ) {
            setSelected(null)
          }
        }}
      />

      <RequestMoreInfoModal
        institution={selected}
        open={requestInfoModalOpen}
        onOpenChange={(nextOpen) => {
          setRequestInfoModalOpen(nextOpen)
          if (
            !nextOpen &&
            !detailsOpen &&
            !metadataModalOpen &&
            !planModalOpen &&
            !limitsModalOpen &&
            !featuresModalOpen &&
            !rejectModalOpen
          ) {
            setSelected(null)
          }
        }}
      />

      <UpdateInstitutionFeaturesModal
        institution={selected}
        open={featuresModalOpen}
        onOpenChange={(nextOpen) => {
          setFeaturesModalOpen(nextOpen)
          if (
            !nextOpen &&
            !detailsOpen &&
            !metadataModalOpen &&
            !planModalOpen &&
            !limitsModalOpen &&
            !requestInfoModalOpen &&
            !rejectModalOpen
          ) {
            setSelected(null)
          }
        }}
      />

      <RejectInstitutionModal
        institution={selected}
        open={rejectModalOpen}
        onOpenChange={(nextOpen) => {
          setRejectModalOpen(nextOpen)
          if (
            !nextOpen &&
            !detailsOpen &&
            !metadataModalOpen &&
            !planModalOpen &&
            !limitsModalOpen &&
            !requestInfoModalOpen &&
            !featuresModalOpen
          ) {
            setSelected(null)
          }
        }}
      />

      <Dialog open={assignPromptOpen} onOpenChange={setAssignPromptOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Institution Approved</DialogTitle>
            <DialogDescription>
              {assignInstitution
                ? `${assignInstitution.name} is now active. Do you want to assign an institution admin now?`
                : "Do you want to assign an institution admin now?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignPromptOpen(false)}
            >
              Later
            </Button>
            <Button
              variant="brand-mix"
              onClick={() => {
                setAssignPromptOpen(false)
                setAssignModalOpen(true)
              }}
            >
              Assign Admin Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateSchoolAdminModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        defaultInstitution={assignInstitution}
      />
    </div>
  )
}
