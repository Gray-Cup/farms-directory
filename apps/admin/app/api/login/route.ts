import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, makeSessionToken } from '@/lib/session'

export async function POST(req: NextRequest) {
  const { email, password, token } = await req.json() as {
    email: string
    password: string
    token: string
  }

  // Verify Turnstile token server-side
  const tsRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  })
  const tsData = await tsRes.json() as { success: boolean }
  if (!tsData.success) {
    return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 400 })
  }

  // Verify credentials against env vars
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  const sessionToken = await makeSessionToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return res
}
