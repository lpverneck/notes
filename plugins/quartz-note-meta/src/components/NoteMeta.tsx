import type { JSX } from "preact"
import type {
  FilePath,
  FullSlug,
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"
import { formatDate } from "@quartz-community/utils/date"
import { classNames } from "@quartz-community/utils/lang"
import { resolveRelative, slugifyFilePath, splitAnchor } from "@quartz-community/utils/path"

export interface NoteMetaOptions {
  /** Exibe a linha `created at`, lida do frontmatter da nota. */
  showCreated: boolean
  /** Exibe a linha `modified at`, lida do frontmatter da nota. */
  showModified: boolean
  /** Exibe a linha `duration`: minutos estimados e total de palavras. */
  showDuration: boolean
  /** Velocidade de leitura usada para derivar os minutos. */
  wordsPerMinute: number
}

const defaultOptions: NoteMetaOptions = {
  showCreated: true,
  showModified: true,
  showDuration: true,
  wordsPerMinute: 200,
}

/** O que o transformer do note-properties deixa em `fileData.noteProperties`. */
interface NotePropertiesData {
  properties: Record<string, unknown>
  showProperties?: boolean
  resolvedLinks?: Record<string, string>
}

interface LinkContext {
  slug: FullSlug
  /** Alvos já resolvidos pelo htmlPlugin do note-properties. */
  resolvedLinks: Record<string, string>
}

const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g
const MDLINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g
// Não engole a pontuação que fecha a frase em que a URL está.
const URL_RE = /https?:\/\/[^\s<>]*[^\s<>.,;:!?)\]]/g

function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://")
}

/** `[[nota#âncora]]` -> slug que o note-properties usa como chave em `resolvedLinks`. */
function slugifyWikilinkTarget(target: string): string {
  const [rawPath, anchor] = splitAnchor(target)
  if (!rawPath) return anchor
  const withExt = rawPath.endsWith(".md") ? rawPath : `${rawPath}.md`
  return slugifyFilePath(withExt as FilePath) + anchor
}

function lookupHref(ctx: LinkContext, target: string): string {
  return ctx.resolvedLinks[target] ?? resolveRelative(ctx.slug, target as FullSlug)
}

interface Segment {
  start: number
  end: number
  node: JSX.Element
}

/** Converte wikilinks, links markdown e URLs soltas do valor de uma propriedade em âncoras. */
function renderTextWithLinks(text: string, ctx: LinkContext): (string | JSX.Element)[] {
  const segments: Segment[] = []
  const overlaps = (start: number, end: number) =>
    segments.some((s) => start < s.end && end > s.start)

  for (const match of text.matchAll(WIKILINK_RE)) {
    const start = match.index ?? 0
    const target = match[1]
    segments.push({
      start,
      end: start + match[0].length,
      node: (
        <a href={lookupHref(ctx, slugifyWikilinkTarget(target))} class="internal internal-link">
          {match[2] ?? target}
        </a>
      ),
    })
  }

  for (const match of text.matchAll(MDLINK_RE)) {
    const start = match.index ?? 0
    const end = start + match[0].length
    if (overlaps(start, end)) continue
    const href = match[2]
    const external = isExternal(href)
    segments.push({
      start,
      end,
      node: external ? (
        <a href={href} class="external external-link" target="_blank" rel="noopener noreferrer">
          {match[1] || href}
        </a>
      ) : (
        <a href={lookupHref(ctx, href)} class="internal internal-link">
          {match[1] || href}
        </a>
      ),
    })
  }

  for (const match of text.matchAll(URL_RE)) {
    const start = match.index ?? 0
    const end = start + match[0].length
    if (overlaps(start, end)) continue
    segments.push({
      start,
      end,
      node: (
        <a href={match[0]} class="external external-link" target="_blank" rel="noopener noreferrer">
          {match[0]}
        </a>
      ),
    })
  }

  if (segments.length === 0) return [text]

  segments.sort((a, b) => a.start - b.start)
  const parts: (string | JSX.Element)[] = []
  let cursor = 0
  for (const segment of segments) {
    if (segment.start > cursor) parts.push(text.slice(cursor, segment.start))
    parts.push(segment.node)
    cursor = segment.end
  }
  if (cursor < text.length) parts.push(text.slice(cursor))
  return parts
}

function renderValue(value: unknown, ctx: LinkContext): JSX.Element {
  if (typeof value === "boolean") {
    return <span class="note-meta-flag">{value ? "yes" : "no"}</span>
  }
  if (typeof value === "number") {
    return <span class="note-meta-number">{value}</span>
  }
  if (typeof value === "string") {
    return <span>{renderTextWithLinks(value, ctx)}</span>
  }
  if (Array.isArray(value)) {
    return (
      <span class="note-meta-list">
        {value.flatMap((item, idx) => {
          const rendered = renderValue(item, ctx)
          return idx === 0
            ? [rendered]
            : [
                <span key={`sep-${idx}`} class="note-meta-comma">
                  ,{" "}
                </span>,
                rendered,
              ]
        })}
      </span>
    )
  }
  return (
    <span class="note-meta-object">
      <code>{JSON.stringify(value)}</code>
    </span>
  )
}

