import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, verifyToken } from '@/lib/session'
import { createSupabaseServiceClient } from '@/lib/supabase-server'

interface Params {
  params: Promise<{ id: string }>
}

export async function POST(req: NextRequest, { params }: Params) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const reviewerNotes = body.reviewer_notes?.trim() ?? null

  const supabase = createSupabaseServiceClient()

  const { error } = await supabase
    .from('submissions')
    .update({
      status: 'rejected',
      reviewer_notes: reviewerNotes,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
