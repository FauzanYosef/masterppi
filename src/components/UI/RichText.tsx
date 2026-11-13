type RichTextProps = {
  html: string
  className?: string
}

/** Konten HTML dari CMS dengan tipografi yang seragam di seluruh website. */
const RichText = ({ html, className = '' }: RichTextProps) => (
  <div
    className={`prose prose-lg max-w-none leading-relaxed text-lightgrey dark:prose-invert
      prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-darkblue dark:prose-headings:text-white
      prose-p:text-justify prose-p:text-lightgrey dark:prose-p:text-white/70
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-strong:text-darkblue dark:prose-strong:text-white
      prose-li:marker:text-primary prose-img:rounded-2xl
      prose-blockquote:border-l-sec-yellow prose-blockquote:text-darkblue prose-blockquote:not-italic
      ${className}`}
    dangerouslySetInnerHTML={{ __html: html }}
  />
)

export const RichTextSkeleton = ({ lines = 8 }: { lines?: number }) => (
  <div className='space-y-3' aria-busy='true'>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className='h-4 animate-pulse rounded bg-darkblue/[0.06]' style={{ width: `${98 - ((i * 7) % 30)}%` }} />
    ))}
  </div>
)

export default RichText
