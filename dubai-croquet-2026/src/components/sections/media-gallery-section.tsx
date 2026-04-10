import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { SectionShell } from '@/components/sections/section-shell'
import type { MediaGallerySectionData } from '@/components/sections/types'

type GalleryImage = NonNullable<MediaGallerySectionData['images']>[number] & {
  src: string
}

function hasImageSource(image: NonNullable<MediaGallerySectionData['images']>[number]): image is GalleryImage {
  return typeof image.src === 'string' && image.src.length > 0
}

export function MediaGallerySection({ colors, width, title, subtitle, images = [] }: MediaGallerySectionData) {
  const visibleImages = images.filter(hasImageSource)

  return (
    <SectionShell colors={colors} width={width}>
      <div className="space-y-8">
        {(title || subtitle) && (
          <div className="max-w-3xl space-y-4">
            {title ? <h2 className="font-display text-4xl md:text-5xl">{title}</h2> : null}
            {subtitle ? <p className="text-lg leading-8 text-muted-foreground md:text-xl">{subtitle}</p> : null}
          </div>
        )}

        {visibleImages.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleImages.map((image, index) => (
              <Card key={`${image.src}-${index}`} className="overflow-hidden rounded-none border-border/80 bg-transparent shadow-none">
                <CardContent className="p-0">
                  <figure className="space-y-3">
                    <div className="relative overflow-hidden bg-muted">
                      <Image
                        src={image.src}
                        alt={image.alt ?? title ?? 'Dubai Croquet Club'}
                        width={1200}
                        height={900}
                        className="aspect-[4/3] h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    {image.caption ? <figcaption className="px-1 text-sm text-muted-foreground">{image.caption}</figcaption> : null}
                  </figure>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </SectionShell>
  )
}
