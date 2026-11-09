type PaginationProps = {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

const base =
  'flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-30'
const idle =
  'border border-darkblue/10 bg-white text-darkblue hover:border-primary hover:text-primary dark:border-white/15 dark:bg-lightdarkblue dark:text-white'

/** Nomor halaman dengan elipsis: 1 … 4 5 6 … 12. */
const buildPages = (page: number, total: number): (number | 'gap')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | 'gap')[] = [1]
  const from = Math.max(2, page - 1)
  const to = Math.min(total - 1, page + 1)
  if (from > 2) pages.push('gap')
  for (let p = from; p <= to; p++) pages.push(p)
  if (to < total - 1) pages.push('gap')
  pages.push(total)
  return pages
}

const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <nav aria-label='Halaman' className='mt-14 flex flex-wrap items-center justify-center gap-2'>
      <button className={`${base} ${idle}`} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label='Halaman sebelumnya'>
        ←
      </button>
      {buildPages(page, totalPages).map((item, i) =>
        item === 'gap' ? (
          <span key={`gap-${i}`} aria-hidden className='px-1 text-lightgrey'>
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={`${base} ${item === page ? 'bg-primary text-white shadow-soft' : idle}`}>
            {item}
          </button>
        ),
      )}
      <button
        className={`${base} ${idle}`}
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        aria-label='Halaman berikutnya'>
        →
      </button>
    </nav>
  )
}

export default Pagination
