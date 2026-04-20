import Sidebar from '@/components/Admin/Layout/Sidebar'
import Navbar from '@/components/Admin/Layout/Navbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">

      {/* SIDEBAR */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <div className="sticky top-0 z-40">
          <Navbar />
        </div>

        {/* CONTENT (SCROLL DI SINI) */}
        <div className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide">
          {children}
        </div>

      </div>
    </div>
  )
}