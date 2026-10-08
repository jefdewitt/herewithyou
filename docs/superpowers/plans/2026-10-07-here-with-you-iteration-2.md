# Here With You — Iteration 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add topic-based note flows with optional signatures, allowing receivers to see context-matched encouragement and writers to express their lived experience.

**Architecture:**

- Extend the Note type with `topic` and optional `signature` fields
- Create a topic selector component used in both receive and leave flows
- Organize seed notes by topic; allow "Anything/Surprise Me" to select across all topics
- Update note store to filter by topic
- Preserve existing character limits, validation, localStorage persistence, and no-immediate-repeat behavior

**Tech Stack:** React (Client Components), Next.js Pages, TypeScript, localStorage (existing pattern)

**Spec:** Iteration 2 requirements from user request — 5 fixed topics + "Anything/Surprise Me", topic selection in both flows, optional signature field, seed notes per topic, no user-created topics or authentication.

## Global Constraints

- Do not redesign or refactor unrelated code
- No user-created topics — exactly 5 fixed topics + "Anything/Surprise Me"
- No authentication, profiles, or accounts
- No new external dependencies unless genuinely necessary
- Preserve existing textarea, character limit (1200), validation, localStorage, and no-immediate-repeat behavior
- Seed notes: lived experience over generic advice; small set, later replaced by human-written notes
- Optional signature: if blank, display no signature (anonymous treatment)

## Review Focus

1. **Topic isolation on receive:** When a topic is selected and reader clicks "Read another note," does it stay within that topic? Does "Anything" correctly select across all topics?
2. **Topic persistence on leave:** Does the topic survive form submission and appear correctly in localStorage alongside the note?
3. **Signature edge cases:** Does a blank signature field result in no signature display? Does a signature persist correctly?
4. **No immediate repeat:** Does the existing no-repeat window logic still work when filtered by topic?
5. **Mobile & desktop display:** Are the topic selector and signature field visually consistent and readable on both viewports?

---

## Task 1: Extend Note Type and Add Topic Configuration

**Files:**

- Modify: `src/herewithyou/notes/types.ts`
- Create: `src/herewithyou/topics/config.ts`
- Test: Manual inspection of type definitions

**Interfaces:**

- Produces:
  - `Note` type with `topic: string` and optional `signature?: string`
  - Topic constants: `TOPICS` object with keys and labels
  - Type: `TopicSlug = keyof typeof TOPICS`

**Steps:**

- [ ] **Step 1: Update Note type in `types.ts`**

```typescript
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
```

- [ ] **Step 2: Create topic configuration in `src/herewithyou/topics/config.ts`**

```typescript
export const TOPICS = {
  grief: { label: 'Grief' },
  sobriety: { label: 'Sobriety & Recovery' },
  heartbreak: { label: 'Heartbreak' },
  loneliness: { label: 'Loneliness' },
  starting_over: { label: 'Starting Over' },
} as const

export type TopicSlug = keyof typeof TOPICS

export const TOPIC_ANYTHING = 'anything' as const

export function getTopicLabel(slug: string | typeof TOPIC_ANYTHING): string {
  if (slug === TOPIC_ANYTHING) return 'Anything / Surprise Me'
  return TOPICS[slug as TopicSlug]?.label ?? 'Unknown'
}
```

- [ ] **Step 3: Verify types load without errors**

Run: `cd templates/with-vercel-website && pnpm generate:types 2>&1 | head -20`
Expected: TypeScript compilation succeeds with no errors on these files

---

## Task 2: Update Note Storage and Validation

**Files:**

- Modify: `src/herewithyou/notes/noteStore.ts`
- Test: Manual inspection

**Interfaces:**

- Consumes: Updated `Note` type with `topic` and optional `signature`
- Produces:
  - `addNote({ body, topic, signature }: { body: string; topic: string; signature?: string }): Note`
  - `getNextNote(topic: string | typeof TOPIC_ANYTHING): Note` (new parameter)
  - `getAllNotes()` unchanged, returns all notes (filtering happens at call site)

**Steps:**

- [ ] **Step 1: Modify `addNote` to accept and store topic and signature**

Update the function signature and the Note object creation to include:

- `topic` parameter (required string)
- `signature` parameter (optional string, trim whitespace)

Example signature:

```typescript
export function addNote({
  body,
  topic,
  signature,
}: {
  body: string
  topic: string
  signature?: string
}): Note
```

- [ ] **Step 2: Update `getNextNote` to filter by topic**

