import { QuartzTransformerPlugin } from '@quartz-community/types';
export { NoteMeta, NoteMetaOptions } from './components/index.js';

/**
 * Copia `created at` / `modified at` do frontmatter para as chaves canônicas.
 * Precisa rodar depois do note-properties (que parseia o frontmatter) e antes do
 * created-modified-date (que o consome) — veja o `order` em quartz.config.yaml.
 */
declare const NoteMetaDates: QuartzTransformerPlugin;

export { NoteMetaDates, NoteMetaDates as default };
