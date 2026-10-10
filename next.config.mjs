import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // A zone of usevaris.com: the main app rewrites /docs and /docs/* here.
  // basePath also prefixes /_next assets, so no assetPrefix is needed.
  basePath: '/docs',
};

export default withMDX(config);
