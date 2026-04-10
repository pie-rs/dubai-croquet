import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

type JsonRecord = Record<string, unknown>

export type TinaContentLoaderOptions = {
  baseDir?: string
  contentDir?: string
}

export type TinaContentLoader = {
  getSiteConfig: () => Promise<JsonRecord | null>
  getPage: (slug: string) => Promise<JsonRecord | null>
  getAllPages: () => Promise<JsonRecord[]>
  getPost: (slug: string) => Promise<JsonRecord | null>
  getAllPosts: () => Promise<JsonRecord[]>
  getTeam: () => Promise<JsonRecord[]>
}

const defaultOptions: Required<TinaContentLoaderOptions> = {
  baseDir: process.cwd(),
  contentDir: 'content',
}

export function createTinaContentLoader(options: TinaContentLoaderOptions = {}): TinaContentLoader {
  const mergedOptions = { ...defaultOptions, ...options }
  const contentRoot = path.resolve(mergedOptions.baseDir, mergedOptions.contentDir)

  return {
    getSiteConfig: () => readJsonDocument(path.join(contentRoot, 'site', 'config.json')),
    getPage: async (slug: string) => {
      const document = await readCollectionDocument(contentRoot, 'pages', normalizeRouteSlug(slug), [
        '.json',
        '.mdx',
      ])
      return document ? attachSlug(document, normalizeRouteSlug(slug)) : null
    },
    getAllPages: async () => {
      const documents = await readCollectionDocuments(contentRoot, 'pages', ['.json', '.mdx'])
      return sortBySlug(
        documents.map((document) => attachSlug(document, document.slug)),
        true,
      )
    },
    getPost: async (slug: string) => {
      const document = await readCollectionDocument(contentRoot, 'posts', normalizeRouteSlug(slug), [
        '.mdx',
        '.md',
      ])
      return document ? attachSlug(document, normalizeRouteSlug(slug)) : null
    },
    getAllPosts: async () => {
      const documents = await readCollectionDocuments(contentRoot, 'posts', ['.mdx', '.md'])
      return sortPosts(documents.map((document) => attachSlug(document, document.slug)))
    },
    getTeam: async () => {
      const documents = await readCollectionDocuments(contentRoot, 'team', ['.json'])
      return sortBySlug(documents.map((document) => attachSlug(document, document.slug)))
    },
  }
}

export const tinaContent = createTinaContentLoader()

export const getSiteConfig = tinaContent.getSiteConfig
export const getPage = tinaContent.getPage
export const getAllPages = tinaContent.getAllPages
export const getPost = tinaContent.getPost
export const getAllPosts = tinaContent.getAllPosts
export const getTeam = tinaContent.getTeam

type LoadedDocument = {
  slug: string
  data: JsonRecord
}

async function readJsonDocument(filePath: string): Promise<JsonRecord | null> {
  const text = await readTextFile(filePath)
  if (text === null) {
    return null
  }

  const parsed = JSON.parse(text) as unknown
  if (!isRecord(parsed)) {
    throw new Error(`Expected ${filePath} to contain a JSON object`)
  }

  return parsed
}

async function readCollectionDocument(
  contentRoot: string,
  collectionName: string,
  slug: string,
  extensions: string[],
): Promise<LoadedDocument | null> {
  const candidates = buildDocumentCandidates(contentRoot, collectionName, slug, extensions)

  for (const filePath of candidates) {
    const text = await readTextFile(filePath)
    if (text === null) {
      continue
    }

    return {
      slug,
      data: parseDocument(filePath, text),
    }
  }

  return null
}

async function readCollectionDocuments(
  contentRoot: string,
  collectionName: string,
  extensions: string[],
): Promise<LoadedDocument[]> {
  const collectionRoot = path.join(contentRoot, collectionName)
  const files = await readCollectionFiles(collectionRoot, extensions)

  const documents = await Promise.all(
    files.map(async (filePath) => {
      const text = await readTextFile(filePath)
      if (text === null) {
        return null
      }

      return {
        slug: slugFromFilePath(filePath),
        data: parseDocument(filePath, text),
      }
    }),
  )

  return documents.filter((document): document is LoadedDocument => document !== null)
}

async function readCollectionFiles(collectionRoot: string, extensions: string[]): Promise<string[]> {
  try {
    const entries = await readdir(collectionRoot, { withFileTypes: true })
    return entries
      .filter((entry) => entry.isFile() && extensions.includes(path.extname(entry.name)))
      .map((entry) => path.join(collectionRoot, entry.name))
      .sort((left, right) => left.localeCompare(right))
  } catch (error) {
    if (isMissingFileError(error)) {
      return []
    }

    throw error
  }
}

async function readTextFile(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, 'utf8')
  } catch (error) {
    if (isMissingFileError(error)) {
      return null
    }

    throw error
  }
}

