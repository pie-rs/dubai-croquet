import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getSiteConfig } from '@/lib/tina'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const siteConfig = await getSiteConfig()
  const header = isRecord(siteConfig?.header) ? siteConfig.header : undefined
  const footer = isRecord(siteConfig?.footer) ? siteConfig.footer : undefined

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader
        title={typeof siteConfig?.title === 'string' ? siteConfig.title : undefined}
        logo={asImage(header?.logo)}
        isTitleVisible={header?.isTitleVisible === true}
        links={asLinks(header?.primaryLinks)}
      />
      <main>{children}</main>
      <SiteFooter
        title={typeof siteConfig?.title === 'string' ? siteConfig.title : undefined}
        logo={asImage(footer?.logo)}
        contacts={asContacts(footer?.contacts)}
        primaryLinks={asLinks(footer?.primaryLinks)}
        legalLinks={asLinks(footer?.legalLinks)}
        socialLinks={asSocialLinks(footer?.socialLinks)}
        copyrightText={typeof footer?.copyrightText === 'string' ? footer.copyrightText : undefined}
      />
    </div>
  )
}

function asImage(value: unknown) {
  if (!isRecord(value)) {
    return undefined
  }

  return {
    src: typeof value.src === 'string' ? value.src : undefined,
    alt: typeof value.alt === 'string' ? value.alt : undefined,
  }
}

function asLinks(value: unknown) {
  return Array.isArray(value)
    ? value
        .filter(isRecord)
        .map((entry) => ({
          label: typeof entry.label === 'string' ? entry.label : undefined,
          url: typeof entry.url === 'string' ? entry.url : undefined,
        }))
    : undefined
}

function asContacts(value: unknown) {
  if (!isRecord(value)) {
    return undefined
  }

  return {
    phoneNumber: typeof value.phoneNumber === 'string' ? value.phoneNumber : undefined,
    email: typeof value.email === 'string' ? value.email : undefined,
    address: typeof value.address === 'string' ? value.address : undefined,
  }
}

function asSocialLinks(value: unknown) {
  return Array.isArray(value)
    ? value
        .filter(isRecord)
        .map((entry) => ({
          label: typeof entry.label === 'string' ? entry.label : undefined,
          url: typeof entry.url === 'string' ? entry.url : undefined,
          icon: typeof entry.icon === 'string' ? entry.icon : undefined,
        }))
    : undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
