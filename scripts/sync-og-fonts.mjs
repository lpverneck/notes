/**
 * Seeds the font cache read by @quartz-community/og-image.
 *
 * That plugin always resolves `theme.typography` against Google Fonts, ignoring
 * `theme.fontOrigin: local`. Since iA Writer Quattro S is not on Google Fonts,
 * it would fall back to a system font (which breaks Satori on macOS). It does
 * check a local cache first, so we seed that cache from a versioned asset.
 *
 * Fonts must be TTF/OTF/WOFF — Satori cannot parse WOFF2.
 */
import fs from "node:fs/promises"
import path from "node:path"

const ASSET_DIR = path.join("assets", "fonts", "ia-writer-quattro")
const CACHE_DIR = path.join("quartz", ".quartz-cache", "fonts")

// Cache key format is `${family.replaceAll(" ", "+")}-${weight}`.
const FONTS = [
  { file: "iAWriterQuattroS-Regular.ttf", cacheKey: "iA+Writer+Quattro+S-400" },
  { file: "iAWriterQuattroS-Bold.ttf", cacheKey: "iA+Writer+Quattro+S-700" },
]

await fs.mkdir(CACHE_DIR, { recursive: true })

for (const { file, cacheKey } of FONTS) {
  const src = path.join(ASSET_DIR, file)
  const dest = path.join(CACHE_DIR, cacheKey)
  await fs.copyFile(src, dest)
  console.log(`og-fonts: ${src} -> ${dest}`)
}
