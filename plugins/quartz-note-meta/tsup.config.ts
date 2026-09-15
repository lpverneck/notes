import { defineConfig } from "tsup"

export default defineConfig({
  entry: { index: "src/index.ts", "components/index": "src/components/index.ts" },
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  target: "es2022",
  platform: "node",
  outDir: "dist",
  // Bundla tudo, inclusive preact/jsx-runtime. É o que os componentes oficiais
  // (@quartz-community/content-meta, note-properties) fazem: seus dists não têm
  // nenhum import bare de preact. Deixá-lo externo num plugin local só criaria um
  // import que o Node resolveria pelo node_modules do próprio plugin.
  noExternal: [/.*/],
  external: [],
  esbuildOptions(options) {
    options.jsx = "automatic"
    options.jsxImportSource = "preact"
  },
})
