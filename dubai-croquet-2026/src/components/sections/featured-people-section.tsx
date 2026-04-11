import Image from 'next/image'
import { Markdown } from '@/components/markdown'
import { SectionActions } from '@/components/sections/section-actions'
import { SectionShell } from '@/components/sections/section-shell'
import { cn } from '@/lib/utils'
import type { FeaturedPeopleSectionData, SectionTeamMember } from '@/components/sections/types'

type FeaturedPeopleSectionProps = FeaturedPeopleSectionData & {
  resolvedPeople?: SectionTeamMember[]
}

export function FeaturedPeopleSection({
  colors,
  width,
  title,
  subtitle,
  variant,
  actions,
  resolvedPeople = [],
}: FeaturedPeopleSectionProps) {
  return (
    <SectionShell colors={colors} width={width}>
      <div className="space-y-10">
        {(title || subtitle || (actions?.length ?? 0) > 0) && (
          <div className="space-y-4">
            <div className="max-w-3xl space-y-4">
              {title ? <h2 className="font-display text-4xl md:text-5xl">{title}</h2> : null}
              {subtitle ? <p className="text-lg leading-8 text-muted-foreground md:text-xl">{subtitle}</p> : null}
            </div>
            <SectionActions actions={actions} />
          </div>
        )}

        <div
          className={cn(
            'grid gap-x-8 gap-y-10',
            variant === 'variant-b' ? 'lg:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3',
          )}
        >
          {resolvedPeople.map((person) => {
            const fullName = [person.firstName, person.lastName].filter(Boolean).join(' ').trim()
            return (
              <article
                key={person.slug ?? fullName}
                className={cn(variant === 'variant-b' ? 'sm:flex sm:items-start' : 'space-y-5')}
              >
                {person.image?.src ? (
                  <div className={cn(variant === 'variant-b' ? 'w-full sm:w-1/3 sm:flex-shrink-0' : '')}>
                    <Image
                      src={person.image.src}
                      alt={person.image.alt ?? fullName ?? 'Dubai Croquet Club member'}
                      width={720}
                      height={720}
                      className="aspect-square w-full object-cover object-top"
                    />
                  </div>
                ) : null}
                <div className={cn('space-y-3', variant === 'variant-b' && person.image?.src ? 'pt-6 sm:pl-6 sm:pt-0' : '')}>
                  {fullName ? <h3 className="font-display text-3xl">{fullName}</h3> : null}
                  {person.role ? <p className="text-base text-muted-foreground">{person.role}</p> : null}
                  {person.bio ? <Markdown content={person.bio} /> : null}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </SectionShell>
  )
}
