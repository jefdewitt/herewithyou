'use client'

import { addNote, NOTE_MAX_LENGTH, validateNoteBody } from '@/herewithyou/notes/noteStore'
import Link from 'next/link'
import React, { useEffect, useId, useRef, useState } from 'react'

export function LeaveNoteForm() {
  const [body, setBody] = useState('')
  const [error, setError] = useState<null | string>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const confirmationHeadingRef = useRef<HTMLHeadingElement>(null)
  const textareaId = useId()
  const promptId = useId()
  const countId = useId()
  const errorId = useId()

  const characterCount = body.trim().length
  const isNearLimit = characterCount > NOTE_MAX_LENGTH * 0.9

  useEffect(() => {
    if (isSubmitted) {
      confirmationHeadingRef.current?.focus()
    }
  }, [isSubmitted])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validation = validateNoteBody({ body })

    if (!validation.isValid) {
      setError(validation.error)
      return
    }

    addNote({ body })
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <section className="hwy-confirmation">
        <h1 className="hwy-heading" ref={confirmationHeadingRef} tabIndex={-1}>
          Your note is waiting for someone who might need it.
        </h1>
        <p className="hwy-lede">Thank you.</p>
        <div className="hwy-actions">
          <Link className="hwy-button hwy-button--primary" href="/receive">
            Read a note
          </Link>
          <Link className="hwy-button hwy-button--quiet" href="/">
            Return home
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="hwy-leave">
      <h1 className="hwy-heading">Leave something for the next person who needs it.</h1>
      <p className="hwy-lede" id={promptId}>
        Write what you might have needed to hear during one of the harder periods of your own life.
      </p>
      <form className="hwy-form" noValidate onSubmit={handleSubmit}>
        <label className="hwy-visually-hidden" htmlFor={textareaId}>
          Your note
        </label>
        <div className="hwy-paper-field">
          <textarea
            aria-describedby={`${promptId} ${countId}${error ? ` ${errorId}` : ''}`}
            aria-invalid={error ? true : undefined}
            className="hwy-textarea"
            id={textareaId}
            maxLength={NOTE_MAX_LENGTH}
            onChange={(event) => {
              setBody(event.target.value)
              if (error) {
                setError(null)
              }
            }}
            placeholder="Hey stranger,"
            rows={10}
            value={body}
          />
        </div>
        <div className="hwy-form__meta">
          <p className="hwy-form__hint">No names, no sign-up. It stays anonymous.</p>
          <p
            className={`hwy-form__count${isNearLimit ? ' hwy-form__count--near' : ''}`}
            id={countId}
          >
            {characterCount} / {NOTE_MAX_LENGTH}
            <span className="hwy-visually-hidden"> characters</span>
          </p>
        </div>
        {error && (
          <p className="hwy-form__error" id={errorId} role="alert">
            {error}
          </p>
        )}
        <div className="hwy-actions">
          <button className="hwy-button hwy-button--primary" type="submit">
            Leave this note
          </button>
          <Link className="hwy-button hwy-button--quiet" href="/">
            Never mind
          </Link>
        </div>
      </form>
    </section>
  )
}
