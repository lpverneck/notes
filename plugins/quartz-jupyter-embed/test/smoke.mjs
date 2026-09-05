// ponytail: one assert-based check against the built output, no test framework.
// Runs fully offline — the cache is seeded, so nothing is fetched.
// Run with `npm test` (builds first) or `node test/smoke.mjs`.
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import * as mod from "../dist/index.js"
import { NotebookEmbedding } from "../dist/index.js"

// Quartz's config-loader picks the `default` export and classifies the plugin by
// probing the instance. If this drifts, Quartz skips the plugin with only a warning.
assert.equal(typeof mod.default, "function")
assert.ok("htmlPlugins" in mod.default(), "must classify as a transformer")

const URL_ = "https://github.com/vazome/example/blob/main/demo.ipynb"

const NOTEBOOK = {
  metadata: { language_info: { name: "python" } },
  cells: [
    { cell_type: "markdown", source: ["# Heading\n", "\n", "Some *emphasis*.\n"] },
    {
      cell_type: "code",
      execution_count: 1,
      source: ["print('hi')\n"],
      outputs: [{ output_type: "stream", text: ["hi\n"] }],
    },
    {
      cell_type: "code",
      execution_count: 2,
      source: ["df\n"],
      outputs: [
        {
          output_type: "execute_result",
          data: {
            // A hostile remote notebook: the script and the handler must not survive.
            "text/html":
              '<script>alert(1)</script><table><tr><td onclick="x()">42</td></tr></table>',
            "text/plain": ["   n\n0  42"],
          },
        },
      ],
    },
    {
      cell_type: "code",
      execution_count: 3,
      source: ["plot()\n"],
      outputs: [{ output_type: "display_data", data: { "image/png": "iVBORw0KGgo=" } }],
    },
    { cell_type: "raw", source: ["ignored\n"] },
  ],
}

const cacheDir = await fs.mkdtemp(path.join(os.tmpdir(), "jupyter-embed-test-"))
await fs.writeFile(
  path.join(cacheDir, `${Buffer.from(URL_).toString("base64url")}.json`),
  JSON.stringify(NOTEBOOK),
)

const link = {
  type: "element",
  tagName: "a",
  properties: { href: URL_ },
  children: [{ type: "text", value: "demo.ipynb" }],
}
const missing = {
  type: "element",
  tagName: "a",
  properties: { href: "https://example.com/nope.ipynb" },
  children: [],
}
const plain = {
  type: "element",
  tagName: "a",
  properties: { href: "https://example.com/page.html" },
  children: [],
}

const tree = {
  type: "root",
  children: [{ type: "element", tagName: "p", properties: {}, children: [link, missing, plain] }],
}

// downloadFromGitHub:false keeps this test hermetic: the seeded cache is the
// only source, and the un-cached link must degrade rather than hang.
const plugin = NotebookEmbedding({ cacheDir, downloadFromGitHub: false })
await plugin.htmlPlugins()[0]()(tree, {})

const serialized = JSON.stringify(link)

// The link became the embed container.
assert.equal(link.tagName, "div")
assert.deepEqual(link.properties.className, ["jupyter-notebook-embedded"])
assert.equal(link.properties["data-notebook-url"], URL_)
assert.ok(link.children.length > 0, "embed must have children")

// Cells rendered: markdown, execution labels, stream output, image, rich output.
assert.match(serialized, /Heading/, "markdown cell must render")
assert.match(serialized, /In \[1\]:/, "execution count must render")
assert.match(serialized, /Out\[1\]:/, "output label must render")
assert.match(serialized, /data:image\/png;base64,iVBORw0KGgo=/, "png output must render")
assert.match(serialized, /42/, "html output must render")

// Sanitization of remote text/html — the whole reason this path is guarded.
assert.doesNotMatch(serialized, /alert\(1\)/, "remote <script> must be stripped")
assert.doesNotMatch(serialized, /onclick/, "remote event handlers must be stripped")

// text/html wins over text/plain for the same output, as Jupyter itself does.
assert.doesNotMatch(serialized, /0 {2}42/, "text/plain must not duplicate the html table")

// A raw cell is skipped, not rendered as an empty shell.
assert.doesNotMatch(serialized, /notebook-raw-cell/, "raw cells must be skipped")

// An unreachable notebook keeps a usable link rather than vanishing.
assert.equal(missing.tagName, "a", "failed fetch must leave the link intact")
assert.deepEqual(missing.properties.className, ["notebook-link-unavailable"])

// A non-notebook link is untouched.
assert.equal(plain.tagName, "a")
assert.equal(plain.properties.className, undefined)

// No favicon cached and no network: attribute the source as text instead.
assert.match(serialized, /notebook-host/, "must fall back to the hostname")
assert.doesNotMatch(serialized, /notebook-favicon/, "no favicon without one available")

