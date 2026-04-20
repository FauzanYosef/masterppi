import Breadcrumb from '@/components/Admin/Layout/Breadcrumb'
import Articles from '@/components/Admin/Articles'

export const metadata = {
  title: "Articles - PPI",
};

export default function DashboardPage() {
  return (
    <div>
      {/* <Breadcrumb /> */}
      <Articles />
    </div>
  )
}