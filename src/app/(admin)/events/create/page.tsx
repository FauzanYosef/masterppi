import CreateEventForm from '@/components/Admin/Events/Create'

export const metadata = {
  title: "Create Events - PPI",
};

export default function CreateEventPage() {
  return (
    <div className="p-6">
      <CreateEventForm />
    </div>
  )
}