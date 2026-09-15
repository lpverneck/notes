import { QuartzComponentConstructor } from '@quartz-community/types';

interface NoteMetaOptions {
    /** Exibe a linha `created at`, lida do frontmatter da nota. */
    showCreated: boolean;
    /** Exibe a linha `modified at`, lida do frontmatter da nota. */
    showModified: boolean;
    /** Exibe a linha `duration`: minutos estimados e total de palavras. */
    showDuration: boolean;
    /** Velocidade de leitura usada para derivar os minutos. */
    wordsPerMinute: number;
}
declare const NoteMeta: QuartzComponentConstructor<Partial<NoteMetaOptions>>;

export { NoteMeta, type NoteMetaOptions };
