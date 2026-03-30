'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SubmitDialog from './SubmitDialog'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark') {
      document.documentElement.classList.add('dark')
      setDark(true)
    }
  }, [])

  function toggleTheme() {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <>
      <header>
        <div className="navbar-inner">
          {/* LEFT */}
          <div className="navbar-left">
            <Link href="/" className="navbar-brand">
              {/* <Image src="/grayfarms.svg" alt="Gray Farms" width={32} height={18} draggable={false} priority /> */}
              Gray Farms
            </Link>
            <span className="navbar-sep" aria-hidden>|</span>
            <nav className="navbar-links">
              <Link href="/pages">Pages</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/sitemap">Sitemap</Link>
              <Link href="/about">About</Link>
              <Link href="/impressum">Impressum</Link>
            </nav>
          </div>

          {/* RIGHT */}
          <div className="navbar-right">
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <SubmitDialog />
            <a
              href="https://graycup.org"
              target="_blank"
              rel="noopener noreferrer"
              className="graycup-btn"
            >
              Visit Gray Cup
            </a>
            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className={`mobile-overlay${menuOpen ? ' open' : ''}`}>
        <div className="mobile-backdrop" onClick={() => setMenuOpen(false)} />
        <aside className={`mobile-drawer${menuOpen ? ' open' : ''}`}>
          <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>
          <nav className="mobile-nav">
            <Link href="/pages" onClick={() => setMenuOpen(false)}>Pages</Link>
            <Link href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
            <Link href="/sitemap" onClick={() => setMenuOpen(false)}>Sitemap</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/impressum" onClick={() => setMenuOpen(false)}>Impressum</Link>
            <SubmitDialog />
          </nav>
          <div className="mobile-actions">
            <a
              href="https://graycup.org"
              target="_blank"
              rel="noopener noreferrer"
              className="graycup-btn"
              onClick={() => setMenuOpen(false)}
            >
              Visit Gray Cup
            </a>
          </div>
        </aside>
      </div>
    </>
  )
}
