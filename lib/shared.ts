export const appName = 'Varis Docs';
export const siteUrl = 'https://usevaris.com';
export const githubUrl = 'https://github.com/usevaris/docs';
// The API's origin, as in the servers list of openapi.yaml.
export const apiOrigin = 'https://api.usevaris.com';

// The docs are a zone of usevaris.com: the main app rewrites /docs and
// /docs/* to this app, so every route here lives under basePath. Next adds
// basePath to <Link> and router paths on its own; anything fetched by URL
// (search, markdown) needs withBasePath.
export const basePath = '/docs';

export function withBasePath(path: string) {
  return `${basePath}${path === '/' ? '' : path}`;
}

// Each page's markdown, for AI readers, is served by app/llms.mdx.
export const docsContentRoute = '/llms.mdx';

export function getPageMarkdownUrl(page: { slugs: string[] }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: withBasePath(`${docsContentRoute}/${segments.join('/')}`) };
}
