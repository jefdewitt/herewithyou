'use client'

import { TOPIC_ANYTHING, TOPICS, getTopicLabel } from '@/herewithyou/topics/config'
import React, { useId } from 'react'

export interface TopicSelectorProps {
  onSelect: (topic: string) => void
  title: string
}

export function TopicSelector({ onSelect, title }: TopicSelectorProps) {
  const fieldsetId = useId()
  const topics = [...Object.keys(TOPICS), TOPIC_ANYTHING]

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
