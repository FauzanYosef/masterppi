'use client'

import {
  Users,
  CreditCard,
  Image as ImageIcon,
  Code,
} from 'lucide-react'

export default function DashboardContent() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Welcome back! Here’s what’s happening today.
        </p>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <Stat
          title="Users"
          value="430"
          icon={Users}
          growth="+12%"
        />

        <Stat
          title="Subscriptions"
          value="360"
          icon={CreditCard}
          growth="+8%"
        />

        <Stat
          title="Images Generated"
          value="43,583"
          icon={ImageIcon}
          growth="+32%"
        />

        <Stat
          title="Codes Generated"
          value="34,385"
          icon={Code}
          growth="+21%"
        />

      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card title="User Growth">
          <div className="h-56 flex items-center justify-center text-gray-400">
            Chart Area (Recharts / Chart.js)
          </div>
        </Card>

        <Card title="Revenue Overview">
          <div className="h-56 flex items-center justify-center text-gray-400">
            Chart Area
          </div>
        </Card>

      </div>

      {/* ===== TABLE ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Table title="Latest Registrations" />

        <Table title="Latest Transactions" />

      </div>

    </div>
  )
}

//
// ================= COMPONENTS
//

const Stat = ({ title, value, icon: Icon, growth }: any) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between">

    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
      <p className="text-green-500 text-xs mt-1">{growth}</p>
    </div>

    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-purple-100 text-purple-600">
      <Icon size={20} />
    </div>

  </div>
)

const Card = ({ title, children }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm">
    <h3 className="font-semibold mb-4">{title}</h3>
    {children}
  </div>
)

const Table = ({ title }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm">

    <h3 className="font-semibold mb-4">{title}</h3>

    <table className="w-full text-sm">
      <thead>
        <tr className="text-gray-400 text-left border-b">
          <th className="pb-2">Name</th>
          <th>Status</th>
          <th>Date</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr className="border-b">
          <td className="py-3">Stella Powell</td>
          <td className="text-green-500">Active</td>
          <td>03/27/2026</td>
          <td>
            <button className="text-purple-600 text-xs hover:underline">
              View
            </button>
          </td>
        </tr>

        <tr className="border-b">
          <td className="py-3">Aaron Dunn</td>
          <td className="text-yellow-500">Pending</td>
          <td>08/14/2026</td>
          <td>
            <button className="text-purple-600 text-xs hover:underline">
              View
            </button>
          </td>
        </tr>

        <tr>
          <td className="py-3">John Carter</td>
          <td className="text-red-500">Inactive</td>
          <td>01/02/2026</td>
          <td>
            <button className="text-purple-600 text-xs hover:underline">
              View
            </button>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
)