export const dynamic = "force-dynamic";

import CreateGalleryForm from '@/components/Admin/Gallery/Create'

export const metadata = {
  title: "Create Gallery - PPI",
};

export default function CreateEventPage() {
  return (
    <div className="p-6">
      <CreateGalleryForm />
    </div>
  )
} 