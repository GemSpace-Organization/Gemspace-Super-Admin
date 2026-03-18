import { SchoolAdminActivityView } from "@/components/dashboard/school-admins/school-admin-activity-view"

type Props = {
  params: { id: string }
}

export default function InstitutionAdminActivityPage({ params }: Props) {
  const { id } = params
  return <SchoolAdminActivityView id={id} />
}
