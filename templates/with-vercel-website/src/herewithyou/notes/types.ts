export type Note = {
  body: string
  createdAt: string
  id: string
  /** `seed` notes ship with the prototype; `local` notes were written in this browser. */
  source: 'local' | 'seed'
}
