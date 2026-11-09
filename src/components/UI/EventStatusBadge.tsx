const STATUS: Record<string, { label: string; className: string }> = {
  upcoming: { label: 'Akan Datang', className: 'bg-primary text-white' },
  ongoing: { label: 'Berlangsung', className: 'bg-sec-yellow text-darkblue' },
  finished: { label: 'Selesai', className: 'bg-darkblue/80 text-white' },
}

/** Label status agenda dengan warna yang seragam di seluruh website. */
const EventStatusBadge = ({ status }: { status?: string | null }) => {
  const info = STATUS[status ?? 'upcoming'] ?? { label: status, className: 'bg-primary text-white' }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-soft backdrop-blur ${info.className}`}>
      <span className='h-1.5 w-1.5 rounded-full bg-current opacity-80' />
      {info.label}
    </span>
  )
}

export default EventStatusBadge
