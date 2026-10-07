'use client'

import type { Note } from '@/herewithyou/notes/types'

import { Letter } from '@/herewithyou/components/Letter'
import { getNextNote } from '@/herewithyou/notes/noteStore'
import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'

export function ReceiveNote() {
  const [note, setNote] = useState<Note | null>(null)
  const letterRef = useRef<HTMLElement>(null)
  const shouldFocusLetterRef = useRef(false)

  useEffect(() => {
    setNote(getNextNote())
  }, [])

  useEffect(() => {
    if (note && shouldFocusLetterRef.current) {
      letterRef.current?.focus()
      shouldFocusLetterRef.current = false
    }
  }, [note])

  const readAnother = useCallback(() => {
    shouldFocusLetterRef.current = true
    setNote(getNextNote())
  }, [])

  return (
    <div className="hwy-receive">
      <h1 className="hwy-visually-hidden">A note from a stranger</h1>
      {note ? (
        <Letter
          aria-label="A note from a stranger"
          body={note.body}
          key={note.id}
          ref={letterRef}
          tabIndex={-1}
        />
      ) : (
        <div aria-hidden="true" className="hwy-letter hwy-letter--placeholder" />
      )}
      <div className="hwy-actions">
        <button className="hwy-button hwy-button--primary" onClick={readAnother} type="button">
          Read another note
        </button>
        <Link className="hwy-button hwy-button--quiet" href="/leave">
          Leave one for someone else
        </Link>
      </div>
    </div>
  )
}
