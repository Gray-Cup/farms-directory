export const SESSION_COOKIE = 'admin_session'

// HMAC-SHA256 of a fixed message keyed with ADMIN_PASSWORD.
// Stateless: valid as long as ADMIN_PASSWORD doesn't change.
async function computeToken(): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(process.env.ADMIN_PASSWORD ?? ''),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const buf = await crypto.subtle.sign('HMAC', key, enc.encode('admin-session'))
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function makeSessionToken(): Promise<string> {
  return computeToken()
}

export async function verifyToken(token: string): Promise<boolean> {
  return token === (await computeToken())
}
