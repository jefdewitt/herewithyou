import { Wordmark } from '@/herewithyou/components/Wordmark'
import Link from 'next/link'
import React from 'react'

export default function HomePage() {
  return (
    <div className="hwy-home">
      <Wordmark isLink={false} />
      <h1 className="hwy-display">A stranger left this for you.</h1>
      <p className="hwy-lede">
        Sometimes a few words from someone who’s been there can make the world feel a little less
        lonely.
      </p>
      <div className="hwy-actions">
        <Link className="hwy-button hwy-button--primary" href="/receive">
          I could use a kind word
        </Link>
        <Link className="hwy-button hwy-button--quiet" href="/leave">
          I want to leave one for someone else
        </Link>
      </div>
    </div>
  )
}