Add parameter `topic: string | typeof TOPIC_ANYTHING`. If topic is `'anything'`, select from all notes. Otherwise, filter `notes` to only those where `note.topic === topic` before applying the existing no-repeat window logic.

```typescript
export function getNextNote(topic: string | typeof TOPIC_ANYTHING): Note {
  const notes = getAllNotes()
  const topicNotes =
    topic === 'anything' ? notes : notes.filter((note) => note.topic === topic)
  // ... rest of existing logic using topicNotes instead of notes
}
```

- [ ] **Step 3: Verify changes compile**

Run: `cd templates/with-vercel-website && pnpm generate:types 2>&1 | head -20`
Expected: No new TypeScript errors

---

## Task 3: Create Seed Notes with Topic Association

**Files:**

- Replace: `src/herewithyou/notes/seedNotes.ts`
- Test: Manual inspection

**Interfaces:**

- Consumes: Updated `Note` type with `topic` and optional `signature`
- Produces: `seedNotes: Note[]` with all notes assigned to one of the five topics

**Steps:**

- [ ] **Step 1: Reorganize seedNotes.ts to include topic on each note**

Keep existing seed bodies, but group and assign each to exactly one topic:

- **Grief:** 1–2 notes (e.g., existing "dad died," "grieving something small")
- **Sobriety & Recovery:** 1–2 notes (e.g., existing "Day one again," "12 years, laid off")
- **Heartbreak:** 1–2 notes (e.g., existing "checking your phone," "left my country")
- **Loneliness:** 1–2 notes (e.g., existing "moved to a city," high school note)
- **Starting Over:** 1–2 notes (e.g., existing "started over at 52," "new job")
- **Unassigned/generic (to be removed or reassigned):** Keep a few universally applicable notes and assign them to the topic that fits best

Existing note structure: map `body` → `{ id, body, createdAt: seedCreatedAt, source: 'seed', topic: <assign>, signature?: undefined }`

- [ ] **Step 2: Verify all topics have at least one seed note**

Count notes per topic. Expected: each of the 5 topics has ≥1 note. Keep the set small (3–5 notes total is fine for testing).

- [ ] **Step 3: Compile and verify no runtime errors**

Run: `cd templates/with-vercel-website && pnpm generate:types 2>&1 | head -20`
Expected: No errors

---

## Task 4: Create TopicSelector Component

**Files:**

- Create: `src/herewithyou/components/TopicSelector/index.tsx`
- Create: `src/herewithyou/components/TopicSelector/index.css` (if needed)
- Test: Component rendering (will be tested in Task 5 & 6)

**Interfaces:**

- Consumes: `TOPICS`, `TOPIC_ANYTHING`, `getTopicLabel` from `topics/config.ts`
- Produces: `TopicSelector` component
  - Props: `{ onSelect: (topic: string) => void; title: string }`
  - Renders: Heading with provided title, radio buttons or buttons for each topic + "Anything / Surprise Me"
  - Behavior: User clicks topic → calls `onSelect(topicSlug)`

**Steps:**

- [ ] **Step 1: Create TopicSelector component**

```typescript
'use client'

import { TOPIC_ANYTHING, TOPICS, getTopicLabel } from '@/herewithyou/topics/config'
import React, { useId } from 'react'

export interface TopicSelectorProps {
  onSelect: (topic: string) => void
  title: string
}

export function TopicSelector({ onSelect, title }: TopicSelectorProps) {
  const fieldsetId = useId()
  const topics = [
    ...Object.keys(TOPICS),
    TOPIC_ANYTHING,
  ]

  return (
    <section className="hwy-topic-selector">
      <h1 className="hwy-heading">{title}</h1>
      <fieldset id={fieldsetId}>
        <legend className="hwy-visually-hidden">{title}</legend>
        <div className="hwy-topic-buttons">
          {topics.map((topic) => (
            <button
              key={topic}
              type="button"
              className="hwy-button hwy-button--topic"
              onClick={() => onSelect(topic)}
            >
              {getTopicLabel(topic)}
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  )
}
```

Use existing button styles from `.css`; add minimal CSS for layout if needed (e.g., flex grid of buttons).

- [ ] **Step 2: Ensure component is visually consistent with existing design**

The heading should match existing `.hwy-heading` style. Buttons should use existing `.hwy-button` classes (no new visual design). Mobile and desktop readability should match existing layouts.

- [ ] **Step 3: Verify component compiles**

