import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

type LegacyRecord = Record<string, unknown>

const repoRoot = path.resolve(process.cwd(), '..')
const projectRoot = process.cwd()
const oldContentRoot = path.join(repoRoot, 'old-croquet', 'content')
const oldImagesRoot = path.join(repoRoot, 'old-croquet', 'public', 'images')
const newContentRoot = path.join(projectRoot, 'content')
const newImagesRoot = path.join(projectRoot, 'public', 'images')

async function main() {
  await resetDirectory(path.join(newContentRoot, 'site'))
  await resetDirectory(path.join(newContentRoot, 'pages'))
  await resetDirectory(path.join(newContentRoot, 'posts'))
  await resetDirectory(path.join(newContentRoot, 'team'))

  const teamReferenceMap = await migrateTeam()
  await migrateConfig()
  await migratePages(teamReferenceMap)
  await migratePosts(teamReferenceMap)
}

async function migrateConfig() {
  const legacyConfig = await readJson(path.join(oldContentRoot, 'data', 'config.json'))

  const config = {
    title: asString(legacyConfig.header?.title) ?? 'Dubai Croquet Club',
    favicon: asString(legacyConfig.favicon) ?? '/images/dlcc-logo-1.ico',
    header: {
      logo: mapImage(legacyConfig.header?.logo),
      isTitleVisible: asBoolean(legacyConfig.header?.isTitleVisible),
      primaryLinks: mapLinks(legacyConfig.header?.primaryLinks),
    },
    footer: {
      logo: mapImage(legacyConfig.footer?.logo),
      contacts: {
        phoneNumber: asString(legacyConfig.footer?.contacts?.phoneNumber),
        email: asString(legacyConfig.footer?.contacts?.email),
        address: asString(legacyConfig.footer?.contacts?.address),
      },
      primaryLinks: mapLinks(legacyConfig.footer?.primaryLinks),
      legalLinks: mapLinks(legacyConfig.footer?.legalLinks),
      socialLinks: mapSocialLinks(legacyConfig.footer?.socialLinks),
      copyrightText: normalizeText(asString(legacyConfig.footer?.copyrightText)),
    },
  }

  await writeJson(path.join(newContentRoot, 'site', 'config.json'), config)
}

async function migrateTeam() {
  const teamDir = path.join(oldContentRoot, 'data', 'team')
  const files = (await readdir(teamDir)).filter((file) => file.endsWith('.json')).sort()
  const referenceMap = new Map<string, string>()

  for (const file of files) {
    const sourcePath = path.join(teamDir, file)
    const legacyPerson = await readJson(sourcePath)
    const targetPath = path.join(newContentRoot, 'team', file)

    const person = {
      firstName: asString(legacyPerson.firstName),
      lastName: asString(legacyPerson.lastName),
      role: asString(legacyPerson.role),
      bio: normalizeText(asString(legacyPerson.bio)),
      image: mapImage(legacyPerson.image),
    }

    await writeJson(targetPath, person)
    referenceMap.set(normalizeReferencePath(`content/data/team/${file}`), `team/${file}`)
  }

  return referenceMap
}

async function migratePages(teamReferenceMap: Map<string, string>) {
  const pagesDir = path.join(oldContentRoot, 'pages')
  const files = (await readdir(pagesDir)).filter((file) => file.endsWith('.md')).sort()

  for (const file of files) {
    const sourcePath = path.join(pagesDir, file)
    const parsed = matter(await readFile(sourcePath, 'utf8'))
    const data = parsed.data as LegacyRecord
    const page = {
      title: asString(data.title) ?? filenameWithoutExtension(file),
      slug: legacyPageSlugFromFilename(file),
      seoTitle: undefined,
      seoDescription: undefined,
      sections: mapSections(asArray(data.sections), {
        teamReferenceMap,
        pageSlug: legacyPageSlugFromFilename(file),
      }),
    }

    await writeJson(
      path.join(newContentRoot, 'pages', `${filenameWithoutExtension(file)}.json`),
      page,
    )
  }
}

