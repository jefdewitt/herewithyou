import type { Metadata } from 'next'

import { Wordmark } from '@/herewithyou/components/Wordmark'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
  title: 'Need immediate help? · Here With You',
}

export default function HelpPage() {
  return (
    <>
      <Wordmark />
      <section className="hwy-help">
        <h1 className="hwy-heading">If you need help right now</h1>
        <p>
          Here With You is a place for kind words between strangers. It isn’t crisis support, and
          nobody here is watching in real time.
        </p>
        <p>
          If you are in immediate danger, or thinking about hurting yourself, please reach out to
          someone who can help right now:
        </p>
        <ul className="hwy-help__list">
          <li>
            <strong>Emergency:</strong> call your local emergency number (911 in the US and Canada,
            999 in the UK, 112 in the EU).
          </li>
          <li>
            <strong>US:</strong> call or text <a href="tel:988">988</a> to reach the 988 Suicide
            &amp; Crisis Lifeline.
          </li>
          <li>
            <strong>UK &amp; Ireland:</strong> call Samaritans on{' '}
            <a href="tel:116123">116&nbsp;123</a>.
          </li>
          <li>
            <strong>Anywhere else:</strong>{' '}
            <a href="https://findahelpline.com" rel="noopener noreferrer" target="_blank">
              findahelpline.com
              <span className="hwy-visually-hidden"> (opens in a new tab)</span>
            </a>{' '}
            lists free, confidential helplines by country.
          </li>
        </ul>
        <p>
          Notes from strangers can help a little, but they aren’t a replacement for a doctor,
          therapist, or someone you trust.
        </p>
        <div className="hwy-actions">
          <Link className="hwy-button hwy-button--quiet" href="/">
            Return home
          </Link>
        </div>
      </section>
    </>
  )
}
