import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border hover:bg-input/50 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-input/30",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        "destructive-solid":
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:border-destructive focus-visible:ring-destructive/30",
        success:
          "bg-success text-success-foreground hover:bg-success/90 focus-visible:border-success focus-visible:ring-success/30",
        warning:
          "bg-warning text-warning-foreground hover:bg-warning/90 focus-visible:border-warning focus-visible:ring-warning/30",
        info: "bg-info/10 text-info hover:bg-info/20 focus-visible:border-info/40 focus-visible:ring-info/20 dark:bg-info/20 dark:hover:bg-info/30",
        teal: "bg-teal text-teal-foreground hover:bg-teal/90 focus-visible:border-teal focus-visible:ring-teal/30",
        indigo:
          "bg-indigo text-indigo-foreground hover:bg-indigo/90 focus-visible:border-indigo focus-visible:ring-indigo/30",
        amber:
          "bg-amber text-amber-foreground hover:bg-amber/90 focus-visible:border-amber focus-visible:ring-amber/30",
        link: "text-primary underline-offset-4 hover:underline",
        "primary-light":
          "bg-primary-light text-primary-light-foreground hover:bg-primary-light/80 focus-visible:border-primary-light focus-visible:ring-primary-light/30",
        "primary-dark":
          "bg-primary-dark text-primary-dark-foreground hover:bg-primary-dark/90 focus-visible:border-primary-dark focus-visible:ring-primary-dark/30",
        "secondary-light":
          "bg-secondary-light text-secondary-light-foreground hover:bg-secondary-light/80 focus-visible:border-secondary-light focus-visible:ring-secondary-light/30",
        "secondary-dark":
          "bg-secondary-dark text-secondary-dark-foreground hover:bg-secondary-dark/90 focus-visible:border-secondary-dark focus-visible:ring-secondary-dark/30",
        "teal-light":
          "bg-teal-light text-teal-light-foreground hover:bg-teal-light/80 focus-visible:border-teal-light focus-visible:ring-teal-light/30",
        "teal-dark":
          "bg-teal-dark text-teal-dark-foreground hover:bg-teal-dark/90 focus-visible:border-teal-dark focus-visible:ring-teal-dark/30",
        "indigo-light":
          "bg-indigo-light text-indigo-light-foreground hover:bg-indigo-light/80 focus-visible:border-indigo-light focus-visible:ring-indigo-light/30",
        "indigo-dark":
          "bg-indigo-dark text-indigo-dark-foreground hover:bg-indigo-dark/90 focus-visible:border-indigo-dark focus-visible:ring-indigo-dark/30",
        "amber-light":
          "bg-amber-light text-amber-light-foreground hover:bg-amber-light/80 focus-visible:border-amber-light focus-visible:ring-amber-light/30",
        "amber-dark":
          "bg-amber-dark text-amber-dark-foreground hover:bg-amber-dark/90 focus-visible:border-amber-dark focus-visible:ring-amber-dark/30",
      },
      size: {
        default:
          "h-7 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        xs: "h-5 gap-1 rounded-sm px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-2.5",
        sm: "h-6 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        lg: "h-8 gap-1 px-2.5 text-xs/relaxed has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-xs": "size-5 rounded-sm [&_svg:not([class*='size-'])]:size-2.5",
        "icon-sm": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-lg": "size-8 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
