import Image from 'next/image'
import Link from 'next/link'

type LinkItem = {
  label?: string
  url?: string
}

type SocialLinkItem = LinkItem & {
  icon?: string
}

type SiteFooterProps = {
  title?: string
  logo?: {
    src?: string
    alt?: string
  }
  contacts?: {
    phoneNumber?: string
    email?: string
    address?: string
  }
  primaryLinks?: LinkItem[]
  legalLinks?: LinkItem[]
  socialLinks?: SocialLinkItem[]
  copyrightText?: string
}

export function SiteFooter({
  title,
  logo,
  contacts,
  primaryLinks = [],
  legalLinks = [],
  socialLinks = [],
  copyrightText,
}: SiteFooterProps) {
  const navLinks = primaryLinks.filter((link) => link.label && link.url)
  const legal = legalLinks.filter((link) => link.label && link.url)
  const socials = socialLinks.filter((link) => link.label && link.url)

  return (
    <footer className="bg-[var(--color-surface-soft)] text-foreground">
      <div className="mx-auto max-w-content px-4 py-14 md:px-6">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,0.8fr)]">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              {logo?.src ? (
                <Image
                  src={logo.src}
                  alt={logo.alt ?? title ?? 'Dubai Croquet Club'}
                  width={96}
                  height={96}
                  className="h-16 w-auto object-contain"
                />
              ) : null}
              {title ? (
                <span className="font-display text-lg uppercase tracking-[0.14em]">{title}</span>
              ) : null}
            </Link>
            <div className="space-y-2 text-sm leading-6 text-muted-foreground">
              {contacts?.phoneNumber ? <p>{contacts.phoneNumber}</p> : null}
              {contacts?.email ? <p>{contacts.email}</p> : null}
              {contacts?.address ? <p>{contacts.address}</p> : null}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-sm uppercase tracking-[0.18em]">Navigate</h2>
            <div className="space-y-2 text-sm uppercase tracking-[0.14em]">
              {navLinks.map((link) => (
                <div key={`${link.url}-${link.label}`}>
                  <Link href={link.url!} className="transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-sm uppercase tracking-[0.18em]">Elsewhere</h2>
            <div className="space-y-2 text-sm uppercase tracking-[0.14em]">
              {socials.map((link) => (
                <div key={`${link.url}-${link.label}`}>
                  <Link href={link.url!} className="transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </div>
              ))}
              {legal.map((link) => (
                <div key={`${link.url}-${link.label}`}>
                  <Link href={link.url!} className="transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {copyrightText ? (
          <p className="mt-12 border-t border-border pt-4 text-sm text-muted-foreground">
            {copyrightText}
          </p>
        ) : null}
      </div>
    </footer>
  )
}
