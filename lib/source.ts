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
    plugins: [lucideIconsPlugin(), openapi.loaderPlugin()],
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
