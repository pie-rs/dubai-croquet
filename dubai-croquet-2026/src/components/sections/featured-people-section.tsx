import Image from 'next/image'
import { Markdown } from '@/components/markdown'
import { SectionActions } from '@/components/sections/section-actions'
import { SectionShell } from '@/components/sections/section-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FeaturedPeopleSectionData, SectionTeamMember } from '@/components/sections/types'

type FeaturedPeopleSectionProps = FeaturedPeopleSectionData & {
  resolvedPeople?: SectionTeamMember[]
}

export function FeaturedPeopleSection({
  colors,
  width,
  title,
  subtitle,
  actions,
  resolvedPeople = [],
}: FeaturedPeopleSectionProps) {
  return (
    <SectionShell colors={colors} width={width}>
      <div className="space-y-10">
        {(title || subtitle || (actions?.length ?? 0) > 0) && (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              {title ? <h2 className="font-display text-4xl md:text-5xl">{title}</h2> : null}
              {subtitle ? <p className="text-lg leading-8 text-muted-foreground md:text-xl">{subtitle}</p> : null}
            </div>
            <SectionActions actions={actions} className="sm:justify-end" />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {resolvedPeople.map((person) => {
            const fullName = [person.firstName, person.lastName].filter(Boolean).join(' ').trim()
            return (
              <Card key={person.slug ?? fullName} className="rounded-none border border-border/60 bg-background/30 py-0">
                {person.image?.src ? (
                  <div className="border-b border-border/60">
                    <Image
                      src={person.image.src}
                      alt={person.image.alt ?? fullName ?? 'Dubai Croquet Club member'}
                      width={720}
                      height={720}
                      className="aspect-square w-full object-cover object-top"
                    />
                  </div>
                ) : null}
                <CardHeader className="space-y-2 px-6 pt-6">
                  {fullName ? <CardTitle className="font-display text-3xl">{fullName}</CardTitle> : null}
                  {person.role ? <p className="text-sm uppercase tracking-[0.14em] text-muted-foreground">{person.role}</p> : null}
                </CardHeader>
                {person.bio ? (
                  <CardContent className="px-6 pb-6">
                    <Markdown content={person.bio} />
                  </CardContent>
                ) : null}
              </Card>
            )
          })}
        </div>
      </div>
    </SectionShell>
  )
}
