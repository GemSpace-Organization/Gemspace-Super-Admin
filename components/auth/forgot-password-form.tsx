"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ArrowLeftIcon, CheckCircle2Icon } from "lucide-react"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  if (isSubmitted) {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-4 text-center",
          className
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2Icon className="size-6 text-success" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;ve sent a password reset link to your email address. Please
            check your inbox and follow the instructions.
          </p>
        </div>
        <a
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back to sign in
        </a>
      </div>
    )
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={(e) => {
        e.preventDefault()
        setIsSubmitted(true)
      }}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Reset your password
          </h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="admin@gemspace.app"
            required
            className="bg-background"
          />
          <FieldDescription>
            Use the email associated with your super admin account.
          </FieldDescription>
        </Field>
        <Field>
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </Field>
        <div className="text-center">
          <a
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back to sign in
          </a>
        </div>
      </FieldGroup>
    </form>
  )
}
