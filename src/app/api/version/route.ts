import { NextResponse } from 'next/server'
import pkg from '../../../../package.json'

// Versi rilis yang sedang berjalan (dibaca dari package.json saat build). Dipakai scripts/release.sh
// untuk memastikan versi yang benar sudah hidup di server.
export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json({ name: pkg.name, version: pkg.version }, { headers: { 'Cache-Control': 'no-store' } })
}
