import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * On-demand revalidation — dipanggil fisip-api setelah konten diubah di CMS.
 *   POST /api/revalidate
 *   Header: x-revalidate-secret: <REVALIDATE_SECRET>
 * Semua data API memakai tag `api`, jadi satu panggilan menyegarkan seluruh halaman.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET ?? ''
  if (!secret || request.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  revalidateTag('api', 'max')
  revalidatePath('/', 'layout')

  return NextResponse.json({ success: true, revalidated: ['api'] })
}
