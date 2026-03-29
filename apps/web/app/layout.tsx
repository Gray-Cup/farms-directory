import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'Gray Farms — Coffee & Tea Estates in India',
  description: 'A curated directory of coffee and tea farms across India.',
  openGraph: {
    title: 'Gray Farms',
    description: 'Discover coffee and tea farms across India.',
    images: [{ url: '/gray-farms-og.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/gray-farms-og.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Analytics />
        {children}
      </body>
    </html>
  )
}
