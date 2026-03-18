import { PlatformUserActivityView } from "@/components/dashboard/users/platform-user-activity-view"

type Props = {
  params: { id: string }
}

export default function UserActivityPage({ params }: Props) {
  const { id } = params
  return <PlatformUserActivityView id={id} />
}
