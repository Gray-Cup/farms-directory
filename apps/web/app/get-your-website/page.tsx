export const metadata = {
  title: 'Get Your Website Built by Gray Cup',
}

export default function GetYourWebsitePage() {
  return (
    <div className="layout" style={{ display: 'block' }}>
      <div className="form-page">
        <a href="/" className="back">← Back</a>
        <h2>Get Your Website Built by Gray Cup</h2>
        <p style={{ fontSize: 'var(--text-small)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          We build fast, beautiful, and purposeful websites for farms, businesses, and creators.
          Whether you need a simple landing page or a full directory like this one — we&apos;ve got you.
        </p>
        <p style={{ fontSize: 'var(--text-small)', lineHeight: 1.7, marginBottom: '2rem' }}>
          Reach out at{' '}
          <a href="https://graycup.com" target="_blank" rel="noopener noreferrer">
            graycup.com
          </a>{' '}
          and let&apos;s build something together.
        </p>
        <a
          href="https://graycup.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-submit"
          style={{ display: 'inline-block', textDecoration: 'none' }}
        >
          Visit Gray Cup →
        </a>
      </div>
    </div>
  )
}
