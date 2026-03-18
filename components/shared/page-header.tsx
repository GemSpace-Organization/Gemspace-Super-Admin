import type { ReactNode } from "react"
import { InfoIcon } from "lucide-react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"

type PageHeaderProps = {
  badge?: ReactNode
  title: string
  description?: string
  actions?: ReactNode
  infoTitle?: string
  infoContent?: ReactNode
  className?: string
  contentClassName?: string
}

export function PageHeader({
  badge,
  title,
  description,
  actions,
  infoTitle,
  infoContent,
  className,
  contentClassName,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-linear-to-br from-indigo/10 via-background to-teal/10 p-4 sm:p-6",
        className
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className={cn("space-y-2", contentClassName)}>
          {badge ? (
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground">
              {badge}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h1>
            {infoContent ? (
              <HoverCard openDelay={150} closeDelay={120}>
                <HoverCardTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex size-7 items-center justify-center rounded-full border bg-background/70 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Open page guidance"
                  >
                    <InfoIcon className="size-3.5" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent align="start" className="w-80 p-3">
                  {infoTitle ? (
                    <p className="mb-1 text-sm font-semibold">{infoTitle}</p>
                  ) : null}
                  <div className="text-xs text-muted-foreground">
                    {infoContent}
                  </div>
                </HoverCardContent>
              </HoverCard>
            ) : null}
          </div>
          {description ? (
            <p className="max-w-3xl text-sm text-muted-foreground sm:text-[0.95rem]">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="w-full lg:w-auto lg:shrink-0">{actions}</div>
        ) : null}
      </div>
    </div>
  )
}
