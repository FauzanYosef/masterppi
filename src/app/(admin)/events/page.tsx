import Breadcrumb from '@/components/Admin/Layout/Breadcrumb'
import Events from '@/components/Admin/Events'

export const metadata = {
  title: "Events - PPI",
};

export default function EventsPage() {
  return (
    <div>
      {/* <Breadcrumb /> */}
      <Events />
    </div>
  )
}