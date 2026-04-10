import Link from 'next/link'
import { cn } from '@/lib/utils'

type Action = {
  label?: string
  url?: string
  style?: string
}

type SectionActionsProps = {
  actions?: Action[]
  className?: string
}

export function SectionActions({ actions = [], className }: SectionActionsProps) {
  const visibleActions = actions.filter((action) => action.label && action.url)
  if (visibleActions.length === 0) {
    return null
  }

  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row', className)}>
      {visibleActions.map((action) => (
        <Link
          key={`${action.url}-${action.label}`}
          href={action.url!}
          className={cn(
            action.style === 'link'
              ? 'legacy-link'
              : 'legacy-button rounded-none border-2 uppercase tracking-[0.16em]',
            action.style === 'secondary'
              ? 'border-current bg-transparent text-inherit'
              : action.style === 'link'
                ? 'text-inherit'
                : 'bg-primary text-primary-foreground border-primary',
          )}
        >
          {action.label}
        </Link>
      ))}
    </div>
  )
}
