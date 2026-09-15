import type { QuartzTransformerPlugin } from "@quartz-community/types"

/**
 * Aliases de data aceitos, por chave canônica. O Quartz só entende as canônicas:
 * `@quartz-community/created-modified-date` lê `frontmatter.created`/`.modified`, e é
 * o que alimenta `fileData.dates` — usado pelas listagens de pasta, pela ordenação e
 * pelo RSS. Notas escritas com `created at:` ficariam sem data nenhuma.
 */
const DATE_ALIASES: Record<string, string[]> = {
  created: ["created at", "createdAt", "created_at"],
  modified: ["modified at", "modifiedAt", "modified_at", "updated at"],
  published: ["published at", "publishedAt", "published_at"],
}

/**
 * Copia `created at` / `modified at` do frontmatter para as chaves canônicas.
 * Precisa rodar depois do note-properties (que parseia o frontmatter) e antes do
 * created-modified-date (que o consome) — veja o `order` em quartz.config.yaml.
 */
export const NoteMetaDates: QuartzTransformerPlugin = () => ({
  name: "NoteMetaDates",
  markdownPlugins() {
    return [
      () => (_tree: unknown, file: { data: { frontmatter?: Record<string, unknown> } }) => {
        const frontmatter = file.data.frontmatter
        if (!frontmatter) return

        for (const [canonical, aliases] of Object.entries(DATE_ALIASES)) {
          if (frontmatter[canonical] !== undefined) continue
          const alias = aliases.find((name) => frontmatter[name] !== undefined)
          if (alias !== undefined) frontmatter[canonical] = frontmatter[alias]
        }
      },
    ]
  },
})

export default NoteMetaDates
