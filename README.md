# Varis Docs

The public documentation for Varis, served at `usevaris.com/docs`. Built with
[Fumadocs](https://fumadocs.dev) on Next.js.

## How it is served

This app is a zone of `usevaris.com`. It runs with `basePath: '/docs'`, and the
main Varis app forwards `/docs` and `/docs/*` to it at
`https://varis-docs.vercel.app` (`VARIS_DOCS_ORIGIN` in the Varis app's
`lib/constants.ts`).

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

The docs run at `http://localhost:3001/docs`.
