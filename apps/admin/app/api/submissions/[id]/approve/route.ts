import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, verifyToken } from '@/lib/session'
import { createSupabaseServiceClient } from '@/lib/supabase-server'
import { createFarmPullRequest } from '@/lib/github'
import type { Submission } from '@farms/db'

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

  const { data, error: fetchError } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !data) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
  }

  const submission = data as Submission

  try {
    const prUrl = await createFarmPullRequest(submission)

    const { error: updateError } = await supabase
      .from('submissions')
      .update({
        status: 'pr_created',
        github_pr_url: prUrl,
        reviewer_notes: reviewerNotes,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      console.error('Failed to update submission after PR creation:', updateError)
    }

    return NextResponse.json({ ok: true, pr_url: prUrl })
  } catch (err) {
    console.error('PR creation error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create PR' },
      { status: 500 }
    )
  }
}
