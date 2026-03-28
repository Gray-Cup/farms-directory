'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: {
        sitekey: string
        callback: (token: string) => void
        'error-callback': () => void
        theme?: string
      }) => string
      remove: (widgetId: string) => void
    }
  }
}

interface ContactInfo {
  phone: string | null
  email: string | null
}

type State = 'idle' | 'showing' | 'verifying' | 'done' | 'error'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

export default function TurnstileGate({ farmId }: { farmId: string }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''
  const [state, setState] = useState<State>('idle')
  const [contact, setContact] = useState<ContactInfo | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  // Check sessionStorage cache on mount
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(`contact:${farmId}`)
      if (cached) {
        setContact(JSON.parse(cached) as ContactInfo)
        setState('done')
      }
    } catch {
      // sessionStorage unavailable
    }
  }, [farmId])

  const handleToken = useCallback(async (token: string) => {
    setState('verifying')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmId, token }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json() as ContactInfo
      setContact(data)
      try {
        sessionStorage.setItem(`contact:${farmId}`, JSON.stringify(data))
      } catch { /* ignore */ }
      setState('done')
    } catch {
      setState('error')
    }
  }, [farmId])

  // Render Turnstile widget when state transitions to 'showing'
  useEffect(() => {
    if (state !== 'showing' || !containerRef.current) return

    const renderWidget = () => {
      if (!containerRef.current || !window.turnstile) return
      if (widgetIdRef.current) return // already rendered
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: handleToken,
        'error-callback': () => setState('error'),
        theme: 'light',
      })
    }

    if (window.turnstile) {
      renderWidget()
    } else {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
      if (existing) {
        existing.addEventListener('load', renderWidget)
        return () => existing.removeEventListener('load', renderWidget)
      }
      const script = document.createElement('script')
      script.src = SCRIPT_SRC
      script.async = true
      script.onload = renderWidget
      document.head.appendChild(script)
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [state, siteKey, handleToken])

  if (state === 'done' && contact) {
    const hasContact = contact.phone || contact.email
    if (!hasContact) {
      return <p className="contact-none">No contact info on file.</p>
    }
    return (
      <div className="contact-info">
        {contact.phone && (
          <a href={`tel:${contact.phone}`} className="contact-row">
            <span className="contact-icon">📞</span>{contact.phone}
          </a>
        )}
        {contact.email && (
          <a href={`mailto:${contact.email}`} className="contact-row">
            <span className="contact-icon">✉</span>{contact.email}
          </a>
        )}
      </div>
    )
  }

  if (state === 'verifying') {
    return <p className="contact-status">Verifying…</p>
  }

  if (state === 'error') {
    return (
      <button className="contact-reveal-btn" onClick={() => { widgetIdRef.current = null; setState('showing') }}>
        Retry verification
      </button>
    )
  }

  if (state === 'showing') {
    return <div ref={containerRef} className="contact-turnstile" />
  }

  // idle
  return (
    <button className="contact-reveal-btn" onClick={() => setState('showing')}>
      View contact info
    </button>
  )
}
