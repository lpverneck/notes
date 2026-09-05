# Quartz Jupyter Embed (local fork)

> This is a locally customized copy of [vazome/quartz-jupyter-embed](https://github.com/vazome/quartz-jupyter-embed),
> vendored under `plugins/` (instead of installed via the git plugin loader into
> `.quartz/plugins/`, which is gitignored and gets re-cloned from upstream on every
> fresh install) specifically to add support for **relative links to local notebooks**
> — see "Local notebooks" below. Everything else in this README describes the
> upstream plugin unchanged.

Link a `.ipynb` file from a note and [Quartz](https://github.com/jackyzha0/quartz) renders the
whole notebook inline — markdown cells, syntax-highlighted code, and outputs.

You can check it out here — https://vazome.tech/

|                                                           Code                                                           |                                                           Images                                                           |
| :----------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/user-attachments/assets/f63fae48-74ba-4a35-b239-ce70d5034fcf" alt="Code cells" width="450"> | <img src="https://github.com/user-attachments/assets/acd9049a-4e0e-4f0f-ac02-88197de545db" alt="Image output" width="450"> |

## Quartz v5

```bash
npx quartz plugin add github:vazome/quartz-jupyter-embed
```

That's it — the plugin ships a pre-built `dist/`, so there is nothing to install or
compile. The command adds it to your `quartz.config.yaml`:

```yaml
plugins:
  - source: github:vazome/quartz-jupyter-embed
    enabled: true
    order: 15
```

> [!important]
> Keep `order` below your `syntax-highlighting` plugin (`20` by default). This plugin
> emits `<pre><code class="language-…">` blocks, and syntax highlighting only reaches
> them if it runs afterwards.

### Usage

Write an ordinary markdown link to any public notebook:

```markdown
[03-training-ride-prediction.ipynb](https://github.com/you/repo/blob/main/notebook.ipynb)
```

`github.com/.../blob/...` URLs are rewritten to `raw.githubusercontent.com` automatically.
Any URL serving notebook JSON works.

Put the link in its own paragraph. The link element is replaced by a `<div>`, and a block
element inside a `<p>` gets hoisted out by the browser, which splits the surrounding text.

Notebooks collapse by clicking the header, and the collapsed state persists in
`localStorage` per notebook URL.

### Local notebooks

A link that is **not** an absolute `http(s)://` URL — e.g. `[demo](notebooks/demo.ipynb)` —
is treated as a path relative to the Quartz root (the directory `quartz.config.yaml` lives
in) and read straight off disk instead of being fetched. It is always embedded — both
`npx quartz build --serve` and the build that ships to GitHub Pages have the full repo
checked out locally. No caching for these: every rebuild picks up the latest edit.

The embed's header/source link still points at GitHub — `${repoUrl}/blob/${repoRef}/<path>`
— for attribution, which needs `repoUrl` set (see Options). Without it, the raw relative
path is shown there instead.

### Options

| Option               | Default                   | Description                                                                                                                         |
| -------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `cacheDir`           | `.quartz-cache/notebooks` | Where downloaded notebooks are cached.                                                                                              |
| `downloadFromGitHub` | `true`                    | Set `false` for fully offline builds — only cached notebooks render.                                                                |
| `downloadTimeout`    | `15000`                   | Abort a download after this many milliseconds.                                                                                      |
| `repoUrl`            | _(unset)_                 | Base URL of the GitHub repo, e.g. `https://github.com/owner/repo`. Used to resolve relative notebook links — see "Local notebooks". |
| `repoRef`            | `main`                    | Git ref used when building the `blob` URL for a relative notebook link.                                                             |

Cache entries never expire. If a notebook changes upstream, delete its cache directory to
pick up the new version.

### What renders

Markdown cells (GFM plus math), code cells with their `In [n]:` execution counts, and
outputs: `stream`, `text/plain`, `text/html`, `image/png`, and error tracebacks. Where a
cell has both `text/html` and `text/plain` for the same output, the HTML wins — the same
precedence Jupyter itself uses, so a DataFrame renders as a table rather than its repr.

Remote `text/html` output is sanitized before it reaches the page: `<script>`, `<style>`
and every `on*` handler are stripped, while the table markup and inline styles that pandas
emits are kept. Notebooks are fetched from arbitrary URLs, so this is not optional.

Unreachable notebooks leave the original link in place, marked
`.notebook-link-unavailable`, rather than silently disappearing.

The header shows the source site's favicon, fetched once at build time and inlined as a
data URI, cached per host next to the notebooks. Inlining matters: a favicon referenced by
URL would make every reader's browser announce itself to the source site or to a favicon
service on page load. When no favicon can be found, the hostname is shown as text instead.

## Quartz v4

The original single-file version is frozen at [`legacy/v4/notebook.ts`](legacy/v4/notebook.ts):

- Put `notebook.ts` in `quartz/plugins/transformers/`
- `npm install rehype-stringify`
- Append `export { NotebookEmbedding } from "./notebook"` to `quartz/plugins/transformers/index.ts`
- Add `Plugin.NotebookEmbedding()` **above** `SyntaxHighlighting` in `quartz.config.ts`

New work happens against v5. Three bugs in that file are fixed only in the v5 version: its
dark-mode rules targeted `data-theme` where Quartz sets `saved-theme`, so none of them ever
applied; the toggle button carried both an inline `onclick` and a listener that cancelled
each other out; and every embedded notebook inlined its own copy of the full stylesheet and
script.

## Development

```bash
npm install
npm run build      # rebuilds dist/ — commit it, Quartz installs from it
npm run typecheck
npm test           # builds, then runs the offline smoke test
```

The smoke test seeds the cache and never touches the network.

To develop against a local Quartz site, point its config at the working copy instead of the
published source — Quartz symlinks it, so edits here are live after a rebuild:

```yaml
plugins:
  - source: ../quartz-jupyter-embed
    enabled: true
    order: 15
```

```bash
(cd ../quartz-jupyter-embed && npm run build) && npx quartz build
```
