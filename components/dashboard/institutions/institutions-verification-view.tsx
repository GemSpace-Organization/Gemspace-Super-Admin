"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/http"
import {
  useApproveInstitutionMutation,
  useVerificationQueueQuery,
} from "@/features/super-admin/hooks/use-super-admin"
import type { Institution } from "@/features/super-admin/types/super-admin.types"
import { InstitutionStatusBadge } from "@/components/dashboard/institutions/institution-status-badge"
import { CreateSchoolAdminModal } from "@/components/dashboard/school-admins/create-school-admin-modal"
import {
  RequestMoreInfoModal,
  RejectInstitutionModal,
  UpdateInstitutionFeaturesModal,
  UpdateInstitutionLimitsModal,
  UpdateInstitutionMetadataModal,
  UpdateInstitutionPlanModal,
} from "@/components/dashboard/institutions/modals/institution-action-modals"
import { InstitutionDetailsModal } from "@/components/dashboard/institutions/modals/institution-details-modal"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Building2Icon,
  EyeIcon,
  Loader2Icon,
  CheckCircle2Icon,
  MoreHorizontalIcon,
  CircleXIcon,
  InfoIcon,
  Settings2Icon,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { TableGuide } from "@/components/shared/table-guide"

export function InstitutionsVerificationView() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Institution | null>(null)

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [metadataOpen, setMetadataOpen] = useState(false)
  const [planOpen, setPlanOpen] = useState(false)
  const [limitsOpen, setLimitsOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [requestInfoOpen, setRequestInfoOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [assignPromptOpen, setAssignPromptOpen] = useState(false)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [assignInstitution, setAssignInstitution] = useState<Pick<
    Institution,
    "id" | "name" | "subdomain"
  > | null>(null)

  const [actionError, setActionError] = useState<string | null>(null)
  const [activeActionToken, setActiveActionToken] = useState<string | null>(
    null
  )

  const params = useMemo(
    () => ({
      page,
      limit: 20,
      search: search.trim() || undefined,
    }),
    [page, search]
  )

  const query = useVerificationQueueQuery(params)
  const approveMutation = useApproveInstitutionMutation()

  const items = query.data?.items ?? []
  const totalPages = query.data?.totalPages ?? 1

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

  function isActionActive(actionToken: string) {
    return activeActionToken === actionToken
  }

  function handleApprovedInstitution(institution: Institution) {
    setAssignInstitution({
      id: institution.id,
      name: institution.name,
      subdomain: institution.subdomain,
    })
    setAssignPromptOpen(true)
  }

  return (
    <div className="space-y-6 py-4">
      <PageHeader
        badge={
          <>
            <Building2Icon className="size-3.5 text-indigo" />
            Verification Operations
          </>
        }
        title="Verification Queue"
        description="Review institutions awaiting verification decisions and execute approval workflows."
        infoTitle="How To Use This Page"
        infoContent="Review pending institutions, open View for context, then approve, request more information, or reject with notes. After approval, assign an institution admin to complete onboarding."
      />

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

        {actionError && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {actionError}
          </p>
        )}

        <div className="rounded-xl border bg-card">
          <TableGuide
            title="Verification Queue Table Guide"
            summary="Inspect each pending institution, then choose the right verification action."
            points={[
              "Use View to open complete institution details before decision.",
              "Approve moves institution to active state and unlocks admin assignment.",
              "Request Info and Reject should include clear review notes.",
              "Refresh after major actions to keep queue state current.",
            ]}
          />
          <Table className="min-w-225">
            <TableHeader>
              <TableRow>
                <TableHead className="w-14 text-center">#</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                    No institutions are waiting for verification.
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
                    <InstitutionStatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.planType}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        onClick={() => {
                          setSelected(item)
                          setDetailsOpen(true)
                        }}
                      >
                        <EyeIcon className="size-3.5" />
                        View
                      </Button>

                      <Button
                        size="sm"
                        variant="brand-mix"
                        className="h-7"
                        disabled={Boolean(activeActionToken)}
                        onClick={() =>
                          void runAction(
                            async () => {
                              await approveMutation.mutateAsync(item.id)
                              handleApprovedInstitution(item)
                            },
                            "Institution approved",
                            `approve:${item.id}`
                          )
                        }
                      >
                        {isActionActive(`approve:${item.id}`) ? (
                          <Loader2Icon className="size-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2Icon className="size-3.5" />
                        )}
                        Approve
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon-sm"
                            variant="outline"
                            disabled={Boolean(activeActionToken)}
                          >
                            <MoreHorizontalIcon className="size-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelected(item)
                              setRequestInfoOpen(true)
                            }}
                          >
                            <InfoIcon className="size-3.5" />
                            Request Info
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelected(item)
                              setRejectOpen(true)
                            }}
                          >
                            <CircleXIcon className="size-3.5" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelected(item)
                              setMetadataOpen(true)
                            }}
                          >
                            <Settings2Icon className="size-3.5" />
                            Edit Metadata
                          </DropdownMenuItem>
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

      <InstitutionDetailsModal
        institutionId={selected?.id ?? null}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onOpenMetadata={() => setMetadataOpen(true)}
        onOpenPlan={() => setPlanOpen(true)}
        onOpenLimits={() => setLimitsOpen(true)}
        onOpenFeatures={() => setFeaturesOpen(true)}
        onOpenReject={() => setRejectOpen(true)}
      />

      <UpdateInstitutionMetadataModal
        institution={selected}
        open={metadataOpen}
        onOpenChange={setMetadataOpen}
      />
      <UpdateInstitutionPlanModal
        institution={selected}
        open={planOpen}
        onOpenChange={setPlanOpen}
      />
      <UpdateInstitutionLimitsModal
        institution={selected}
        open={limitsOpen}
        onOpenChange={setLimitsOpen}
      />
      <UpdateInstitutionFeaturesModal
        institution={selected}
        open={featuresOpen}
        onOpenChange={setFeaturesOpen}
      />
      <RequestMoreInfoModal
        institution={selected}
        open={requestInfoOpen}
        onOpenChange={setRequestInfoOpen}
      />
      <RejectInstitutionModal
        institution={selected}
        open={rejectOpen}
        onOpenChange={setRejectOpen}
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
