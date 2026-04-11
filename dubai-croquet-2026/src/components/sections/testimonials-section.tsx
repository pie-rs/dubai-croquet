import Image from 'next/image'
import { SectionShell } from '@/components/sections/section-shell'
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
            'space-y-12',
            variant === 'variant-a' ? '' : 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
          )}
        >
          {visibleTestimonials.map((testimonial, index) => (
            <blockquote
              key={`${testimonial.name ?? 'testimonial'}-${index}`}
              className={cn(
                variant === 'variant-a'
                  ? 'flex flex-col gap-8 md:flex-row md:items-center'
                  : 'space-y-6 border border-border/60 bg-background/30 px-6 py-6',
              )}
            >
              {testimonial.image?.src ? (
                <div className={cn(variant === 'variant-a' ? 'max-w-lg md:w-2/5 md:flex-shrink-0' : '')}>
                  <Image
                    src={testimonial.image.src}
                    alt={testimonial.image.alt ?? testimonial.name ?? 'Dubai Croquet Club'}
                    width={480}
                    height={480}
                    className={cn(
                      'w-full object-cover',
                      variant === 'variant-a' ? 'rounded-[1.75rem]' : 'aspect-square border border-border/60',
                    )}
                  />
                </div>
              ) : null}
              <div className="flex-grow space-y-8">
                {testimonial.quote ? (
                  <p className="font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">{testimonial.quote}</p>
                ) : null}
                {(testimonial.name || testimonial.title) && (
                  <footer className="space-y-1 text-base text-muted-foreground">
                    {testimonial.name ? <p className="text-xl text-foreground sm:text-2xl">{testimonial.name}</p> : null}
                    {testimonial.title ? <p>{testimonial.title}</p> : null}
                  </footer>
                )}
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
