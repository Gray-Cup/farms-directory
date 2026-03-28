import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findFarm(farmId: string): any | null {
  const repoRoot = path.resolve(process.cwd(), '../../')
  for (const filename of ['coffee-farms.json', 'tea-farms.json']) {
    const filePath = path.join(repoRoot, 'data', filename)
    if (!fs.existsSync(filePath)) continue
    const farms = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const farm = farms.find((f: any) => f.id === farmId)
    if (farm) return farm
  }
  return null
}

export async function POST(req: NextRequest) {
  if (!TURNSTILE_SECRET) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  let farmId: string, token: string
  try {
    const body = await req.json()
    farmId = body.farmId
    token = body.token
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!farmId || !token) {
    return NextResponse.json({ error: 'Missing farmId or token' }, { status: 400 })
  }

  // Verify Turnstile token with Cloudflare
  const formData = new FormData()
  formData.append('secret', TURNSTILE_SECRET)
  formData.append('response', token)
  formData.append('remoteip', req.headers.get('cf-connecting-ip') ?? '')

  const verifyRes = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    { method: 'POST', body: formData }
  )
  const verifyData = await verifyRes.json() as { success: boolean }

  if (!verifyData.success) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
  }

  const farm = findFarm(farmId)
  if (!farm) {
    return NextResponse.json({ error: 'Farm not found' }, { status: 404 })
  }

  return NextResponse.json({
    phone: farm.phone ?? null,
    email: farm.email ?? null,
  })
}