function buildDocumentCandidates(
  contentRoot: string,
  collectionName: string,
  slug: string,
  extensions: string[],
): string[] {
  const normalizedSlug = normalizeRouteSlug(slug)
  const fileBaseName = normalizedSlug === '' ? 'index' : normalizedSlug
  return extensions.map((extension) => path.join(contentRoot, collectionName, `${fileBaseName}${extension}`))
}

function parseDocument(filePath: string, text: string): JsonRecord {
  const extension = path.extname(filePath)
  if (extension === '.mdx' || extension === '.md') {
    return parseMarkdownDocument(text)
  }

  const parsed = JSON.parse(text) as unknown
  if (!isRecord(parsed)) {
    throw new Error(`Expected ${filePath} to contain a JSON object`)
  }

  return parsed
}

function parseMarkdownDocument(text: string): JsonRecord {
  const frontmatterMatch = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/)
  if (!frontmatterMatch) {
    return { body: text.trimStart() }
  }

  const frontmatter = parseFrontmatterBlock(frontmatterMatch[1])
  const body = frontmatterMatch[2].trimStart()

  return body.length > 0 ? { ...frontmatter, body } : frontmatter
}

function parseFrontmatterBlock(block: string): JsonRecord {
  const lines = block.split(/\r?\n/)
  const result: JsonRecord = {}

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    if (!line.trim() || line.trim().startsWith('#')) {
      continue
    }

    const scalarMatch = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/)
    if (!scalarMatch) {
      continue
    }

    const key = scalarMatch[1]
    const rawValue = scalarMatch[2] ?? ''

    if (rawValue === '') {
      const arrayValues: unknown[] = []
      let cursor = index + 1

      while (cursor < lines.length && /^\s*-\s+/.test(lines[cursor])) {
        arrayValues.push(parseScalarValue(lines[cursor].replace(/^\s*-\s+/, '')))
        cursor += 1
      }

      if (arrayValues.length > 0) {
        result[key] = arrayValues
        index = cursor - 1
        continue
      }

      result[key] = ''
      continue
    }

    result[key] = parseScalarValue(rawValue)
  }

  return result
}

function parseScalarValue(value: string): unknown {
  const trimmed = value.trim()

  if (trimmed.length === 0) {
    return ''
  }

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1)
  }

  if (trimmed === 'null') {
    return null
  }

  if (trimmed === 'true') {
    return true
  }

  if (trimmed === 'false') {
    return false
  }

  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
    return Number(trimmed)
  }

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const inner = trimmed.slice(1, -1).trim()
    if (!inner) {
      return []
    }

    return splitCommaSeparatedValues(inner).map((item) => parseScalarValue(item))
  }

  return trimmed
}

function splitCommaSeparatedValues(value: string): string[] {
  const values: string[] = []
  let current = ''
  let quote: '"' | "'" | null = null

  for (const character of value) {
    if ((character === '"' || character === "'") && (!quote || quote === character)) {
      quote = quote === character ? null : character
      current += character
      continue
    }

    if (character === ',' && !quote) {
      values.push(current.trim())
      current = ''
      continue
    }

    current += character
  }

  if (current.trim().length > 0) {
    values.push(current.trim())
  }

  return values
}

function normalizeRouteSlug(slug: string): string {
  const trimmed = slug.trim().replace(/^\/+|\/+$/g, '')
  if (trimmed === '' || trimmed === 'index') {
    return ''
  }

  return trimmed
}

function slugFromFilePath(filePath: string): string {
  const baseName = path.basename(filePath, path.extname(filePath))
  return normalizeRouteSlug(baseName)
}

function attachSlug(document: LoadedDocument, fallbackSlug: string): JsonRecord {
  const dataSlug = isRecord(document.data) && typeof document.data.slug === 'string' ? document.data.slug : fallbackSlug
  const slug = normalizeRouteSlug(dataSlug || fallbackSlug)
  return { ...document.data, slug }
}

function sortBySlug(documents: JsonRecord[], rootFirst = false): JsonRecord[] {
  return [...documents].sort((left, right) => {
    const leftSlug = typeof left.slug === 'string' ? left.slug : ''
    const rightSlug = typeof right.slug === 'string' ? right.slug : ''

    if (rootFirst) {
      if (leftSlug === '' && rightSlug !== '') {
        return -1
      }

      if (rightSlug === '' && leftSlug !== '') {
        return 1
      }
    }

    return leftSlug.localeCompare(rightSlug)
  })
}

function sortPosts(documents: JsonRecord[]): JsonRecord[] {
  return [...documents].sort((left, right) => {
    const leftDate = parseDateValue(left.date)
    const rightDate = parseDateValue(right.date)

    if (leftDate !== rightDate) {
      return rightDate - leftDate
    }

    const leftSlug = typeof left.slug === 'string' ? left.slug : ''
    const rightSlug = typeof right.slug === 'string' ? right.slug : ''
    return leftSlug.localeCompare(rightSlug)
  })
}

function parseDateValue(value: unknown): number {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return Number.NEGATIVE_INFINITY
  }

  const date = new Date(value)
  const time = date.getTime()
  return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isMissingFileError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'ENOENT'
}
