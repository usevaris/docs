export const appName = 'Varis Docs';
export const siteUrl = 'https://usevaris.com';
export const githubUrl = 'https://github.com/usevaris/docs';

// The Varis app, on the same domain but outside the docs zone, so a plain
// link rather than a Next <Link>, which would add basePath. Signed-out
// readers land on sign-in.
export const dashboardUrl = `${siteUrl}/dashboard`;

// The docs are a zone of usevaris.com: the main app rewrites /docs and
// /docs/* to this app, so every route here lives under basePath. Next adds
// basePath to <Link> and router paths on its own; anything else fetched by
// URL, such as search, needs withBasePath.
export const basePath = '/docs';

export function withBasePath(path: string) {
  return `${basePath}${path === '/' ? '' : path}`;
}

// Each page's markdown, for AI readers, is served by app/llms.mdx.
export const docsContentRoute = '/llms.mdx';

// The url has no basePath: Fumadocs' Copy Markdown button and View Options
// menu add it themselves.
export function getPageMarkdownUrl(page: { slugs: string[] }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: `${docsContentRoute}/${segments.join('/')}` };
}
