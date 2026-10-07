import type { Metadata } from 'next'

import { LeaveNoteForm } from '@/herewithyou/components/LeaveNoteForm'
import { Wordmark } from '@/herewithyou/components/Wordmark'
import React from 'react'

export const metadata: Metadata = {
  title: 'Leave a note · Here With You',
}

export default function LeavePage() {
  return (
    <>
      <Wordmark />
      <LeaveNoteForm />
    </>
  )
}
