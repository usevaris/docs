# Varis docs

The public documentation for Varis, served at `usevaris.com/docs`. Built with
[Fumadocs](https://fumadocs.dev) on Next.js.

## How it is served

This app is a zone of `usevaris.com`. It runs with `basePath: '/docs'`, and the
main Varis app rewrites `/docs` and `/docs/*` to it, using the origin in its
`VARIS_DOCS_ORIGIN` environment variable.

- Guides are MDX files in `content/docs`.
- The API reference under `/docs/reference` is generated at build time from
  `openapi.yaml` in [`varis-ts`](https://github.com/usevaris/varis-ts). A
  Vercel deploy hook rebuilds the docs when the spec changes.
- Anything fetched by URL (search, markdown, images) takes `withBasePath` from
  `lib/shared.ts`. Next adds the base path to links on its own.

## Run locally

```bash
npm install
npm run dev
```

The docs run at `http://localhost:3001/docs`. To see them through the main
app, set `VARIS_DOCS_ORIGIN=http://localhost:3001` in the Varis app's
`.env.local` and open `http://localhost:3000/docs`.