async function migratePosts(teamReferenceMap: Map<string, string>) {
  const postsDir = path.join(oldContentRoot, 'pages', 'blog')
  const files = (await readdir(postsDir)).filter((file) => file.endsWith('.md')).sort()

  for (const file of files) {
    const slug = filenameWithoutExtension(file)
    const sourcePath = path.join(postsDir, file)
    const parsed = matter(await readFile(sourcePath, 'utf8'))
    const data = parsed.data as LegacyRecord

    let body = parsed.content.trimStart()
    body = body.replace(/\\([*_()&])/g, '$1')

    const imageDir = path.join(newImagesRoot, 'blog', slug)
    await mkdir(imageDir, { recursive: true })

    if (slug === 'croquet-updates-from-amelia-and-friends') {
      await copyBlogImage(
        'croquet-updates-from-amelia-and-friends',
        'Screenshot 2023-01-12 at 10.00.41 AM.png',
        'featured.png',
      )
      await copyBlogImage(
        'croquet-updates-from-amelia-and-friends',
        'PSW420WS_5-inch_Elite_Single_Post_Cantilever_Swing_4_Bay_2_Cantilevers_(Green)-1000x707.jpg',
        'swing.jpg',
      )

      body = body.replace(
        'https://www.playgroundequipment.com/a-beginners-guide-to-learning-to-play-croquet/There',
        'https://www.playgroundequipment.com/a-beginners-guide-to-learning-to-play-croquet/',
      )
      body = body.replaceAll(
        '/images/Screenshot%202023-01-12%20at%2010.00.41%20AM.png',
        '/images/blog/croquet-updates-from-amelia-and-friends/featured.png',
      )
      body = body.replaceAll(
        '/images/Screenshot 2023-01-12 at 10.00.41 AM.png',
        '/images/blog/croquet-updates-from-amelia-and-friends/featured.png',
      )
      body = body.replaceAll(
        '/images/PSW420WS_5-inch_Elite_Single_Post_Cantilever_Swing_4_Bay_2_Cantilevers_(Green)-1000x707.jpg',
        '/images/blog/croquet-updates-from-amelia-and-friends/swing.jpg',
      )
      body = body.replaceAll(
        '/images/PSW420WS\\_5-inch_Elite_Single_Post_Cantilever_Swing\\_4\\_Bay\\_2\\_Cantilevers_\\(Green\\)-1000x707.jpg',
        '/images/blog/croquet-updates-from-amelia-and-friends/swing.jpg',
      )

      data.featuredImage = {
        ...(asRecord(data.featuredImage) ?? {}),
        url: '/images/blog/croquet-updates-from-amelia-and-friends/featured.png',
      }
    }

    if (slug === 'does-boris-johnson-play-croquet') {
      await copyBlogImage(slug, 'boris-tennis.webp', 'featured.webp')

      body = await mirrorRemoteImage(
        body,
        'https://miro.medium.com/max/750/0*6nofQ7zWm6d1c_o9.jpg',
        path.join(imageDir, 'miro-medium.jpg'),
        '/images/blog/does-boris-johnson-play-croquet/miro-medium.jpg',
      )
      body = await mirrorRemoteImage(
        body,
        'https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/X7Q7L6FNQEI6TFARUYEPTUGC2M.jpg',
        path.join(imageDir, 'washpost.jpg'),
        '/images/blog/does-boris-johnson-play-croquet/washpost.jpg',
      )
      body = await mirrorRemoteImage(
        body,
        'https://i2-prod.mirror.co.uk/incoming/article101472.ece/ALTERNATES/s1200/boris-johnson-pic-rex-149163468.jpg',
        path.join(imageDir, 'mirror.jpg'),
        '/images/blog/does-boris-johnson-play-croquet/mirror.jpg',
      )
      body = await mirrorRemoteImage(
        body,
        'https://i.guim.co.uk/img/media/cb5ee63600e77242f1a2404c47aace1aa0204646/78_150_2905_1744/master/2905.jpg?width=465&quality=45&auto=format&fit=max&dpr=2&s=7e0770f5ee3031304bd34ca5913d649d',
        path.join(imageDir, 'guardian.jpg'),
        '/images/blog/does-boris-johnson-play-croquet/guardian.jpg',
      )

      data.featuredImage = {
        ...(asRecord(data.featuredImage) ?? {}),
        url: '/images/blog/does-boris-johnson-play-croquet/featured.webp',
      }
    }

    if (slug === 'post-four') {
      await copyBlogImage(slug, 'claire-walking-away.jpg')
      await copyBlogImage(slug, 'croquet-setup.jpg')
      await copyBlogImage(slug, 'ben-running.jpg')
      await copyBlogImage(slug, 'long-distance-hywell.jpg')
      await copyBlogImage(slug, 'tina-shooting-hoops.jpg')

      body = body
        .replace(/^### !\[]\((\/images\/ben-running\.jpg)\)(.+)$/m, '![]($1)\n\n###$2')
        .replace(/^### !\[]\((\/images\/long-distance-hywell\.jpg)\)(.+)$/m, '![]($1)\n\n###$2')
        .replace(/\/images\/croquet-setup\.jpg/g, '/images/blog/post-four/croquet-setup.jpg')
        .replace(/\/images\/ben-running\.jpg/g, '/images/blog/post-four/ben-running.jpg')
        .replace(
          /\/images\/long-distance-hywell\.jpg/g,
          '/images/blog/post-four/long-distance-hywell.jpg',
        )
        .replace(
          /\/images\/tina-shooting-hoops\.jpg/g,
          '/images/blog/post-four/tina-shooting-hoops.jpg',
        )
        .replace(/^###Tensions/gm, '### Tensions')
        .replace(/^###It/gm, '### It')

      data.featuredImage = {
        ...(asRecord(data.featuredImage) ?? {}),
        url: '/images/blog/post-four/claire-walking-away.jpg',
      }
    }

    if (slug === 'post-three') {
      await copyBlogImage(slug, 'tina-fabulous-picnic.jpg')

      body = body.replace(/^(#{3,5})([^ #\n])/gm, '$1 $2')

      data.featuredImage = {
        ...(asRecord(data.featuredImage) ?? {}),
        url: '/images/blog/post-three/tina-fabulous-picnic.jpg',
      }
    }

    if (slug === 'post-eight') {
      await copyBlogImage(slug, 'strategy-under-the-tree.jpg')

      body = body.replaceAll(
        '/images/strategy-under-the-tree.jpg',
        '/images/blog/post-eight/strategy-under-the-tree.jpg',
      )

      data.featuredImage = {
        ...(asRecord(data.featuredImage) ?? {}),
        url: '/images/blog/post-eight/strategy-under-the-tree.jpg',
      }
    }

    const post = {
      title: asString(data.title) ?? slug,
      slug,
      date: asString(data.date),
      excerpt: asString(data.excerpt),
      featuredImage: mapImage(data.featuredImage),
      author: mapReference(asString(data.author), teamReferenceMap),
      bottomSections: mapSections(asArray(data.bottomSections), {
        teamReferenceMap,
        pageSlug: `blog/${slug}`,
      }),
      body: body.trimEnd(),
    }

    await writeMdx(path.join(newContentRoot, 'posts', `${slug}.mdx`), post)
  }
}

function mapSections(
  sections: LegacyRecord[],
  context: { teamReferenceMap: Map<string, string>; pageSlug: string },
) {
  return sections.map((section) => mapSection(section, context)).filter(Boolean)
}

function mapSection(
  section: LegacyRecord,
  context: { teamReferenceMap: Map<string, string>; pageSlug: string },
) {
  const type = asString(section.type)

  switch (type) {
    case 'HeroSection':
      return compactObject({
        _template: 'heroSection',
        colors: asString(section.colors),
        width: extractWidth(section),
        title: asString(section.title),
        subtitle: asString(section.subtitle),
        badgeLabel: asString(section.badge?.label),
        text: normalizeText(asString(section.text)),
        actions: mapLinks(section.actions),
        media: mapImage(section.media),
      })
    case 'TextSection':
      return compactObject({
        _template: 'textSection',
        colors: asString(section.colors),
        width: extractWidth(section),
        title: asString(section.title),
        subtitle: asString(section.subtitle),
        body: normalizeText(asString(section.text)),
      })
    case 'CtaSection':
      return compactObject({
        _template: 'ctaSection',
        colors: asString(section.colors),
        width: extractWidth(section),
        title: asString(section.title),
        text: normalizeText(asString(section.text)),
        actions: mapLinks(section.actions),
      })
    case 'FeaturedItemsSection':
      return compactObject({
        _template: 'featuredItemsSection',
        colors: asString(section.colors),
        title: asString(section.title),
        subtitle: asString(section.subtitle),
        columns: asNumber(section.columns),
        actions: mapLinks(section.actions),
        items: asArray(section.items).map((item) =>
          compactObject({
            title: asString(item.title),
            subtitle: asString(item.subtitle),
            text: normalizeText(asString(item.text)),
            featuredImage: mapImage(item.featuredImage),
            actions: mapLinks(item.actions),
          }),
        ),
      })
    case 'TestimonialsSection':
      return compactObject({
        _template: 'testimonialsSection',
        colors: asString(section.colors),
        title: asString(section.title),
        subtitle: asString(section.subtitle),
        variant: asString(section.variant),
        testimonials: asArray(section.testimonials).map((item) =>
          compactObject({
            quote: normalizeText(asString(item.quote)),
            name: asString(item.name),
            title: asString(item.title),
            image: mapImage(item.image),
          }),
        ),
      })
    case 'ContactSection':
      return compactObject({
        _template: 'contactSection',
        colors: asString(section.colors),
        width: extractWidth(section),
        title: asString(section.title),
        text: normalizeText(asString(section.text)),
        formKey: inferFormKey(section, context.pageSlug),
        variant: asString(section.form?.variant),
        media: mapImage(section.media),
      })
    case 'FaqSection':
      return compactObject({
        _template: 'faqSection',
        colors: asString(section.colors),
        title: asString(section.title),
        items: asArray(section.items).map((item) =>
          compactObject({
            question: asString(item.question),
            answer: normalizeText(asString(item.answer)),
          }),
        ),
      })
    case 'QuoteSection':
      return compactObject({
        _template: 'quoteSection',
        colors: asString(section.colors),
        width: extractWidth(section),
        quote: normalizeText(asString(section.quote)),
        name: asString(section.name),
        title: asString(section.title),
      })
    case 'MediaGallerySection':
      return compactObject({
        _template: 'mediaGallerySection',
        colors: asString(section.colors),
        title: asString(section.title),
        subtitle: asString(section.subtitle),
        images: asArray(section.images)
          .map((item) => mapImage(item))
          .filter(Boolean),
      })
    case 'FeaturedPeopleSection':
      return compactObject({
        _template: 'featuredPeopleSection',
        colors: asString(section.colors),
        title: asString(section.title),
        subtitle: asString(section.subtitle),
        variant: asString(section.variant),
        actions: mapLinks(section.actions),
        people: asScalarArray(section.people)
          .map((entry) => mapReference(asString(entry), context.teamReferenceMap))
          .filter(Boolean)
          .map((person) => ({ person })),
      })
    case 'FeatureHighlightSection':
      return compactObject({
        _template: 'featureHighlightSection',
        colors: asString(section.colors),
        width: extractWidth(section),
        title: asString(section.title),
        subtitle: asString(section.subtitle),
        badgeLabel: asString(section.badge?.label),
        text: normalizeText(asString(section.text)),
        media: mapImage(section.media),
        actions: mapLinks(section.actions),
      })
    case 'RecentPostsSection':
      return compactObject({
        _template: 'recentPostsSection',
        colors: asString(section.colors),
        title: asString(section.title),
        subtitle: asString(section.subtitle),
        variant: asString(section.variant),
        recentCount: asNumber(section.recentCount),
        showDate: asBoolean(section.showDate),
        showAuthor: asBoolean(section.showAuthor),
        showExcerpt: asBoolean(section.showExcerpt),
        actions: mapLinks(section.actions),
      })
    default:
      throw new Error(`Unsupported section type "${type ?? 'unknown'}" in ${context.pageSlug}`)
  }
}

function inferFormKey(section: LegacyRecord, pageSlug: string) {
  if (pageSlug === 'player-registration') {
    return 'registration'
  }

  const destination = asString(section.form?.destination)?.toLowerCase()
  if (destination?.includes('newsletter')) {
    return 'newsletter'
  }

  return 'contact'
}

function mapSocialLinks(value: unknown) {
  return asArray(value).map((item) =>
    compactObject({
      label: asString(item.label),
      url: asString(item.url),
      icon: asString(item.icon),
    }),
  )
}

function mapLinks(value: unknown) {
  return asArray(value).map((item) =>
    compactObject({
      label: asString(item.label),
      url: asString(item.url),
      style: mapLinkStyle(item),
      showIcon: asBoolean(item.showIcon),
      icon: asString(item.icon),
    }),
  )
}

function mapLinkStyle(value: LegacyRecord) {
  const explicit = asString(value.style)
  if (explicit) {
    return explicit
  }

  const type = asString(value.type)
  if (type === 'Button') {
    return 'primary'
  }

  return type === 'Link' ? 'link' : undefined
}

function mapImage(value: unknown) {
  const record = asRecord(value)
  if (!record) {
    return undefined
  }

  const src = asString(record.url) ?? asString(record.src)
  if (!src) {
    return undefined
  }

  return compactObject({
    src,
    alt: asString(record.altText) ?? asString(record.alt),
    caption: asString(record.caption),
  })
}

function mapReference(value: string | undefined, referenceMap: Map<string, string>) {
  if (!value) {
    return undefined
  }

  return referenceMap.get(normalizeReferencePath(value)) ?? value
}

function normalizeReferencePath(value: string) {
  return value.replace(/\\/g, '/').replace(/^\.\//, '')
}

function extractWidth(section: LegacyRecord) {
  return asString(section.styles?.self?.width) ?? 'wide'
}

function legacyPageSlugFromFilename(file: string) {
  const slug = filenameWithoutExtension(file)
  return slug === 'index' ? 'index' : slug
}

function filenameWithoutExtension(file: string) {
  return path.basename(file, path.extname(file))
}

function compactObject<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (entry === undefined || entry === null || entry === '') {
        return false
      }

      if (Array.isArray(entry) && entry.length === 0) {
        return false
      }

      return true
    }),
  )
}

function normalizeText(value: string | undefined) {
  return value?.trim()
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value.filter(asRecord) : []
}

function asScalarArray(value: unknown) {
  return Array.isArray(value) ? value : []
}

function asRecord(value: unknown): LegacyRecord | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as LegacyRecord)
    : undefined
}

function asString(value: unknown) {
  return typeof value === 'string' ? value : undefined
}

function asBoolean(value: unknown) {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      return true
    }

    if (value.toLowerCase() === 'false') {
      return false
    }
  }

  return undefined
}

