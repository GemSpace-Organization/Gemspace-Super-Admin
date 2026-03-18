"use client"

import { Loader2Icon } from "lucide-react"
import type { Announcement } from "@/features/super-admin/types/super-admin.types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type ArchiveAnnouncementModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  announcement: Announcement | null
  isPending: boolean
  onConfirm: (announcementId: string) => void
}

export function ArchiveAnnouncementModal({
  open,
  onOpenChange,
  announcement,
  isPending,
  onConfirm,
}: ArchiveAnnouncementModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Archive Announcement</DialogTitle>
          <DialogDescription>
            This announcement will no longer be active for users.
          </DialogDescription>
        </DialogHeader>

        {announcement ? (
          <div className="rounded-lg border bg-muted/30 px-3 py-2">
            <p className="text-sm font-medium">{announcement.title}</p>
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {announcement.body}
            </p>
          </div>
        ) : null}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="indigo"
            onClick={() => {
              if (!announcement) return
              onConfirm(announcement.id)
            }}
            disabled={isPending || !announcement}
          >
            {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
            Confirm Archive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
