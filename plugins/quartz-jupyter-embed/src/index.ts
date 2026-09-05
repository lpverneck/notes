import fs from "node:fs/promises"
import path from "node:path"
import type { BuildCtx, QuartzTransformerPlugin } from "@quartz-community/types"
import type { Element, Root } from "hast"
import { fromHtml } from "hast-util-from-html"
import { defaultSchema, sanitize } from "hast-util-sanitize"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import { visit } from "unist-util-visit"

interface Options {
  /** Where downloaded notebooks are cached. Relative to the Quartz root. */
  cacheDir: string
  /** Fetch notebooks over the network. Disable for fully offline builds. */
  downloadFromGitHub: boolean
  /** Abort a notebook download after this many milliseconds. */
  downloadTimeout: number
  /**
   * Base URL of the GitHub repo notebooks live in, e.g. "https://github.com/owner/repo".
   * A link to a `.ipynb` file that isn't already an absolute URL is treated as a path
   * relative to the Quartz root and resolved against this to build a `blob` URL.
   * Leave unset to disable this resolution — relative links are then left untouched.
   */
  repoUrl?: string
  /** Git ref (branch, tag, or commit) used when building the `blob` URL above. */
  repoRef: string
}

const defaultOptions: Options = {
  cacheDir: ".quartz-cache/notebooks",
  downloadFromGitHub: true,
  downloadTimeout: 15000,
  repoRef: "main",
}

interface NotebookCell {
  cell_type: string
  source: string[] | string
  outputs?: NotebookOutput[]
  execution_count?: number | null
}

interface NotebookOutput {
  output_type: string
  text?: string[] | string
  traceback?: string[]
  data?: Record<string, string[] | string>
}

interface NotebookData {
  cells: NotebookCell[]
  metadata?: {
    language_info?: { name?: string }
    kernelspec?: { language?: string }
  }
}

/**
 * Notebooks are fetched from arbitrary URLs, and `text/html` outputs are raw
 * remote markup. Sanitize before it reaches the page: this strips <script>,
 * <style> and every on* handler while keeping the table/div/span markup that
 * pandas and friends emit. `style` and `class` are allowed through so
 * DataFrame formatting survives.
 */
const outputSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "className", "style"],
  },
}

const joinSource = (source: string[] | string | undefined): string =>
  Array.isArray(source) ? source.join("") : (source ?? "")

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")