/** Tags como chips; o `#` vem de `a.internal.tag-link::before` em base.scss. */
function renderTags(tags: string[], slug: FullSlug): JSX.Element {
  return (
    <ul class="note-meta-tags">
      {tags.map((tag) => (
        <li key={tag}>
          <a href={resolveRelative(slug, `tags/${tag}` as FullSlug)} class="internal tag-link">
            {tag}
          </a>
        </li>
      ))}
    </ul>
  )
}

/**
 * Ícones do Lucide (ISC) desenhados inline em vez de importados: sem dependência
 * nova, e o traço segue `currentColor`, então uma única cor no SCSS pinta ícone,
 * texto e fundo do selo.
 */
const STATUS_ICONS: Record<string, JSX.Element> = {
  // circle-arrow-right
  active: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="m12 16 4-4-4-4" />
    </>
  ),
  // circle-check
  completed: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  // circle-x
  dropped: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </>
  ),
  // circle-pause
  "on-hold": (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="10" x2="10" y1="15" y2="9" />
      <line x1="14" x2="14" y1="15" y2="9" />
    </>
  ),
}

/** `On Hold` -> `on-hold`: chave do ícone e o `data-status` que o SCSS colore. */
function statusKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "-")
}

/**
 * `status` vira um selo com ícone. Um valor fora da lista cai no texto puro, para
 * que um estado novo no vault apareça na nota antes de ganhar estilo aqui.
 */
function renderStatus(value: unknown, ctx: LinkContext): JSX.Element {
  const key = typeof value === "string" ? statusKey(value) : ""
  const icon = STATUS_ICONS[key]
  if (!icon) return renderValue(value, ctx)

  return (
    <span class="note-meta-status" data-status={key}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        {icon}
      </svg>
      {(value as string).trim()}
    </span>
  )
}

/** Escolhe o renderer da linha: `tags` e `status` têm forma própria, o resto é texto. */
function renderProperty(
  key: string,
  value: unknown,
  slug: FullSlug,
  ctx: LinkContext,
): JSX.Element {
  if (key === "tags" && Array.isArray(value)) return renderTags(value as string[], slug)
  if (key === "status") return renderStatus(value, ctx)
  return renderValue(value, ctx)
}

/**
 * Conta palavras separadas por espaço. Bate com o que a lib `reading-time` — usada
 * pelo antigo content-meta — devolve para texto latino, sem arrastar o wrapper de
 * stream dela, que exige `require()` dinâmico dentro de um bundle ESM.
 */
function countWords(text: string): number {
  const trimmed = text.trim()
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length
}

function renderDuration(text: string, wordsPerMinute: number): JSX.Element {
  const words = countWords(text)
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute))
  return (
    <span class="note-meta-duration">
      <span>{`${minutes} min`}</span>
      <span class="note-meta-sep">·</span>
      <span>{`${words} ${words === 1 ? "word" : "words"}`}</span>
    </span>
  )
}

/** Uma propriedade sem conteúdo não vira linha. */
function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === "string") return value.trim() === ""
  if (Array.isArray(value)) return value.length === 0
  return false
}

const NoteMeta: QuartzComponentConstructor<Partial<NoteMetaOptions>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  const Component: QuartzComponent = ({ cfg, fileData, displayClass }: QuartzComponentProps) => {
    // Páginas virtuais (pasta, tag) não têm nem texto nem frontmatter parseado.
    const text = fileData.text as string | undefined
    const noteProps = fileData.noteProperties as NotePropertiesData | undefined
    if (!text && !noteProps) return null
    // Escape hatch do note-properties: `quartz-properties: false` no frontmatter.
    if (noteProps?.showProperties === false) return null

    const slug = (fileData.slug ?? "") as FullSlug
    const ctx: LinkContext = { slug, resolvedLinks: noteProps?.resolvedLinks ?? {} }
    const rows: { label: string; value: JSX.Element }[] = []

    // As datas de `fileData.dates` caem para git/filesystem quando a nota não as
    // declara; aqui só interessa o que veio do frontmatter. As chaves canônicas são
    // preenchidas a partir de `created at`/`modified at` pelo transformer NoteMetaDates.
    const frontmatter = fileData.frontmatter as Record<string, unknown> | undefined
    const dates = fileData.dates as { created?: Date; modified?: Date } | undefined

    const dateRow = (label: string, date?: Date, raw?: unknown) =>
      date !== undefined && raw !== undefined
        ? rows.push({
            label,
            value: <time datetime={date.toISOString()}>{formatDate(date, cfg.locale)}</time>,
          })
        : undefined

    if (opts.showCreated) dateRow("created at", dates?.created, frontmatter?.created)
    if (opts.showModified) dateRow("modified at", dates?.modified, frontmatter?.modified)

    for (const [key, value] of Object.entries(noteProps?.properties ?? {})) {
      if (isEmpty(value)) continue
      rows.push({ label: key, value: renderProperty(key, value, slug, ctx) })
    }

    if (opts.showDuration && text) {
      rows.push({ label: "duration", value: renderDuration(text, opts.wordsPerMinute) })
    }

    if (rows.length === 0) return null

    return (
      <dl class={classNames(displayClass, "note-meta")}>
        {rows.flatMap(({ label, value }) => [
          <dt key={`${label}-key`}>{label}</dt>,
          <dd key={`${label}-value`}>{value}</dd>,
        ])}
      </dl>
    )
  }

  return Component
}

export default NoteMeta
