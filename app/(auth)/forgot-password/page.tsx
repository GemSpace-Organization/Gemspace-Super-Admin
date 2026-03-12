import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { Logo } from "@/components/logo"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left — Branding + Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Top-left logo */}
        <div className="flex justify-start">
          <Link href="/login" aria-label="Back to Gemspace">
            <Logo size="md" showText />
          </Link>
        </div>

        {/* Centered form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <ForgotPasswordForm />
          </div>
        </div>

        <p className="text-center text-[0.7rem] text-muted-foreground">
          &copy; {new Date().getFullYear()} GEM-SPACE. All rights reserved.
        </p>
      </div>

      {/* Right — Hero image */}
      <div className="relative hidden overflow-hidden bg-muted lg:block">
        <img
          src="https://plus.unsplash.com/premium_photo-1689177357836-52c9d90d3d6f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dGhpbmtpbmd8ZW58MHx8MHx8fDA%3D"
          alt="Space nebula"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3] dark:grayscale-[30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute right-8 bottom-8 left-8 text-white">
          <h2 className="mb-2 text-2xl font-bold">
            Forgot your password? Let's get you a new one.
          </h2>
          <p className="text-sm text-white/80">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>
      </div>
    </div>
  )
}