export const NotebookEmbedding: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  const markdownToHtml = async (markdown: string): Promise<string> => {
    try {
      const result = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(markdown)
      return String(result.value)
    } catch (error) {
      console.warn("[jupyter-embed] could not render a markdown cell:", error)
      return `<p>${escapeHtml(markdown)}</p>`
    }
  }

  const sanitizeFragment = (html: string): string => {
    const tree = sanitize(fromHtml(html, { fragment: true }), outputSchema)
    return unified()
      .use(rehypeStringify, { allowDangerousHtml: false })
      .stringify(tree as Root)
  }

  const formatOutput = (output: NotebookOutput): string => {
    if (output.output_type === "stream") {
      return `<div class="notebook-stream-output"><pre>${escapeHtml(joinSource(output.text))}</pre></div>`
    }

    if (output.output_type === "error") {
      const traceback = output.traceback?.join("\n") ?? ""
      return `<div class="notebook-error-output"><pre>${escapeHtml(traceback)}</pre></div>`
    }

    if (output.output_type !== "execute_result" && output.output_type !== "display_data") {
      return ""
    }
    if (!output.data) return ""

    let content = ""

    // Richest representation wins, matching how Jupyter itself picks: an HTML
    // table beats the text/plain repr of the same DataFrame.
    if (output.data["text/html"]) {
      content += `<div class="notebook-html-output">${sanitizeFragment(joinSource(output.data["text/html"]))}</div>`
    } else if (output.data["text/plain"]) {
      content += `<div class="notebook-text-output"><pre>${escapeHtml(joinSource(output.data["text/plain"]))}</pre></div>`
    }

    if (output.data["image/png"]) {
      const b64 = joinSource(output.data["image/png"]).replace(/\s/g, "")
      content += `<div class="notebook-image-output"><img src="data:image/png;base64,${b64}" alt="Notebook output" loading="lazy" /></div>`
    }

    return content
  }

  const cellToHtml = async (
    cell: NotebookCell,
    index: number,
    language: string,
  ): Promise<string> => {
    let content = ""

    if (cell.cell_type === "markdown") {
      content = `<div class="notebook-markdown-cell">${await markdownToHtml(joinSource(cell.source))}</div>`
    } else if (cell.cell_type === "code") {
      const count = cell.execution_count ?? null
      const label = count === null ? "In [ ]:" : `In [${count}]:`

      content = `<div class="notebook-code-input">
          <div class="notebook-execution-count">${label}</div>
          <div class="notebook-code-content"><pre><code class="language-${escapeHtml(language)}">${escapeHtml(joinSource(cell.source))}</code></pre></div>
        </div>`

      if (cell.outputs?.length) {
        const outputs = cell.outputs.map(formatOutput).join("")
        if (outputs) {
          content += `<div class="notebook-outputs">
            <div class="notebook-output-label">${count === null ? "Out[ ]:" : `Out[${count}]:`}</div>
            <div class="notebook-output-content">${outputs}</div>
          </div>`
        }
      }
    } else {
      return ""
    }

    return `<div id="notebook-cell-${index}" class="notebook-cell notebook-${escapeHtml(cell.cell_type)}-cell">${content}</div>`
  }

  /**
   * The source site's favicon, inlined as a data URI.
   *
   * Fetched at build time and cached per host, so a page view makes no request
   * to the source site or to a favicon service. The v4 version put the service
   * URL directly in `<img src>`, which meant every reader announced themselves
   * to Google or DuckDuckGo just by loading the page.
   */
  const faviconDataUri = async (host: string): Promise<string | null> => {
    const cachePath = path.join(opts.cacheDir, `favicon-${host}.txt`)
    try {
      return await fs.readFile(cachePath, "utf-8")
    } catch {
      /* not cached yet */
    }
    if (!opts.downloadFromGitHub) return null

    for (const candidate of [
      `https://${host}/favicon.ico`,
      `https://icons.duckduckgo.com/ip3/${host}.ico`,
    ]) {
      try {
        const response = await fetch(candidate, {
          signal: AbortSignal.timeout(opts.downloadTimeout),
        })
        if (!response.ok) continue

        const type = response.headers.get("content-type") ?? "image/x-icon"
        if (!type.startsWith("image/")) continue

        const bytes = Buffer.from(await response.arrayBuffer())
        // Skip empty bodies and anything too big to reasonably inline.
        if (bytes.byteLength === 0 || bytes.byteLength > 64 * 1024) continue

        const uri = `data:${type};base64,${bytes.toString("base64")}`
        await fs.mkdir(opts.cacheDir, { recursive: true }).catch(() => {})
        await fs.writeFile(cachePath, uri).catch(() => {})
        return uri
      } catch {
        /* try the next candidate */
      }
    }
    return null
  }

  const notebookToHtml = async (notebook: NotebookData, sourceUrl: string): Promise<string> => {
    const language =
      notebook.metadata?.language_info?.name ?? notebook.metadata?.kernelspec?.language ?? "python"

    const cells = (
      await Promise.all(notebook.cells.map((cell, i) => cellToHtml(cell, i, language)))
    ).join("\n")

    const name = sourceUrl.split("/").pop() || "notebook.ipynb"
    let host = ""
    try {
      host = new URL(sourceUrl).hostname
    } catch {
      /* a relative or malformed URL just gets no host label */
    }

    // Falls back to the hostname as text when there is no favicon to be had,
    // so the source is always attributed one way or the other.
    const favicon = host ? await faviconDataUri(host) : null

    // No inline <style>/<script> here: both live in externalResources() so they
    // are emitted once per site instead of once per embedded notebook.
    return `<div class="notebook-header">
        <button class="notebook-toggle" type="button" aria-expanded="true" aria-label="Toggle notebook">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="5 8 14 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="notebook-fold"><polyline points="6 9 12 15 18 9"></polyline></svg>
          <span class="notebook-title">Jupyter Notebook</span>
        </button>
        <div class="notebook-source">
          <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer" class="notebook-link">${escapeHtml(name)}</a>
          ${
            favicon
              ? // A background-image, not an <img>, on purpose. The favicon is
                // decorative, and as an <img> it gets picked up by image-zoom
                // style plugins that tag every image on the page — leaving you
                // able to click a 16px icon open in a lightbox.
                `<span class="notebook-favicon" style="background-image:url(${favicon})" role="img" aria-label="Source: ${escapeHtml(host)}" title="Source: ${escapeHtml(host)}"></span>`
              : host
                ? `<span class="notebook-host">${escapeHtml(host)}</span>`
                : ""
          }
        </div>
      </div>
      <div class="notebook-content"><div class="notebook-cells">${cells}</div></div>`
  }

  // ponytail: cache entries never expire, so an updated notebook keeps serving
  // the old render until the cache dir is deleted. Add an mtime/TTL check here
  // if that becomes annoying.
  const cachePathFor = (url: string) =>
    path.join(opts.cacheDir, `${Buffer.from(url).toString("base64url")}.json`)

  const readCache = async (url: string): Promise<NotebookData | null> => {
    try {
      return JSON.parse(await fs.readFile(cachePathFor(url), "utf-8")) as NotebookData
    } catch {
      return null
    }
  }

  const writeCache = async (url: string, data: NotebookData): Promise<void> => {
    try {
      await fs.mkdir(opts.cacheDir, { recursive: true })
      await fs.writeFile(cachePathFor(url), JSON.stringify(data))
    } catch (error) {
      console.warn(`[jupyter-embed] could not cache ${url}:`, error)
    }
  }

  // Local notebooks are read straight off disk on every build — there's no
  // point caching a filesystem read, and caching would just serve stale
  // content across a `--serve` file-watch rebuild.
  const readLocalNotebook = async (relativePath: string): Promise<NotebookData | null> => {
    const absolutePath = path.resolve(process.cwd(), relativePath)
    try {
      return JSON.parse(await fs.readFile(absolutePath, "utf-8")) as NotebookData
    } catch (error) {
      console.warn(`[jupyter-embed] could not read local notebook ${absolutePath}:`, error)
      return null
    }
  }

  const githubBlobUrl = (relativePath: string): string | null =>
    opts.repoUrl ? `${opts.repoUrl.replace(/\/+$/, "")}/blob/${opts.repoRef}/${relativePath}` : null

  const download = async (url: string): Promise<NotebookData | null> => {
    // github.com/<o>/<r>/blob/<ref>/<path> serves HTML, not JSON — rewrite to raw.
    const rawUrl =
      url.includes("github.com") && !url.includes("raw.githubusercontent.com")
        ? url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/")
        : url

    try {
      const response = await fetch(rawUrl, {
        signal: AbortSignal.timeout(opts.downloadTimeout),
      })
      if (!response.ok) {
        console.warn(`[jupyter-embed] ${rawUrl} returned ${response.status}`)
        return null
      }
      return JSON.parse(await response.text()) as NotebookData
    } catch (error) {
      console.warn(`[jupyter-embed] could not fetch ${rawUrl}:`, error)
      return null
    }
  }

  return {
    name: "NotebookEmbedding",
    htmlPlugins(ctx: BuildCtx) {
      // `--serve` is the local preview/editing loop, so notebooks are embedded
      // straight from disk there. Any other build (including the one that
      // produces the deployed site) links out to the file on GitHub instead —
      // see readLocalNotebook/githubBlobUrl below.
      const isServe = ctx.argv.serve

      return [
        () => {
          return async (tree: Root, _file: unknown) => {
            // Collect first, then await: visit() is synchronous and cannot be
            // given an async visitor.
            const links: Element[] = []
            visit(tree, "element", (node: Element) => {
              const href = node.properties?.href
              if (node.tagName === "a" && typeof href === "string" && href.endsWith(".ipynb")) {
                links.push(node)
              }
            })
            if (links.length === 0) return

            await Promise.all(
              links.map(async (node) => {
                const href = node.properties!.href as string
                try {
                  if (!/^https?:\/\//.test(href)) {
                    // A relative link: resolved against the Quartz root, not
                    // fetched — see readLocalNotebook.
                    const relativePath = href.replace(/^\.?\//, "")
                    const blobUrl = githubBlobUrl(relativePath)

                    if (!isServe) {
                      // Production build: point straight at the file on GitHub
                      // rather than embedding it into the built site.
                      node.properties = {
                        ...node.properties,
                        href: blobUrl ?? href,
                        target: "_blank",
                        rel: ["noopener", "noreferrer"],
                      }
                      return
                    }

                    const notebook = await readLocalNotebook(relativePath)
                    if (!notebook?.cells) {
                      node.properties = {
                        ...node.properties,
                        className: ["notebook-link-unavailable"],
                      }
                      return
                    }

                    const html = await notebookToHtml(notebook, blobUrl ?? href)
                    node.tagName = "div"
                    node.properties = {
                      className: ["jupyter-notebook-embedded"],
                      "data-notebook-url": blobUrl ?? href,
                    }
                    node.children = fromHtml(html, { fragment: true }).children as Element[]
                    return
                  }

                  let notebook = await readCache(href)
                  if (!notebook && opts.downloadFromGitHub) {
                    notebook = await download(href)
                    if (notebook) await writeCache(href, notebook)
                  }

                  if (!notebook?.cells) {
                    // Leave the link usable, just flagged, so a failed fetch
                    // never silently deletes the reader's way through.
                    node.properties = {
                      ...node.properties,
                      className: ["notebook-link-unavailable"],
                    }
                    return
                  }

                  const html = await notebookToHtml(notebook, href)
                  node.tagName = "div"
                  node.properties = {
                    className: ["jupyter-notebook-embedded"],
                    "data-notebook-url": href,
                  }
                  node.children = fromHtml(html, { fragment: true }).children as Element[]
                } catch (error) {
                  console.warn(`[jupyter-embed] could not embed ${href}:`, error)
                }
              }),
            )
          }
        },
      ]
    },
    externalResources() {
      return {
        css: [
          {
            inline: true,
            content: `
.jupyter-notebook-embedded {
  border: 2px solid var(--secondary);
  border-radius: 12px;
  margin: 1.5rem 0;
  background: var(--light);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Collapse with grid-template-rows rather than a max-height guess, so the
   transition is correct for both a 3-cell and a 300-cell notebook. */
.notebook-content {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.3s ease;
  overflow: hidden;
}

.jupyter-notebook-embedded.collapsed .notebook-content {
  grid-template-rows: 0fr;
}

.notebook-cells {
  min-height: 0;
  overflow: hidden;
}

.jupyter-notebook-embedded.collapsed .notebook-fold {
  transform: rotateZ(-90deg);
}

.notebook-header {
  background: var(--secondary);
  padding: 0.6rem 1.5rem;
  border-bottom: 1px solid var(--gray);
  font-weight: 700;
  color: var(--light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.notebook-toggle {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  padding: 0;
  transition: opacity 0.2s ease;
}

.notebook-toggle:hover {
  opacity: 0.8;
}

.notebook-fold {
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.notebook-source {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 400;
  font-size: 0.9em;
  min-width: 0;
}

.notebook-link {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px dotted currentColor;
  transition: border-bottom-style 0.2s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notebook-link:hover {
  border-bottom-style: solid;
}

.notebook-host {
  opacity: 0.7;
  font-size: 0.85em;
  flex-shrink: 0;
}

.notebook-favicon {
  display: inline-block;
  width: 16px;
  height: 16px;
  opacity: 0.9;
  flex-shrink: 0;
  border-radius: 2px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.notebook-cell {
  border-bottom: 1px solid var(--lightgray);
  padding: 0.75rem 1.5rem;
}

.notebook-cell:last-child {
  border-bottom: none;
}

.notebook-markdown-cell {
  line-height: 1.6;
}

.notebook-markdown-cell > :first-child {
  margin-top: 0;
}

.notebook-markdown-cell > :last-child {
  margin-bottom: 0;
}

.notebook-code-input,
.notebook-outputs {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.notebook-code-input {
  margin: 0.25rem 0;
}

.notebook-outputs {
  margin-top: 0.5rem;
}

.notebook-execution-count,
.notebook-output-label {
  color: var(--secondary);
  font-family: var(--codeFont, monospace);
  font-size: 0.9em;
  font-weight: bold;
  min-width: 85px;
  user-select: none;
  flex-shrink: 0;
}

.notebook-execution-count {
  padding-top: 0.75rem;
}

.notebook-output-label {
  padding-top: 0.5rem;
}

.notebook-code-content,
.notebook-output-content {
  flex: 1;
  min-width: 0;
}

.notebook-code-content pre {
  margin: 0;
  overflow-x: auto;
  overflow-y: hidden;
}

.notebook-text-output pre,
.notebook-stream-output pre {
  background: var(--lightgray);
  border: 1px solid var(--gray);
  border-radius: 6px;
  padding: 0.75rem;
  margin: 0;
  overflow-x: auto;
  font-size: 0.9em;
  color: var(--dark);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.notebook-html-output {
  overflow-x: auto;
}

.notebook-html-output table {
  font-size: 0.85em;
}

.notebook-image-output {
  text-align: center;
  padding: 1rem;
  background: var(--lightgray);
  border: 1px solid var(--gray);
  border-radius: 6px;
  margin: 0.5rem 0;
}

.notebook-image-output img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
}

.notebook-error-output pre {
  background: #fdf2f2;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  padding: 1rem;
  margin: 0;
  color: #dc2626;
  font-size: 0.9em;
  overflow-x: auto;
  white-space: pre-wrap;
}

.notebook-link-unavailable {
  color: var(--gray) !important;
  text-decoration: line-through;
}

.notebook-link-unavailable::after {
  content: " (notebook unavailable)";
  font-size: 0.8em;
  color: var(--gray);
}

/* Quartz sets saved-theme, not data-theme. The v4 version of this plugin used
   data-theme, so none of its dark-mode rules ever matched. */
:root[saved-theme="dark"] .jupyter-notebook-embedded {
  background: var(--light);
}

:root[saved-theme="dark"] .notebook-text-output pre,
:root[saved-theme="dark"] .notebook-stream-output pre,
:root[saved-theme="dark"] .notebook-image-output {
  background: var(--lightgray);
  border-color: var(--gray);
}

:root[saved-theme="dark"] .notebook-execution-count,
:root[saved-theme="dark"] .notebook-output-label {
  color: var(--tertiary);
}

:root[saved-theme="dark"] .notebook-error-output pre {
  background: #2d1b1b;
  border-color: #991b1b;
  color: #fca5a5;
}

@media (prefers-reduced-motion: reduce) {
  .notebook-content,
  .notebook-fold {
    transition: none;
  }
}
            `,
          },
        ],
        js: [
          {
            loadTime: "afterDOMReady",
            contentType: "inline",
            script: `
              // Guard against re-execution on SPA navigation, which would other-
              // wise bind a second handler per page view.
              if (!window.__jupyterEmbedReady) {
                window.__jupyterEmbedReady = true;
                var KEY = 'quartz-jupyter-collapsed';

                function readState() {
                  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
                  catch (e) { return {}; }
                }

                function apply(nb, collapsed) {
                  nb.classList.toggle('collapsed', collapsed);
                  var btn = nb.querySelector('.notebook-toggle');
                  if (btn) btn.setAttribute('aria-expanded', String(!collapsed));
                }

                // One delegated listener, so notebooks added by SPA navigation
                // need neither re-binding nor a DOM observer watching the body.
                document.addEventListener('click', function (e) {
                  var btn = e.target && e.target.closest
                    ? e.target.closest('.notebook-toggle')
                    : null;
                  if (!btn) return;
                  var nb = btn.closest('.jupyter-notebook-embedded');
                  if (!nb) return;

                  var collapsed = !nb.classList.contains('collapsed');
                  apply(nb, collapsed);

                  var id = nb.getAttribute('data-notebook-url');
                  if (id) {
                    var state = readState();
                    state[id] = collapsed;
                    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
                  }
                });

                function restore() {
                  var state = readState();
                  document.querySelectorAll('.jupyter-notebook-embedded').forEach(function (nb) {
                    var id = nb.getAttribute('data-notebook-url');
                    if (id && state[id]) apply(nb, true);
                  });
                }

                document.addEventListener('nav', restore);
                restore();
              }
            `,
          },
        ],
      }
    },
  }
}

export default NotebookEmbedding
