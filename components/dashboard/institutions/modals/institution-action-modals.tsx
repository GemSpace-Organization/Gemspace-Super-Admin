"use client"

import { useEffect, useState } from "react"
import { ApiError } from "@/lib/api/http"
import {
  useInstitutionFeaturesQuery,
  useRequestMoreInfoMutation,
  useRejectInstitutionMutation,
  useUpdateInstitutionMutation,
  useUpdateInstitutionFeaturesMutation,
  useUpdateInstitutionLimitsMutation,
  useUpdateInstitutionPlanMutation,
} from "@/features/super-admin/hooks/use-super-admin"
import type {
  Institution,
  InstitutionFeature,
  InstitutionPlanType,
} from "@/features/super-admin/types/super-admin.types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"

function ErrorText({ message }: { message: string | null }) {
  if (!message) return null

  return (
    <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
      {message}
    </p>
  )
}

function getApiError(error: unknown, fallback: string) {
  if (error instanceof ApiError) return error.message
  return fallback
}

export function UpdateInstitutionMetadataModal({
  institution,
  open,
  onOpenChange,
}: {
  institution: Institution | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const updateMutation = useUpdateInstitutionMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    country: "",
    adminEmail: "",
    officialDomain: "",
    timezone: "",
    estimatedStudentCount: "0",
    verificationNotes: "",
  })

  useEffect(() => {
    if (!open || !institution) return

    setForm({
      name: institution.name,
      country: institution.country,
      adminEmail: institution.adminEmail,
      officialDomain: institution.officialDomain,
      timezone: institution.timezone,
      estimatedStudentCount: String(institution.estimatedStudentCount),
      verificationNotes: institution.verificationNotes ?? "",
    })
    setErrorMessage(null)
  }, [institution, open])

  function setField<K extends keyof typeof form>(
    field: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!institution) return

    try {
      await updateMutation.mutateAsync({
        id: institution.id,
        payload: {
          name: form.name,
          country: form.country,
          adminEmail: form.adminEmail,
          officialDomain: form.officialDomain,
          timezone: form.timezone,
          estimatedStudentCount: Number(form.estimatedStudentCount),
          verificationNotes: form.verificationNotes || undefined,
        },
      })
      toast.success("Institution metadata updated")
      onOpenChange(false)
    } catch (error) {
      const message = getApiError(error, "Unable to update institution")
      setErrorMessage(message)
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-auto max-h-[90vh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] overflow-hidden md:w-full md:max-w-2xl">
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="max-h-[82vh] space-y-4 overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Edit Institution Metadata</DialogTitle>
            <DialogDescription>
              Update core institution profile fields used across onboarding,
              verification, and communications.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="meta-name">Institution Name</Label>
              <Input
                id="meta-name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-country">Country</Label>
              <Input
                id="meta-country"
                value={form.country}
                onChange={(e) => setField("country", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-admin-email">Admin Email</Label>
              <Input
                id="meta-admin-email"
                type="email"
                value={form.adminEmail}
                onChange={(e) => setField("adminEmail", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-domain">Official Domain</Label>
              <Input
                id="meta-domain"
                value={form.officialDomain}
                onChange={(e) => setField("officialDomain", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-timezone">Timezone</Label>
              <Input
                id="meta-timezone"
                value={form.timezone}
                onChange={(e) => setField("timezone", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-estimated">Estimated Student Count</Label>
              <Input
                id="meta-estimated"
                type="number"
                min={0}
                value={form.estimatedStudentCount}
                onChange={(e) =>
                  setField("estimatedStudentCount", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="meta-notes">Verification Notes</Label>
              <Textarea
                id="meta-notes"
                value={form.verificationNotes}
                onChange={(e) => setField("verificationNotes", e.target.value)}
                placeholder="Add review note context for verification history"
              />
            </div>
          </div>

          <ErrorText message={errorMessage} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="brand-mix"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Metadata"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function RejectInstitutionModal({
  institution,
  open,
  onOpenChange,
}: {
  institution: Institution | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [verificationNotes, setVerificationNotes] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const rejectMutation = useRejectInstitutionMutation()

  useEffect(() => {
    if (!open) {
      setVerificationNotes("")
      setErrorMessage(null)
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!institution) return

    try {
      await rejectMutation.mutateAsync({
        id: institution.id,
        payload: { verificationNotes },
      })
      toast.success("Institution rejected")
      onOpenChange(false)
    } catch (error) {
      const message = getApiError(error, "Unable to reject institution")
      setErrorMessage(message)
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-auto max-h-[90vh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] overflow-hidden md:w-full md:max-w-xl">
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="max-h-[82vh] space-y-4 overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Reject Institution</DialogTitle>
            <DialogDescription>
              Add review notes that explain why this institution is rejected.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="reject-notes">Verification Notes</Label>
            <Textarea
              id="reject-notes"
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              placeholder="Missing accreditation documentation"
              required
            />
          </div>

          <ErrorText message={errorMessage} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive-solid"
              disabled={rejectMutation.isPending || !verificationNotes.trim()}
            >
              {rejectMutation.isPending ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Reject Institution"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function RequestMoreInfoModal({
  institution,
  open,
  onOpenChange,
}: {
  institution: Institution | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [verificationNotes, setVerificationNotes] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const requestInfoMutation = useRequestMoreInfoMutation()

  useEffect(() => {
    if (!open) {
      setVerificationNotes("")
      setErrorMessage(null)
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!institution) return

    try {
      await requestInfoMutation.mutateAsync({
        id: institution.id,
        payload: { verificationNotes },
      })
      toast.success("Institution moved to requires-info")
      onOpenChange(false)
    } catch (error) {
      const message = getApiError(error, "Unable to request more info")
      setErrorMessage(message)
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-auto max-h-[90vh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] overflow-hidden md:w-full md:max-w-xl">
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="max-h-[82vh] space-y-4 overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Request More Information</DialogTitle>
            <DialogDescription>
              Add verification follow-up notes and move this institution into
              REQUIRES_INFO.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="request-info-notes">Verification Notes</Label>
            <Textarea
              id="request-info-notes"
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              placeholder="Upload admission licence and proof of incorporation"
              required
            />
          </div>

          <ErrorText message={errorMessage} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="brand-mix"
              disabled={
                requestInfoMutation.isPending || !verificationNotes.trim()
              }
            >
              {requestInfoMutation.isPending ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Request Info"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function UpdateInstitutionPlanModal({
  institution,
  open,
  onOpenChange,
}: {
  institution: Institution | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [planType, setPlanType] = useState<InstitutionPlanType>("FREE")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const planMutation = useUpdateInstitutionPlanMutation()

  useEffect(() => {
    if (open && institution) {
      setPlanType(institution.planType)
      setErrorMessage(null)
    }
  }, [institution, open])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!institution) return

    try {
      await planMutation.mutateAsync({
        id: institution.id,
        payload: { planType },
      })
      toast.success("Plan updated")
      onOpenChange(false)
    } catch (error) {
      const message = getApiError(error, "Unable to update plan")
      setErrorMessage(message)
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-auto max-h-[90vh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] overflow-hidden md:w-full md:max-w-md">
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="max-h-[82vh] space-y-4 overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Update Plan</DialogTitle>
            <DialogDescription>
              Change the commercial plan assigned to this institution.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label>Plan Type</Label>
            <Select
              value={planType}
              onValueChange={(value) =>
                setPlanType(value as InstitutionPlanType)
              }
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FREE">FREE</SelectItem>
                <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                <SelectItem value="ENTERPRISE">ENTERPRISE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ErrorText message={errorMessage} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="brand-mix"
              disabled={planMutation.isPending}
            >
              {planMutation.isPending ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Plan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function UpdateInstitutionLimitsModal({
  institution,
  open,
  onOpenChange,
}: {
  institution: Institution | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [studentLimit, setStudentLimit] = useState("0")
  const [lecturerLimit, setLecturerLimit] = useState("0")
  const [dailyAiRequestLimit, setDailyAiRequestLimit] = useState("0")
  const [storageLimitGb, setStorageLimitGb] = useState("0")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const limitsMutation = useUpdateInstitutionLimitsMutation()

  useEffect(() => {
    if (open && institution) {
      setStudentLimit(String(institution.studentLimit))
      setLecturerLimit(String(institution.lecturerLimit))
      setDailyAiRequestLimit(String(institution.dailyAiRequestLimit))
      setStorageLimitGb(String(institution.storageLimitGb))
      setErrorMessage(null)
    }
  }, [institution, open])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!institution) return

    try {
      await limitsMutation.mutateAsync({
        id: institution.id,
        payload: {
          studentLimit: Number(studentLimit),
          lecturerLimit: Number(lecturerLimit),
          dailyAiRequestLimit: Number(dailyAiRequestLimit),
          storageLimitGb: Number(storageLimitGb),
        },
      })
      toast.success("Limits updated")
      onOpenChange(false)
    } catch (error) {
      const message = getApiError(error, "Unable to update limits")
      setErrorMessage(message)
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-auto max-h-[90vh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] overflow-hidden md:w-full md:max-w-2xl">
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="max-h-[82vh] space-y-4 overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Update Limits</DialogTitle>
            <DialogDescription>
              Configure operational limits for institution capacity and AI
              usage.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="limit-students">Student Limit</Label>
              <Input
                id="limit-students"
                type="number"
                min={0}
                value={studentLimit}
                onChange={(e) => setStudentLimit(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limit-lecturers">Lecturer Limit</Label>
              <Input
                id="limit-lecturers"
                type="number"
                min={0}
                value={lecturerLimit}
                onChange={(e) => setLecturerLimit(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limit-ai">Daily AI Request Limit</Label>
              <Input
                id="limit-ai"
                type="number"
                min={0}
                value={dailyAiRequestLimit}
                onChange={(e) => setDailyAiRequestLimit(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limit-storage">Storage Limit (GB)</Label>
              <Input
                id="limit-storage"
                type="number"
                min={0}
                value={storageLimitGb}
                onChange={(e) => setStorageLimitGb(e.target.value)}
                required
              />
            </div>
          </div>

          <ErrorText message={errorMessage} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="brand-mix"
              disabled={limitsMutation.isPending}
            >
              {limitsMutation.isPending ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Limits"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function UpdateInstitutionFeaturesModal({
  institution,
  open,
  onOpenChange,
}: {
  institution: Institution | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [draftFeatures, setDraftFeatures] = useState<InstitutionFeature[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const featuresQuery = useInstitutionFeaturesQuery(institution?.id)
  const updateFeaturesMutation = useUpdateInstitutionFeaturesMutation()

  useEffect(() => {
    if (open) {
      setErrorMessage(null)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    if (!featuresQuery.data) return
    setDraftFeatures(featuresQuery.data)
  }, [featuresQuery.data, open])

  function toggleFeature(featureKey: string, enabled: boolean) {
    setDraftFeatures((prev) =>
      prev.map((feature) =>
        feature.featureKey === featureKey ? { ...feature, enabled } : feature
      )
    )
  }

  async function handleSave() {
    if (!institution) return

    try {
      await updateFeaturesMutation.mutateAsync({
        id: institution.id,
        payload: {
          features: draftFeatures.map((feature) => ({
            featureKey: feature.featureKey,
            enabled: feature.enabled,
          })),
        },
      })

      toast.success("Feature toggles updated")
      onOpenChange(false)
    } catch (error) {
      const message = getApiError(error, "Unable to update features")
      setErrorMessage(message)
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-auto max-h-[90vh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] overflow-hidden md:w-full md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Feature Toggles</DialogTitle>
          <DialogDescription>
            Manage institution feature flags and persist updates to Gemspace
            controls.
          </DialogDescription>
        </DialogHeader>

        {featuresQuery.isLoading ? (
          <div className="grid max-h-[56vh] gap-2 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="grid max-h-[56vh] gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
            {draftFeatures.map((feature) => (
              <div
                key={feature.featureKey}
                className="flex flex-col gap-2 rounded-lg border px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-medium break-all">
                    {feature.featureKey}
                  </p>
                  <div className="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
                    <Badge variant="outline" className="px-1.5 py-0">
                      {feature.planIncluded ? "Plan Included" : "Optional"}
                    </Badge>
                    <span>
                      Effective: {feature.effectiveEnabled ? "On" : "Off"}
                    </span>
                  </div>
                </div>

                <Switch
                  checked={feature.enabled}
                  onCheckedChange={(checked) =>
                    toggleFeature(feature.featureKey, checked)
                  }
                />
              </div>
            ))}
          </div>
        )}

        <ErrorText message={errorMessage} />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="brand-mix"
            disabled={
              updateFeaturesMutation.isPending || featuresQuery.isLoading
            }
            onClick={() => void handleSave()}
          >
            {updateFeaturesMutation.isPending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Feature Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
