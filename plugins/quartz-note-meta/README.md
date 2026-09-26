# quartz-note-meta

Renders a note's metadata as a single minimal label grid, right under the title:

```
─────────────────────────────────────────────
 CREATED AT    Sep 08, 2026
 MODIFIED AT   Sep 14, 2026
 STATUS        (>) Active
 TAGS          #active  #llm  #observability
 DURATION      2 min · 295 words
─────────────────────────────────────────────
```

It replaces two upstream components at once:

- `@quartz-community/note-properties` — its collapsible `<details>` + `<table>` view.
- `@quartz-community/content-meta` — the loose "date, X min read" line.

## Rows

`created at` and `modified at` first, then every frontmatter property the
`note-properties` transformer exposes (in `includedProperties` order), then `duration`.
Rows with no value are skipped.

- **created at / modified at** — only rendered when the note actually declares the
  property. `fileData.dates` alone is not enough: it falls back to git and filesystem
  timestamps, so every note would show a date whether or not it has one.
- **tags** — chips that wrap, so notes with many tags stay readable. The `#` prefix and
  the chip background come from `a.internal.tag-link` in `quartz/styles/base.scss`.
- **status** — a badge with a Lucide icon and its own color: `Active`, `Completed`,
  `Dropped` and `On Hold`, matching how the vault reads them in Obsidian. The value is
  slugified into `data-status` (`On Hold` -> `on-hold`), which is what `custom.scss`
  colors; anything outside that list falls back to plain text.
- **duration** — estimated minutes plus the word count of `fileData.text`.
- Other properties render as text, with wikilinks, markdown links and bare URLs turned
  into anchors (using `resolvedLinks`, which the `note-properties` html plugin fills in).

## The date transformer

The plugin also ships a small transformer, `NoteMetaDates`. Quartz only understands the
canonical `created:` / `modified:` frontmatter keys — `@quartz-community/created-modified-date`
reads those to build `fileData.dates`, which in turn drives folder listings, sorting and the
RSS feed. A note written as `created at:` would have no date anywhere on the site.

`NoteMetaDates` copies `created at` / `modified at` (and the `createdAt` / `created_at`
spellings) onto the canonical keys. It has to run **after** `note-properties`, which parses
the frontmatter, and **before** `created-modified-date`, which consumes it — hence `order: 6`.

## Setup

`@quartz-community/note-properties` must stay **enabled** — it is the transformer that
parses all frontmatter. Set `hidePropertiesView: true` to hide only its own view:

```yaml
- source: "@quartz-community/note-properties"
  enabled: true
  options:
    hidePropertiesView: true
    includedProperties: [description, tags, aliases]

- source: ./plugins/quartz-note-meta
  enabled: true
  options:
    showCreated: true
    showModified: true
    showDuration: true
    wordsPerMinute: 200
  order: 6 # between note-properties (5) and created-modified-date (10)
  layout:
    position: beforeBody
    priority: 20
    condition: not-index
```

## Options

| Option           | Type      | Default | Description                                |
| ---------------- | --------- | ------- | ------------------------------------------ |
| `showCreated`    | `boolean` | `true`  | Render the `created at` row.               |
| `showModified`   | `boolean` | `true`  | Render the `modified at` row.              |
| `showDuration`   | `boolean` | `true`  | Render the `duration` row.                 |
| `wordsPerMinute` | `number`  | `200`   | Reading speed used to derive the duration. |

Styling lives in `quartz/styles/custom.scss`, not in the plugin: that file is emitted
outside `@layer quartz-base`, so it always wins, and `quartz build --serve` picks up SCSS
edits without a restart (a rebuilt `dist/` does not reload — Node caches the module).

## Development

```bash
npm install
npm run typecheck
npm run build   # dist/ is committed; the CI never rebuilds it
```

`preact` is bundled rather than declared as a peer dependency: for a local, symlinked
plugin, Quartz's `linkPeerDependencies` would write a relative symlink that resolves from
the real `plugins/` directory and lands outside the repo.
