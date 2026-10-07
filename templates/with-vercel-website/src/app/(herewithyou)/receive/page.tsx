import type { Metadata } from 'next'

import { ReceiveNote } from '@/herewithyou/components/ReceiveNote'
import { Wordmark } from '@/herewithyou/components/Wordmark'
import React from 'react'

export const metadata: Metadata = {
  title: 'A note for you · Here With You',
}

export default function ReceivePage() {
  return (
    <>
      <Wordmark />
      <ReceiveNote />
    </>
  )
}
