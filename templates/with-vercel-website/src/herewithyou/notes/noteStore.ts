/**
 * Prototype note persistence backed by localStorage.
 *
 * Everything outside this module talks to notes through `getNextNote` and `addNote`,
 * so this file can later be swapped for Payload/server persistence without touching the UI.
 */
import type { Note } from './types'

import { seedNotes } from './seedNotes'

export const NOTE_MIN_LENGTH = 20
export const NOTE_MAX_LENGTH = 1200

const localNotesKey = 'hwy:local-notes'
const recentlyShownKey = 'hwy:recently-shown'

export function getAllNotes(): Note[] {
  return [...seedNotes, ...readJSON<Note[]>({ fallback: [], key: localNotesKey })]
}

/** Picks a random note, avoiding the ones this browser has seen most recently. */
export function getNextNote(topic: string | 'anything'): Note {
  const notes = getAllNotes()
  const topicNotes = topic === 'anything' ? notes : notes.filter((note) => note.topic === topic)
  const recentlyShownIds = readJSON<string[]>({ fallback: [], key: recentlyShownKey })
  // Keep a window large enough to avoid repeats, but small enough that every note stays in rotation.
  const avoidWindow = Math.min(Math.floor(topicNotes.length / 2), 10)
  const avoidIds = new Set(recentlyShownIds.slice(-avoidWindow))
  const candidates = topicNotes.filter((note) => !avoidIds.has(note.id))
  const pool = candidates.length > 0 ? candidates : topicNotes
  const note = pool[Math.floor(Math.random() * pool.length)]!

  markRecentlyShown({ id: note.id })

  return note
}

export type NoteValidationResult = { error: string; isValid: false } | { isValid: true }

export function validateNoteBody({ body }: { body: string }): NoteValidationResult {
  const trimmedBody = body.trim()

  if (trimmedBody.length < NOTE_MIN_LENGTH) {
    return {
      error: `A few more words, please — at least ${NOTE_MIN_LENGTH} characters.`,
      isValid: false,
    }
  }

  if (trimmedBody.length > NOTE_MAX_LENGTH) {
    return { error: `Please keep it under ${NOTE_MAX_LENGTH} characters.`, isValid: false }
  }

  if (/(https?:\/\/|www\.)\S+/i.test(trimmedBody)) {
    return { error: 'Please leave out links. Just your words is enough.', isValid: false }
  }

  return { isValid: true }
}

/**
 * Saves a note so it can be received by the next reader.
 *
 * TODO(before launch): anonymous public submissions MUST go through server-side moderation
 * (automated screening plus human review) before any other person can receive them.
 * This prototype only stores notes in the writer's own browser and does basic client-side checks.
 */
export function addNote({
  body,
  topic,
  signature,
}: {
  body: string
  topic: string
  signature?: string
}): Note {
  const validation = validateNoteBody({ body })

  if (!validation.isValid) {
    throw new Error(validation.error)
  }

  const note: Note = {
    id: `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    body: body.trim(),
    createdAt: new Date().toISOString(),
    source: 'local',
    topic,
    signature: signature ? signature.trim() : undefined,
  }

  const localNotes = readJSON<Note[]>({ fallback: [], key: localNotesKey })

  writeJSON({ key: localNotesKey, value: [...localNotes, note] })
  // Don't hand writers their own note on their very next read; it joins the rotation after that.
  markRecentlyShown({ id: note.id })

  return note
}

function markRecentlyShown({ id }: { id: string }): void {
  const recentlyShownIds = readJSON<string[]>({ fallback: [], key: recentlyShownKey })
  const updatedIds = [...recentlyShownIds.filter((shownId) => shownId !== id), id].slice(-20)

  writeJSON({ key: recentlyShownKey, value: updatedIds })
}

function readJSON<T>({ fallback, key }: { fallback: T; key: string }): T {
  try {
    const raw = window.localStorage.getItem(key)

    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJSON({ key, value }: { key: string; value: unknown }): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be unavailable (private mode, quota). The prototype degrades to seed notes only.
  }
}
