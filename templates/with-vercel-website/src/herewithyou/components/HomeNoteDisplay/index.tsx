'use client'

import type { Note } from '@/herewithyou/notes/types'

import { Letter } from '@/herewithyou/components/Letter'
import { getNextNote } from '@/herewithyou/notes/noteStore'
import React, { useEffect, useState } from 'react'

export function HomeNoteDisplay() {
  const [note, setNote] = useState<Note | null>(null)

  useEffect(() => {
    try {
      const randomNote = getNextNote('anything')
      setNote(randomNote)
    } catch {
      // If no notes are available, gracefully degrade to showing nothing
      setNote(null)
    }
  }, [])

  if (!note) {
    return null
  }

  return <Letter body={note.body} aria-label="A stranger left this for you" />
}
