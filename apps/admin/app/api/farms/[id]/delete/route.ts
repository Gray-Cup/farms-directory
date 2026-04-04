import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, verifyToken } from '@/lib/session'
import { deleteFarm, deleteFarmPullRequest } from '@/lib/github'

interface Params { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { farmType, farmName, mode } = await req.json()

  try {
    if (mode === 'pr') {
      const prUrl = await deleteFarmPullRequest(farmType, id, farmName)
      return NextResponse.json({ ok: true, pr_url: prUrl })
    } else {
      await deleteFarm(farmType, id, farmName)
      return NextResponse.json({ ok: true })
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed' },
      { status: 500 }
    )
  }
}
