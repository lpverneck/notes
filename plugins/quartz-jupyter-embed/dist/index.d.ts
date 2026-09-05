import { QuartzTransformerPlugin } from '@quartz-community/types';

interface Options {
    /** Where downloaded notebooks are cached. Relative to the Quartz root. */
    cacheDir: string;
    /** Fetch notebooks over the network. Disable for fully offline builds. */
    downloadFromGitHub: boolean;
    /** Abort a notebook download after this many milliseconds. */
    downloadTimeout: number;
    /**
     * Base URL of the GitHub repo notebooks live in, e.g. "https://github.com/owner/repo".
     * A link to a `.ipynb` file that isn't already an absolute URL is treated as a path
     * relative to the Quartz root, read straight off disk, and always embedded. This is
     * used only to build the `blob` URL shown as the embed's source/attribution link.
     * Leave unset and the raw relative path is shown there instead.
     */
    repoUrl?: string;
    /** Git ref (branch, tag, or commit) used when building the `blob` URL above. */
    repoRef: string;
}
declare const NotebookEmbedding: QuartzTransformerPlugin<Partial<Options>>;

export { NotebookEmbedding, NotebookEmbedding as default };
