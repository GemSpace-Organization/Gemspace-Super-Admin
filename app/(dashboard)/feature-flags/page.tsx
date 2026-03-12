import { ToggleLeftIcon } from "lucide-react"
import { ComingSoon } from "@/components/shared/coming-soon"

export default function FeatureFlagsPage() {
  return (
    <ComingSoon
      title="Feature Flags"
      description="Control feature rollouts with fine-grained flags. Enable gradual deployments, run A/B experiments, and manage per-tenant feature availability without code deployments."
      icon={<ToggleLeftIcon className="size-6" />}
      category="Operations"
      eta="Q4 2026"
      progress={10}
      features={[
        "Feature flag creation and toggle management",
        "Per-tenant and per-role flag targeting",
        "Gradual rollout with percentage-based rules",
        "A/B experiment configuration and tracking",
        "Flag dependency management and grouping",
        "Change history and rollback capabilities",
      ]}
    />
  )
}
