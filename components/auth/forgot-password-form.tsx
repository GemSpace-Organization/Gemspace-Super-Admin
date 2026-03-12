"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  LoaderIcon,
  MailIcon,
} from "lucide-react"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState("")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1000)
  }

  if (submitted) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
            <CheckCircle2Icon className="size-7 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Check your inbox</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A reset link was sent to{" "}
              <span className="font-medium text-foreground">{email}</span>.
              Follow the instructions to set a new password.
            </p>
          </div>
        </div>

        <a
          href="/login"
          className="inline-flex items-center justify-center gap-1.5 text-sm text-indigo hover:underline"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back to sign in
        </a>

        <p className="text-center text-xs text-muted-foreground">
          Didn&apos;t receive it? Check your spam folder.
        </p>
      </div>
    )
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div>
        <h2 className="text-lg font-semibold">Reset your password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your admin email and we&apos;ll send you a secure reset link.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <MailIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="admin@gemspace.app"
              required
              autoComplete="email"
              className="h-10 pl-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="h-10 w-full bg-indigo text-indigo-foreground hover:bg-indigo/90"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoaderIcon className="mr-2 size-4 animate-spin" />
              Sending link…
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </div>

      <div className="text-center">
        <a
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back to sign in
        </a>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Authorized personnel only. All access is logged.
      </p>
    </form>
  )
}
