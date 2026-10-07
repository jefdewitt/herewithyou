import type { Metadata, Viewport } from 'next'

import { Newsreader } from 'next/font/google'
import Link from 'next/link'
import React from 'react'

import './styles.css'

const newsreader = Newsreader({
  display: 'swap',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-newsreader',
})

export const metadata: Metadata = {
  description: 'Anonymous notes from strangers, for strangers going through something hard.',
  title: 'Here With You',
}

export const viewport: Viewport = {
  themeColor: '#f3ece0',
}

export default function HereWithYouLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={newsreader.variable} lang="en">
      <body className="hwy">
        <a className="hwy-skip-link" href="#main">
          Skip to content
        </a>
        <div className="hwy-page">
          <main className="hwy-main" id="main">
            {children}
          </main>
          <footer className="hwy-footer">
            <Link className="hwy-footer__link" href="/help">
              Need immediate help?
            </Link>
          </footer>
        </div>
      </body>
    </html>
  )
}
