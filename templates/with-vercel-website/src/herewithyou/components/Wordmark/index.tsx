import Link from 'next/link'
import React from 'react'

export function Wordmark({ isLink = true }: { isLink?: boolean }) {
  if (!isLink) {
    return <p className="hwy-wordmark">Here With You</p>
  }

  return (
    <header>
      <Link className="hwy-wordmark" href="/">
        Here With You
      </Link>
    </header>
  )
}
