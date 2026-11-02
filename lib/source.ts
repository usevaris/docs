import { llms, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { withBasePath } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { openapi } from './openapi';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const source = loader(
  {
    docs: docs.toFumadocsSource(),
    // One virtual page per operation in openapi.yaml, under /docs/reference.
    openapi: await openapi.staticSource({ baseDir: 'reference' }),
  },
  {
    baseUrl: '/',
    // No openapi.loaderPlugin(): app/(docs)/layout.tsx draws method badges.
    plugins: [lucideIconsPlugin()],
  },
);

export const docsLlms = llms(source, {
  renderPage: async (page) => {
    const body =
      page.type === 'openapi'
        ? (page.data.description ?? '')
        : await page.data.getText('processed');

    return `# ${page.data.title} (${withBasePath(page.url)})

${body}`;
  },
});

/**
 * The newest year's changelog page, such as /changelog/2026. /changelog
 * redirects here. Each year is a page in content/docs/changelog named by
 * its year, so the newest is the highest year that has a page, whatever
 * today's date.
 */
export function latestChangelogUrl(): string | undefined {
  const years = source
    .getPages()
    .filter((page) => page.slugs.length === 2 && page.slugs[0] === 'changelog' && /^\d{4}$/.test(page.slugs[1]))
    .sort((a, b) => Number(b.slugs[1]) - Number(a.slugs[1]));
  return years[0]?.url;
}
