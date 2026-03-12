import { CreditCardIcon } from "lucide-react"
import { ComingSoon } from "@/components/shared/coming-soon"

export default function SubscriptionsPage() {
  return (
    <ComingSoon
      title="Subscription Management"
      description="Manage subscription plans, invoices, and revenue tracking across all tenants. Configure pricing tiers and monitor the full billing lifecycle."
      icon={<CreditCardIcon className="size-6" />}
      category="Financial"
      eta="Q2 2026"
      progress={35}
      features={[
        "Subscription plan creation and management",
        "Invoice generation and payment tracking",
        "Revenue dashboard with monthly breakdowns",
        "Plan upgrade and downgrade workflows",
        "Payment method and billing contact management",
        "Overdue payment alerts and dunning flows",
      ]}
    />
  )
}
