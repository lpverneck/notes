# quartz-note-meta

Renders a note's metadata as a single minimal label grid, right under the title:

```
────────────────────────────────────────────
 CREATED    Sep 08, 2026
 TAGS       #active  #llm  #observability
 DURATION   2 min · 295 words
────────────────────────────────────────────
```

It replaces two upstream components at once:

- `@quartz-community/note-properties` — its collapsible `<details>` + `<table>` view.
- `@quartz-community/content-meta` — the loose "date, X min read" line.

## Rows

`created` first, then every frontmatter property the `note-properties` transformer
exposes (in `includedProperties` order), then `duration`. Rows with no value are skipped.

- **created** — only rendered when the note actually declares `created:` in its
  frontmatter. `fileData.dates.created` alone is not enough: it falls back to git and
  filesystem timestamps.
- **tags** — chips that wrap, so notes with many tags stay readable. The `#` prefix and
  the chip background come from `a.internal.tag-link` in `quartz/styles/base.scss`.
- **duration** — estimated minutes plus the word count of `fileData.text`.
- Other properties render as text, with wikilinks, markdown links and bare URLs turned
  into anchors (using `resolvedLinks`, which the `note-properties` html plugin fills in).

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
    showDuration: true
    wordsPerMinute: 200
  layout:
    position: beforeBody
    priority: 20
    condition: not-index
```

## Options

| Option           | Type      | Default | Description                                |
| ---------------- | --------- | ------- | ------------------------------------------ |
| `showCreated`    | `boolean` | `true`  | Render the `created` row.                  |
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