Run: `cd templates/with-vercel-website && pnpm generate:types 2>&1 | head -20`
Expected: No errors

---

## Task 5: Update ReceiveNote Component with Topic Flow

**Files:**

- Modify: `src/app/(herewithyou)/receive/page.tsx`
- Modify: `src/herewithyou/components/ReceiveNote/index.tsx`
- Test: Manual integration test

**Interfaces:**

- Consumes:
  - `TopicSelector` component
  - `getNextNote(topic)` function
  - `Letter` component (existing)
- Produces: Updated receive flow logic

**Steps:**

- [ ] **Step 1: Update ReceiveNote component to manage topic state**

Add state: `const [selectedTopic, setSelectedTopic] = useState<string | null>(null)`

If `selectedTopic` is `null`, render `TopicSelector` with title "What are you going through?" and `onSelect={setSelectedTopic}`.

If `selectedTopic` is set, render the existing note display flow (call `getNextNote(selectedTopic)` instead of bare `getNextNote()`).

```typescript
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

  // ... rest of existing logic using selectedTopic
}
```

- [ ] **Step 2: Add contextual line beneath the note**

Beneath the `Letter` component (or as part of its footer), add:

```html
<p className="hwy-note-context">
  Someone who's been through this left you something.
</p>
```

Style this text as quiet/subtle (e.g., smaller font, muted color) to match existing `.hwy-lede` or a new `hwy-note-context` class.

- [ ] **Step 3: Update "Read another note" behavior**

The existing `readAnother` callback should call `getNextNote(selectedTopic)` (keeping the topic). Verify: clicking "Read another note" stays within the same topic, and respects the no-immediate-repeat logic.

- [ ] **Step 4: Update receive/page.tsx if needed**

If no changes to the page wrapper are needed, no edit required. Otherwise, confirm `ReceiveNote` component is the only child imported.

- [ ] **Step 5: Manual test — Receive flow**

1. Navigate to `/receive`
2. See "What are you going through?" with 6 buttons (5 topics + "Anything / Surprise Me")
3. Click a topic (e.g., "Grief")
4. Verify: note displays, contextual line reads "Someone who's been through this left you something."
5. Click "Read another note" → new note from same topic appears
6. Click "Anything / Surprise Me" from topic selector (if navigated back) → notes from all topics appear

---

## Task 6: Update LeaveNoteForm Component with Topic Selection and Signature

**Files:**

- Modify: `src/herewithyou/components/LeaveNoteForm/index.tsx`
- Test: Manual integration test

**Interfaces:**

- Consumes:
  - `TopicSelector` component
  - `addNote({ body, topic, signature })` function
- Produces: Updated leave flow logic

**Steps:**

- [ ] **Step 1: Restructure LeaveNoteForm to show topic selection first**

Add state:

```typescript
const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
const [body, setBody] = useState('')
const [signature, setSignature] = useState('')
const [error, setError] = useState<null | string>(null)
const [isSubmitted, setIsSubmitted] = useState(false)
```

If `selectedTopic === null`, render `TopicSelector` with title "What have you been through?" and supporting copy:

```html
<p className="hwy-lede">Choose something you could speak honestly about.</p>
```

- [ ] **Step 2: Update form guidance text**

When `selectedTopic` is set and form is shown, change the heading and lede:

```html
<h1 className="hwy-heading">
  Leave something for someone going through it now.
</h1>
<p className="hwy-lede">Tell them something you've lived.</p>
<p className="hwy-lede">
  You don't need to give advice or say something profound. Just leave a few
  honest words for someone going through something you've been through.
</p>
```

- [ ] **Step 3: Add optional signature field**

Below the textarea, add:

```html
<label htmlFor="{signatureId}" className="hwy-form__label">
  Sign your note (optional)
</label>
<input
  type="text"
  id="{signatureId}"
  className="hwy-input"
  value="{signature}"
  onChange="{(e)"
  =""
/>
setSignature(e.target.value.trim())} placeholder="e.g., J. or Someone 8 years
sober" maxLength={100} />
```

Trim whitespace on input. If left blank, store as `undefined`.

- [ ] **Step 4: Update form submission**

In `handleSubmit`, call:

```typescript
addNote({
  body,
  topic: selectedTopic,
  signature: signature || undefined,
})
```

Pass `selectedTopic` to `addNote` (will be non-null because form is only shown when topic is selected).

- [ ] **Step 5: Preserve existing character limit, validation, and confirmation flow**