// With a favicon cached, it is inlined as a data URI. The point is that the
// reader's browser makes no request to the source site or a favicon service,
// which is what the v4 version did by putting the service URL in <img src>.
await fs.writeFile(
  path.join(cacheDir, "favicon-github.com.txt"),
  "data:image/png;base64,iVBORw0KGgo=",
)

const link2 = {
  type: "element",
  tagName: "a",
  properties: { href: URL_ },
  children: [{ type: "text", value: "demo.ipynb" }],
}
const tree2 = {
  type: "root",
  children: [{ type: "element", tagName: "p", properties: {}, children: [link2] }],
}
await NotebookEmbedding({ cacheDir, downloadFromGitHub: false }).htmlPlugins()[0]()(tree2, {})

const serialized2 = JSON.stringify(link2)
assert.match(serialized2, /notebook-favicon/, "cached favicon must be used")
assert.match(serialized2, /data:image\/png;base64,iVBORw0KGgo=/, "favicon must be inlined")
assert.doesNotMatch(serialized2, /google\.com|duckduckgo/, "no third-party URL may reach the page")

// The favicon must not be an <img>: plugins that tag every image on the page
// would otherwise make a 16px decorative icon clickable into a lightbox.
const favicons = []
JSON.parse(serialized2, function walk(k, v) {
  if (v && v.tagName && String(v.properties?.className ?? "").includes("notebook-favicon")) {
    favicons.push(v.tagName)
  }
  return v
})
assert.deepEqual(favicons, ["span"], "favicon must be a background-image span, not an <img>")

// Relative links (not http/https) are read straight off disk instead of
// fetched, and always embedded — both `--serve` and the build that ships to
// GitHub Pages have the full repo checked out locally.
const repoRoot = await fs.mkdtemp(path.join(os.tmpdir(), "jupyter-embed-repo-"))
await fs.mkdir(path.join(repoRoot, "notebooks"), { recursive: true })
await fs.writeFile(path.join(repoRoot, "notebooks", "local.ipynb"), JSON.stringify(NOTEBOOK))

const originalCwd = process.cwd()
process.chdir(repoRoot)
try {
  const localLink = {
    type: "element",
    tagName: "a",
    properties: { href: "notebooks/local.ipynb" },
    children: [{ type: "text", value: "local.ipynb" }],
  }
  const localTree = {
    type: "root",
    children: [{ type: "element", tagName: "p", properties: {}, children: [localLink] }],
  }
  const repoPlugin = NotebookEmbedding({
    cacheDir,
    downloadFromGitHub: false,
    repoUrl: "https://github.com/owner/repo",
  })
  await repoPlugin.htmlPlugins()[0]()(localTree, {})

  assert.equal(localLink.tagName, "div", "a relative link must be embedded")
  assert.equal(
    localLink.properties["data-notebook-url"],
    "https://github.com/owner/repo/blob/main/notebooks/local.ipynb",
    "embed must be tagged with the GitHub blob URL, not the local path",
  )
  assert.match(JSON.stringify(localLink), /Heading/, "local notebook content must render")

  // Without repoUrl configured, the embed still happens — only the
  // source/attribution link falls back to the raw relative path.
  const noRepoLink = {
    type: "element",
    tagName: "a",
    properties: { href: "notebooks/local.ipynb" },
    children: [{ type: "text", value: "local.ipynb" }],
  }
  const noRepoTree = {
    type: "root",
    children: [{ type: "element", tagName: "p", properties: {}, children: [noRepoLink] }],
  }
  await NotebookEmbedding({ cacheDir, downloadFromGitHub: false }).htmlPlugins()[0]()(
    noRepoTree,
    {},
  )
  assert.equal(noRepoLink.tagName, "div", "embedding must not require repoUrl")
  assert.equal(noRepoLink.properties["data-notebook-url"], "notebooks/local.ipynb")
} finally {
  process.chdir(originalCwd)
  await fs.rm(repoRoot, { recursive: true, force: true })
}

// Resources are shaped the way Quartz expects.
const res = NotebookEmbedding().externalResources()
assert.equal(res.css[0].inline, true)
assert.equal(res.js[0].contentType, "inline")
assert.equal(res.js[0].loadTime, "afterDOMReady")

// Regressions already paid for once in v4, asserted so they cannot come back:
const css = res.css[0].content
const script = res.js[0].script
assert.doesNotMatch(css, /\[data-theme/, "Quartz uses saved-theme; data-theme never matched")
assert.match(css, /saved-theme/, "dark mode must target saved-theme")
assert.doesNotMatch(script, /MutationObserver/, "delegation replaces observing the whole body")
assert.match(script, /__jupyterEmbedReady/, "must guard against rebinding on SPA nav")

// The v4 markup carried an inline onclick AND a listener, so a click toggled
// twice and appeared to do nothing.
assert.doesNotMatch(JSON.stringify(res), /onclick/, "no inline handlers")

await fs.rm(cacheDir, { recursive: true, force: true })
console.log("ok — smoke tests passed")