function asNumber(value: unknown) {
  return typeof value === 'number' ? value : undefined
}

async function readJson(filePath: string) {
  return JSON.parse(await readFile(filePath, 'utf8')) as LegacyRecord
}

async function writeJson(filePath: string, data: unknown) {
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

async function writeMdx(filePath: string, data: Record<string, unknown>) {
  await mkdir(path.dirname(filePath), { recursive: true })
  const { body, ...frontmatter } = data
  const output = matter.stringify(
    String(body ?? ''),
    stripUndefined(frontmatter) as Record<string, unknown>,
  )
  await writeFile(filePath, output, 'utf8')
}

async function copyBlogImage(
  slug: string,
  sourceFileName: string,
  targetFileName = sourceFileName,
) {
  const sourcePath = path.join(oldImagesRoot, sourceFileName)
  const targetPath = path.join(newImagesRoot, 'blog', slug, targetFileName)
  await copyFile(sourcePath, targetPath)
}

async function resetDirectory(directory: string) {
  await rm(directory, { recursive: true, force: true })
  await mkdir(directory, { recursive: true })
}

async function mirrorRemoteImage(
  markdown: string,
  remoteUrl: string,
  destinationPath: string,
  replacementPath: string,
) {
  if (!markdown.includes(remoteUrl)) {
    return markdown
  }

  const response = await fetch(remoteUrl)
  if (!response.ok) {
    throw new Error(`Failed to download ${remoteUrl}: ${response.status}`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  await writeFile(destinationPath, buffer)
  return markdown.replaceAll(remoteUrl, replacementPath)
}

function stripUndefined(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item))
  }

  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, item]) => {
        if (item === undefined) {
          return []
        }

        return [[key, stripUndefined(item)]]
      }),
    )
  }

  return value
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
