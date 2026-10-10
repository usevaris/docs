import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'Varis';

// The docs are a zone of usevaris.com: the main app rewrites /docs and
// /docs/* to this app, so every route here lives under basePath. Next adds
// basePath to <Link> and router paths on its own; anything fetched by URL
// (search, markdown, Open Graph images) needs withBasePath.
export const basePath = '/docs';
export const siteUrl = 'https://usevaris.com';

export function withBasePath(path: string) {
  return `${basePath}${path === '/' ? '' : path}`;
}

// Route paths inside the app, before basePath.
export const docsRoute = '/';
export const docsImageRoute = '/og';
export const docsContentRoute = '/llms.mdx';

export const gitConfig = {
  user: 'usevaris',
  repo: 'docs',
  branch: 'main',
};

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: withBasePath(getContentUrl(segments, page.locale)) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: withBasePath(getImageUrl(segments, page.locale)) };
}
