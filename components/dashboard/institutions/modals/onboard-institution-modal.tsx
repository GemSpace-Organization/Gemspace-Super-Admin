"use client"

import { useMemo, useState } from "react"
import { ApiError } from "@/lib/api/http"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusIcon, Loader2Icon } from "lucide-react"
import { useOnboardInstitutionMutation } from "@/features/super-admin/hooks/use-super-admin"
import type { InstitutionPlanType } from "@/features/super-admin/types/super-admin.types"
import { toast } from "sonner"

type FormState = {
  name: string
  country: string
  adminEmail: string
  officialDomain: string
  planType: InstitutionPlanType
  estimatedStudentCount: string
  timezone: string
  studentLimit: string
  lecturerLimit: string
  dailyAiRequestLimit: string
  storageLimitGb: string
}

const initialForm: FormState = {
  name: "",
  country: "",
  adminEmail: "",
  officialDomain: "",
  planType: "FREE",
  estimatedStudentCount: "5000",
  timezone: "Africa/Lagos",
  studentLimit: "5000",
  lecturerLimit: "300",
  dailyAiRequestLimit: "50000",
  storageLimitGb: "250",
}

export function OnboardInstitutionModal() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(initialForm)
  const onboardMutation = useOnboardInstitutionMutation()

  const errorMessage = useMemo(() => {
    if (!(onboardMutation.error instanceof ApiError)) {
      return onboardMutation.error ? "Unable to onboard institution" : null
    }

    return onboardMutation.error.message
  }, [onboardMutation.error])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      await onboardMutation.mutateAsync({
        name: form.name,
        country: form.country,
        adminEmail: form.adminEmail,
        officialDomain: form.officialDomain,
        planType: form.planType,
        estimatedStudentCount: Number(form.estimatedStudentCount),
        timezone: form.timezone,
        studentLimit: Number(form.studentLimit),
        lecturerLimit: Number(form.lecturerLimit),
        dailyAiRequestLimit: Number(form.dailyAiRequestLimit),
        storageLimitGb: Number(form.storageLimitGb),
      })

      toast.success("Institution onboarded successfully")
      setOpen(false)
      setForm(initialForm)
    } catch {
      toast.error("Failed to onboard institution")
    }
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo text-indigo-foreground hover:bg-indigo/90">
          <PlusIcon className="size-4" />
          Onboard Institution
        </Button>
      </DialogTrigger>
      <DialogContent className="h-auto max-h-[90vh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] gap-0 overflow-hidden p-0 md:w-[50vw] md:max-w-[50vw]">
        <form onSubmit={(e) => void handleSubmit(e)}>
          <DialogHeader className="border-b px-6 py-5">
            <DialogTitle className="text-base">Onboard Institution</DialogTitle>
            <DialogDescription>
              Create a new institution in pending review state and send first
              onboarding invite.
            </DialogDescription>
          </DialogHeader>

          <div className="grid max-h-[62vh] gap-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="institution-name">Institution Name</Label>
              <Input
                id="institution-name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
                placeholder="Bowen University"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution-country">Country</Label>
              <Input
                id="institution-country"
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                required
                placeholder="Nigeria"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution-admin-email">Admin Email</Label>
              <Input
                id="institution-admin-email"
                type="email"
                value={form.adminEmail}
                onChange={(e) => updateField("adminEmail", e.target.value)}
                required
                placeholder="admin@school.edu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution-domain">Official Domain</Label>
              <Input
                id="institution-domain"
                value={form.officialDomain}
                onChange={(e) => updateField("officialDomain", e.target.value)}
                required
                placeholder="school.edu"
              />
            </div>
            <div className="space-y-2">
              <Label>Plan Type</Label>
              <Select
                value={form.planType}
                onValueChange={(value) =>
                  updateField("planType", value as InstitutionPlanType)
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
            <div className="space-y-2">
              <Label htmlFor="institution-timezone">Timezone</Label>
              <Input
                id="institution-timezone"
                value={form.timezone}
                onChange={(e) => updateField("timezone", e.target.value)}
                required
                placeholder="Africa/Lagos"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimated-students">
                Estimated Student Count
              </Label>
              <Input
                id="estimated-students"
                type="number"
                min={0}
                value={form.estimatedStudentCount}
                onChange={(e) =>
                  updateField("estimatedStudentCount", e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-limit">Student Limit</Label>
              <Input
                id="student-limit"
                type="number"
                min={0}
                value={form.studentLimit}
                onChange={(e) => updateField("studentLimit", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lecturer-limit">Lecturer Limit</Label>
              <Input
                id="lecturer-limit"
                type="number"
                min={0}
                value={form.lecturerLimit}
                onChange={(e) => updateField("lecturerLimit", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-limit">Daily AI Request Limit</Label>
              <Input
                id="ai-limit"
                type="number"
                min={0}
                value={form.dailyAiRequestLimit}
                onChange={(e) =>
                  updateField("dailyAiRequestLimit", e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="storage-limit">Storage Limit (GB)</Label>
              <Input
                id="storage-limit"
                type="number"
                min={0}
                value={form.storageLimitGb}
                onChange={(e) => updateField("storageLimitGb", e.target.value)}
                required
              />
            </div>

            {errorMessage && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive md:col-span-2">
                {errorMessage}
              </p>
            )}
          </div>

          <DialogFooter className="border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo text-indigo-foreground hover:bg-indigo/90"
              disabled={onboardMutation.isPending}
            >
              {onboardMutation.isPending ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Institution"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
