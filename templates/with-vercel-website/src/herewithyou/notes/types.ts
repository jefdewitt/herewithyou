export type Note = {
  body: string
  createdAt: string
  id: string
  /** `seed` notes ship with the prototype; `local` notes were written in this browser. */
  source: 'local' | 'seed'
  /** Topic this note belongs to */
  topic: string
  /** Optional signature/attribution left by the writer */
  signature?: string
}
