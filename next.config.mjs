import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // A zone of usevaris.com: the main app rewrites /docs and /docs/* here.
  // basePath also prefixes /_next assets, so no assetPrefix is needed.
  basePath: '/docs',
  // lib/openapi.ts reads openapi.yaml from disk at request time, for search
  // and any page not prerendered. File tracing can't see that path.
  outputFileTracingIncludes: {
    '/*': ['./openapi.yaml'],
  },
};

export default withMDX(config);
