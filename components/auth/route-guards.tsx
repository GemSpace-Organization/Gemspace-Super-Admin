"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { useAuthBootstrap } from "@/features/auth/hooks/use-auth"
import { useAuthStore } from "@/features/auth/store/auth.store"

function GuardLoading({
  title,
  description,
}: {
  title: string
  description: string
}) {
  const steps = useMemo(
    () => [
      "Initializing session...",
      "Checking authentication...",
      "Applying secure routing...",
    ],
    []
  )
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length)
    }, 1400)

    return () => clearInterval(timer)
  }, [steps.length])

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-3 inline-flex items-center justify-center">
          <Spinner className="size-6 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        <p className="mt-2 text-xs text-muted-foreground">{steps[stepIndex]}</p>
      </div>
    </div>
  )
}

export function ProtectedGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const hydrated = useAuthStore((state) => state.hydrated)
  const accessToken = useAuthStore((state) => state.accessToken)
  const authenticated = useAuthStore((state) => state.authenticated)
  const meQuery = useAuthBootstrap()

  useEffect(() => {
    if (!hydrated) return
    if (!accessToken) {
      router.replace("/login")
    }
  }, [accessToken, hydrated, router])

  const isResolvingSession =
    !hydrated ||
    meQuery.isLoading ||
    meQuery.isFetching ||
    (Boolean(accessToken) && !authenticated && !meQuery.data && !meQuery.error)

  if (isResolvingSession) {
    return (
      <GuardLoading
        title="Verifying secure session"
        description="Validating your Gemspace access before loading workspace."
      />
    )
  }

  if (!accessToken) {
    return (
      <GuardLoading
        title="Redirecting to sign in"
        description="No active session found for this workspace."
      />
    )
  }

  return <>{children}</>
}

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const hydrated = useAuthStore((state) => state.hydrated)
  const accessToken = useAuthStore((state) => state.accessToken)
  const authenticated = useAuthStore((state) => state.authenticated)
  const meQuery = useAuthBootstrap()

  const hasActiveSession =
    Boolean(accessToken) && (authenticated || Boolean(meQuery.data))

  useEffect(() => {
    if (!hydrated) return
    if (hasActiveSession) {
      router.replace("/dashboard")
    }
  }, [hasActiveSession, hydrated, router])

  if (!hydrated || (accessToken && (meQuery.isLoading || meQuery.isFetching))) {
    return (
      <GuardLoading
        title="Checking account status"
        description="Reviewing current session to route you to the right page."
      />
    )
  }

  if (hasActiveSession) {
    return (
      <GuardLoading
        title="Redirecting to dashboard"
        description="You are already authenticated in Gemspace Super Admin."
      />
    )
  }

  return <>{children}</>
}
