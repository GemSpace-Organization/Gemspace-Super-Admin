"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Building2Icon,
  Loader2Icon,
  SearchIcon,
  UserPlusIcon,
} from "lucide-react"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/http"
import {
  useCreateSchoolAdminMutation,
  useInstitutionsQuery,
} from "@/features/super-admin/hooks/use-super-admin"
import type { Institution } from "@/features/super-admin/types/super-admin.types"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type InstitutionSummary = Pick<Institution, "id" | "name" | "subdomain">

type CreateSchoolAdminModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultInstitution?: InstitutionSummary | null
}

export function CreateSchoolAdminModal({
  open,
  onOpenChange,
  defaultInstitution,
}: CreateSchoolAdminModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [institutionSearch, setInstitutionSearch] = useState("")
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    institutionId: "",
  })

  const createMutation = useCreateSchoolAdminMutation()

  const activeInstitutionsQuery = useInstitutionsQuery({
    page: 1,
    limit: 100,
    status: "ACTIVE",
    search: institutionSearch.trim() || undefined,
  })

  const institutionOptions = useMemo(() => {
    const activeInstitutions = activeInstitutionsQuery.data?.items ?? []

    if (
      defaultInstitution &&
      !activeInstitutions.some((item) => item.id === defaultInstitution.id)
    ) {
      return [defaultInstitution, ...activeInstitutions]
    }

    return activeInstitutions
  }, [activeInstitutionsQuery.data?.items, defaultInstitution])

  useEffect(() => {
    if (!open) return

    setErrorMessage(null)
    setInstitutionSearch("")
    setForm((current) => ({
      ...current,
      institutionId: defaultInstitution?.id ?? current.institutionId,
    }))
  }, [defaultInstitution?.id, open])

  function setField<K extends keyof typeof form>(
    field: K,
    value: (typeof form)[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit() {
    const firstName = form.firstName.trim()
    const lastName = form.lastName.trim()
    const email = form.email.trim()
    const institutionId = form.institutionId.trim()

    if (!firstName || !lastName || !email || !institutionId) {
      setErrorMessage("All fields are required to create an institution admin.")
      return
    }

    setErrorMessage(null)

    try {
      await createMutation.mutateAsync({
        firstName,
        lastName,
        email,
        institutionId,
      })

      toast.success("Institution admin created and setup email sent")

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        institutionId: defaultInstitution?.id ?? "",
      })
      onOpenChange(false)
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
        toast.error(error.message)
      } else {
        setErrorMessage("Unable to create institution admin")
        toast.error("Unable to create institution admin")
      }
    }
  }

  const selectedInstitution = institutionOptions.find(
    (item) => item.id === form.institutionId
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-auto max-h-[90vh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] overflow-hidden sm:max-w-xl">
        <div className="max-h-[82vh] space-y-4 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlusIcon className="size-4 text-indigo" />
              Create Institution Admin
            </DialogTitle>
            <DialogDescription>
              Create a new institution admin and send setup instructions.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="admin-first-name">First Name</Label>
              <Input
                id="admin-first-name"
                value={form.firstName}
                onChange={(event) => setField("firstName", event.target.value)}
                placeholder="Ada"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="admin-last-name">Last Name</Label>
              <Input
                id="admin-last-name"
                value={form.lastName}
                onChange={(event) => setField("lastName", event.target.value)}
                placeholder="Lovelace"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
                placeholder="admin@institution.edu"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="institution-search">Institution</Label>
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute top-2.5 left-2.5 size-3.5 text-muted-foreground" />
                <Input
                  id="institution-search"
                  value={institutionSearch}
                  onChange={(event) => setInstitutionSearch(event.target.value)}
                  placeholder="Search active institutions"
                  className="pl-8"
                />
              </div>

              <Select
                value={form.institutionId}
                onValueChange={(value) => setField("institutionId", value)}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Select active institution" />
                </SelectTrigger>
                <SelectContent>
                  {activeInstitutionsQuery.isLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading active institutions...
                    </SelectItem>
                  ) : institutionOptions.length > 0 ? (
                    institutionOptions.map((institution) => (
                      <SelectItem key={institution.id} value={institution.id}>
                        {institution.name} ({institution.subdomain})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No active institutions found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>

              {selectedInstitution ? (
                <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Building2Icon className="size-3.5" />
                  Selected: {selectedInstitution.name}
                </p>
              ) : null}
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
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="indigo"
              onClick={() => void handleSubmit()}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : null}
              Create and Send Setup
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
