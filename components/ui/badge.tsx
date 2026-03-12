import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-[0.625rem] font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-2.5!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border bg-input/20 text-foreground dark:bg-input/30 [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        success:
          "bg-success/10 text-success dark:bg-success/20 [a]:hover:bg-success/20",
        warning:
          "bg-warning/10 text-warning-foreground dark:bg-warning/20 dark:text-warning [a]:hover:bg-warning/20",
        info: "bg-info/10 text-info dark:bg-info/20 [a]:hover:bg-info/20",
        active:
          "bg-success/10 text-success before:mr-1 before:inline-block before:size-1.5 before:rounded-full before:bg-success before:content-[''] dark:bg-success/20 [a]:hover:bg-success/20",
        inactive:
          "bg-muted text-muted-foreground before:mr-1 before:inline-block before:size-1.5 before:rounded-full before:bg-muted-foreground/50 before:content-[''] [a]:hover:bg-muted/80",
        suspended:
          "bg-destructive/10 text-destructive before:mr-1 before:inline-block before:size-1.5 before:rounded-full before:bg-destructive before:content-[''] dark:bg-destructive/20 [a]:hover:bg-destructive/20",
        teal: "bg-teal/10 text-teal dark:bg-teal/20 [a]:hover:bg-teal/20",
        indigo:
          "bg-indigo/10 text-indigo-foreground dark:bg-indigo/20 dark:text-indigo [a]:hover:bg-indigo/20",
        amber:
          "bg-amber/10 text-amber-foreground dark:bg-amber/20 dark:text-amber [a]:hover:bg-amber/20",
        "primary-light":
          "bg-primary-light/15 text-primary-light-foreground dark:bg-primary-light/20 [a]:hover:bg-primary-light/25",
        "primary-dark":
          "bg-primary-dark/15 text-primary-dark-foreground dark:bg-primary-dark/20 [a]:hover:bg-primary-dark/25",
        "teal-light":
          "bg-teal-light/15 text-teal-light-foreground dark:bg-teal-light/20 [a]:hover:bg-teal-light/25",
        "teal-dark":
          "bg-teal-dark/15 text-teal-dark-foreground dark:bg-teal-dark/20 [a]:hover:bg-teal-dark/25",
        "indigo-light":
          "bg-indigo-light/15 text-indigo-light-foreground dark:bg-indigo-light/20 [a]:hover:bg-indigo-light/25",
        "indigo-dark":
          "bg-indigo-dark/15 text-indigo-dark-foreground dark:bg-indigo-dark/20 [a]:hover:bg-indigo-dark/25",
        "amber-light":
          "bg-amber-light/15 text-amber-light-foreground dark:bg-amber-light/20 [a]:hover:bg-amber-light/25",
        "amber-dark":
          "bg-amber-dark/15 text-amber-dark-foreground dark:bg-amber-dark/20 [a]:hover:bg-amber-dark/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
