'use client'

import type { Note } from '@/herewithyou/notes/types'

import { Letter } from '@/herewithyou/components/Letter'
import { TopicSelector } from '@/herewithyou/components/TopicSelector'
import { getNextNote } from '@/herewithyou/notes/noteStore'
import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'

export function ReceiveNote() {
  const [note, setNote] = useState<Note | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const letterRef = useRef<HTMLElement>(null)
  const shouldFocusLetterRef = useRef(false)

  useEffect(() => {
    if (selectedTopic !== null) {
      setNote(getNextNote(selectedTopic))
    }
  }, [selectedTopic])

  useEffect(() => {
    if (note && shouldFocusLetterRef.current) {
      letterRef.current?.focus()
      shouldFocusLetterRef.current = false
    }
  }, [note])

  const readAnother = useCallback(() => {
    shouldFocusLetterRef.current = true
    if (selectedTopic !== null) {
      setNote(getNextNote(selectedTopic))
    }
  }, [selectedTopic])

  return (
    <>
      {selectedTopic === null ? (
        <TopicSelector onSelect={setSelectedTopic} title="What are you going through?" />
      ) : (
        <div className="hwy-receive">
          <h1 className="hwy-visually-hidden">A note from a stranger</h1>
          {note ? (
            <>
              <Letter
                aria-label="A note from a stranger"
                body={note.body}
                key={note.id}
                ref={letterRef}
                tabIndex={-1}
              />
              <p className="hwy-note-context">
                Someone who's been through this left you something.
              </p>
            </>
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
      )}
    </>
  )
}
