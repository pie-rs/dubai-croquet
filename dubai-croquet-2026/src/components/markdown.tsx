/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import rehypeRaw from 'rehype-raw'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

type MarkdownProps = {
  content?: string
  className?: string
}

export function Markdown({ content, className }: MarkdownProps) {
  if (!content) {
    return null
  }

  return (
    <div className={cn('rich-text', className)}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) =>
            href ? (
              <Link
                href={href}
                className="font-medium underline underline-offset-2 hover:no-underline"
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
              >
                {children}
              </Link>
            ) : (
              <>{children}</>
            ),
          img: ({ src, alt }) => (
            <img
              src={src ?? ''}
              alt={alt ?? ''}
              className="my-8 h-auto max-w-full border border-border bg-card object-cover"
            />
          ),
          p: ({ children }) => <p className="text-base leading-8 text-inherit">{children}</p>,
          h2: ({ children }) => <h2 className="font-display text-4xl text-inherit md:text-5xl">{children}</h2>,
          h3: ({ children }) => <h3 className="font-display text-2xl text-inherit md:text-3xl">{children}</h3>,
          h4: ({ children }) => <h4 className="text-xl font-semibold text-inherit">{children}</h4>,
          ul: ({ children }) => <ul className="list-disc space-y-2 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-2 pl-5">{children}</ol>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-current pl-5 text-xl leading-8 italic">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
