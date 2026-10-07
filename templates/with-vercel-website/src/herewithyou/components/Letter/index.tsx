import React from 'react'

/** Renders a note on paper. Blank lines in the body become paragraphs. */
export function Letter({
  body,
  ref,
  ...rest
}: { body: string; ref?: React.Ref<HTMLElement> } & React.HTMLAttributes<HTMLElement>) {
  const paragraphs = body.split(/\n\s*\n/).filter((paragraph) => paragraph.trim().length > 0)

  return (
    <article className="hwy-letter" ref={ref} {...rest}>
      <div className="hwy-letter__body">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  )
}
