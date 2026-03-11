"use client"

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { Logo } from "@/components/logo"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <Logo size="sm" showText />
          </a>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
