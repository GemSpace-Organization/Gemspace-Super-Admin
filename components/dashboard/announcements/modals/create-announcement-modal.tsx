"use client"

import { useEffect, useState } from "react"
import { Loader2Icon } from "lucide-react"
import { ApiError } from "@/lib/api/http"
import type {
  AnnouncementTargetType,
  CreateAnnouncementRequest,
  Institution,
} from "@/features/super-admin/types/super-admin.types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) return error.message
  return fallback
}

type CreateAnnouncementModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isPending: boolean
  institutions: Institution[]
  onCreate: (payload: CreateAnnouncementRequest) => Promise<unknown>
}

export function CreateAnnouncementModal({
  open,
  onOpenChange,
  isPending,
  institutions,
  onCreate,
}: CreateAnnouncementModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: "",
    body: "",
    targetType: "ALL_PLATFORM_USERS" as AnnouncementTargetType,
    institutionId: "",
    startsAt: "",
    expiresAt: "",
  })

  useEffect(() => {
    if (!open) return
    setErrorMessage(null)
  }, [open])

  function resetForm() {
    setForm({
      title: "",
      body: "",
      targetType: "ALL_PLATFORM_USERS",
      institutionId: "",
      startsAt: "",
      expiresAt: "",
    })
    setErrorMessage(null)
  }

  async function handleSubmit() {
    if (!form.title.trim() || !form.body.trim()) {
      setErrorMessage("Title and body are required.")
      return
    }

    if (form.targetType === "SPECIFIC_INSTITUTION" && !form.institutionId) {
      setErrorMessage("Please select an institution for this target type.")
      return
    }

    if (
      form.startsAt &&
      form.expiresAt &&
      new Date(form.startsAt).getTime() > new Date(form.expiresAt).getTime()
    ) {
      setErrorMessage("Start date must be before expiry date.")
      return
    }

    setErrorMessage(null)

    try {
      await onCreate({
        title: form.title.trim(),
        body: form.body.trim(),
        targetType: form.targetType,
        institutionId:
          form.targetType === "SPECIFIC_INSTITUTION"
            ? form.institutionId
            : undefined,
        startsAt: form.startsAt
          ? new Date(form.startsAt).toISOString()
          : undefined,
        expiresAt: form.expiresAt
          ? new Date(form.expiresAt).toISOString()
          : undefined,
      })

      resetForm()
      onOpenChange(false)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to create announcement."))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-auto max-h-[90vh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] overflow-hidden sm:max-w-2xl">
        <div className="max-h-[82vh] space-y-4 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
            <DialogDescription>
              Announcements are created in DRAFT state. Publish when reviewed.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="space-y-2">
              <Label htmlFor="announcement-title">Title</Label>
              <Input
                id="announcement-title"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Planned maintenance window"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="announcement-body">Body</Label>
              <Textarea
                id="announcement-body"
                value={form.body}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    body: event.target.value,
                  }))
                }
                placeholder="Platform maintenance starts at 10:00 PM UTC..."
                className="min-h-28"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Target Type</Label>
                <Select
                  value={form.targetType}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      targetType: value as AnnouncementTargetType,
                      institutionId:
                        value === "SPECIFIC_INSTITUTION"
                          ? current.institutionId
                          : "",
                    }))
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Select target type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL_PLATFORM_USERS">
                      All Platform Users
                    </SelectItem>
                    <SelectItem value="ALL_INSTITUTIONS">
                      All Institutions
                    </SelectItem>
                    <SelectItem value="SPECIFIC_INSTITUTION">
                      Specific Institution
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Institution</Label>
                <Select
                  value={form.institutionId || "NONE"}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      institutionId: value === "NONE" ? "" : value,
                    }))
                  }
                  disabled={form.targetType !== "SPECIFIC_INSTITUTION"}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Select institution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">
                      No institution selected
                    </SelectItem>
                    {institutions.map((institution) => (
                      <SelectItem key={institution.id} value={institution.id}>
                        {institution.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="starts-at">Starts At</Label>
                <Input
                  id="starts-at"
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      startsAt: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires-at">Expires At</Label>
                <Input
                  id="expires-at"
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      expiresAt: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {errorMessage ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="indigo"
              onClick={() => {
                void handleSubmit()
              }}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : null}
              Save Draft
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
