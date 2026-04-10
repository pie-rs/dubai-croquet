import Image from 'next/image'
import { SectionShell } from '@/components/sections/section-shell'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { TestimonialsSectionData } from '@/components/sections/types'

export function TestimonialsSection({
  colors,
  width,
  title,
  subtitle,
  variant,
  testimonials = [],
}: TestimonialsSectionData) {
  const visibleTestimonials = testimonials.filter((testimonial) => testimonial.quote || testimonial.name)

  return (
    <SectionShell colors={colors} width={width}>
      <div className="space-y-10">
        {(title || subtitle) && (
          <div className="max-w-3xl space-y-4">
            {title ? <h2 className="font-display text-4xl md:text-5xl">{title}</h2> : null}
            {subtitle ? <p className="text-lg leading-8 text-muted-foreground md:text-xl">{subtitle}</p> : null}
          </div>
        )}

        <div
          className={cn(
            'grid gap-6',
            variant === 'variant-a' ? 'lg:grid-cols-3' : 'md:grid-cols-2 xl:grid-cols-3',
          )}
        >
          {visibleTestimonials.map((testimonial, index) => (
            <Card
              key={`${testimonial.name ?? 'testimonial'}-${index}`}
              className="rounded-none border border-border/60 bg-background/30 py-0"
            >
              <CardContent className="flex h-full flex-col gap-6 px-6 py-6">
                {testimonial.image?.src ? (
                  <Image
                    src={testimonial.image.src}
                    alt={testimonial.image.alt ?? testimonial.name ?? 'Dubai Croquet Club'}
                    width={480}
                    height={480}
                    className="aspect-square w-full border border-border/60 object-cover"
                  />
                ) : null}
                {testimonial.quote ? (
                  <blockquote className="font-display text-2xl leading-tight md:text-3xl">{testimonial.quote}</blockquote>
                ) : null}
                {(testimonial.name || testimonial.title) && (
                  <div className="space-y-1 text-sm uppercase tracking-[0.14em] text-muted-foreground">
                    {testimonial.name ? <p className="text-foreground">{testimonial.name}</p> : null}
                    {testimonial.title ? <p>{testimonial.title}</p> : null}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
