import { LoginForm } from "@/components/auth/login-form"
import { Logo } from "@/components/logo"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left — Branding + Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Top-left logo */}
        <div className="flex justify-start">
          <Link href="/" aria-label="Gemspace home">
            <Logo size="md" showText />
          </Link>
        </div>

        {/* Centered form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>

        <p className="text-center text-[0.7rem] text-muted-foreground">
          &copy; {new Date().getFullYear()} GEM-SPACE. All rights reserved.
        </p>
      </div>

      {/* Right — Hero image */}
      <div className="relative hidden overflow-hidden bg-muted lg:block">
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1920&auto=format&fit=crop"
          alt="University campus"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3] dark:grayscale-[30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute right-8 bottom-8 left-8 text-white">
          <h2 className="mb-2 text-2xl font-bold">
            Welcome to Gemspace Super Admin
          </h2>
          <p className="text-sm text-white/80">
            Centralized governance for managing tenants, subscriptions, and
            services across the Gemspace ecosystem.
          </p>
        </div>
      </div>
    </div>
  )
}
