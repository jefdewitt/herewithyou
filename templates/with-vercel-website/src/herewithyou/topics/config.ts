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