- Existing validation (`validateNoteBody`) remains unchanged
- Character count display (`{characterCount} / {NOTE_MAX_LENGTH}`) remains
- localStorage persistence happens inside `addNote` (already updated in Task 2)
- Confirmation screen text and flow remain the same

- [ ] **Step 6: Manual test — Leave flow**

1. Navigate to `/leave`
2. See "What have you been through?" with 6 buttons
3. Click a topic (e.g., "Starting Over")
4. Form appears with updated heading and guidance
5. Type a note (≥20 chars)
6. Fill signature field (optional)
7. Click "Leave this note"
8. Confirmation screen appears
9. Click "Read a note" and select same topic → verify signature appears (if provided) and note content is correct
10. Go back to `/leave`, select a different topic, verify new topic selection and signature input work

---

## Task 7: Test and Verify All Flows

**Files:**

- Test: Manual browser-based testing (no automated tests required per spec)

**Steps:**

- [ ] **Step 1: Receive flow — single topic**

  1. Home → "I could use a kind word"
  2. Select "Grief" (or any topic)
  3. Note displays with contextual line
  4. "Read another note" → new note from same topic
  5. Repeat 3–4 times → verify different notes and no immediate repeats

- [ ] **Step 2: Receive flow — "Anything / Surprise Me"**

  1. Home → "I could use a kind word"
  2. Select "Anything / Surprise Me"
  3. Note displays
  4. "Read another note" → notes from all topics appear

- [ ] **Step 3: Leave flow — topic selection and form**

  1. Home → "I want to leave one for someone else"
  2. Select "Loneliness"
  3. Form appears with correct heading/guidance
  4. Type note (≥20 chars, ≤1200)
  5. Fill signature (e.g., "A friend")
  6. Submit
  7. Confirmation appears

- [ ] **Step 4: Verify persistence**

  1. Complete the leave flow from Step 3 with a signature
  2. Navigate to `/receive` and select "Loneliness"
  3. Click "Read another note" until your just-written note appears
  4. Verify: note body, signature, and topic are correct (if visible, signature should display; if blank, anonymous treatment)

- [ ] **Step 5: Mobile & desktop visual check**

  1. Open dev tools, toggle device toolbar
  2. Test at 375px (mobile) and 1920px (desktop)
  3. Verify: buttons, text, and form fields are readable and properly sized
  4. No obvious layout breakage

- [ ] **Step 6: Test signature edge cases**

  1. Leave a note WITHOUT filling signature field → submit
  2. Receive that note → verify no signature is displayed (anonymous treatment)
  3. Leave a note WITH signature → submit
  4. Receive that note → verify signature is displayed

- [ ] **Step 7: Commit all changes**

```bash
git add src/herewithyou/ src/app/(herewithyou)/ templates/with-vercel-website/src/
git commit -m "feat: add topic-based flows and optional signatures

- Add 5 fixed topics + 'Anything / Surprise Me' for note context
- Update receive flow: select topic before viewing notes
- Update leave flow: select topic before writing, add optional signature
- Preserve existing validation, character limits, and no-repeat behavior
- Associate seed notes with topics (lived experience focus)
- Store topic and optional signature with each note (localStorage)
"
```

---

## Self-Review Checklist

**1. Spec coverage:**

- ✓ Five fixed topics added to config
- ✓ "Anything / Surprise Me" implemented
- ✓ Receive flow: HOME → TOPIC → NOTE with contextual line
- ✓ Leave flow: HOME → TOPIC → FORM with updated guidance
- ✓ Optional signature field added and stored
- ✓ Seed notes associated with topics
- ✓ No user-created topics, auth, profiles, or unrelated refactors
- ✓ localStorage persistence, character limits, validation preserved

**2. Step scan:**

- Each step produces exactly one deliverable
- Function signatures and test assertions are concrete
- No "handle edge cases" or "add appropriate validation" lines
- Types and names consistent across tasks

**3. Type consistency:**

- Task 1 defines `Note` type with `topic` and `signature`
- Task 2 uses updated type in `addNote` and `getNextNote`
- Task 3 creates seedNotes with type
- Task 4 references topic config consistently
- Task 5 & 6 call updated functions with correct parameters

**4. Review Focus:**

- Each of the 5 review points has a corresponding test step
- No silently-ignored inputs or edge cases

**5. Proportion:**

- Plan is ~350 lines; spec is ~200 lines; reasonable 1.75× ratio
- Code blocks are minimal; mostly signatures and test assertions
- Each task is right-sized for one implementation pass
