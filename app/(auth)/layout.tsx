import { GuestGuard } from "@/components/auth/route-guards"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <GuestGuard>
      <div className="min-h-svh bg-background">{children}</div>
    </GuestGuard>
  )
}
