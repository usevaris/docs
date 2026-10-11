# Instructions for coding agents in docs

This repository holds the public documentation for Varis, a marketplace where
AI agents discover, pay for, and invoke HTTPS services that developers
publish. It is a [Fumadocs](https://fumadocs.dev) site on Next.js, served at
`usevaris.com/docs`.

The docs have two audiences:

- **Providers**, developers who publish a service with the TypeScript SDK
  (`@usevaris/sdk`) and the `varis` CLI, or by hand with `varis.json`.
- **Agent developers**, who call `POST /v1/invoke` on `api.usevaris.com` or
  connect the MCP server with an agent key.

## Layout

```
docs/
├── openapi.yaml            The Varis API contract, for every component.
├── content/docs/           The guides, as MDX. meta.json orders the sidebar.
├── app/(docs)/             The docs layout and the page renderer.
├── app/api/search/         The search index (Orama).
├── app/llms*.txt, llms.mdx Markdown copies of every page, for AI readers.
├── app/global.css          The Varis theme: colours, fonts, and the panel.
├── components/api-page.tsx The API reference renderer. The playground is off.
├── lib/source.ts           Loads the MDX guides and the OpenAPI pages.
├── lib/openapi.ts          Reads openapi.yaml at build time.
├── lib/shared.ts           basePath, withBasePath, and the markdown URLs.
└── proxy.ts                Serves page markdown at <page>.md or by Accept header.
```

## Commands

- `npm install`
- `npm run dev`: serves the docs at `http://localhost:3001/docs`.
- `npm run build`: builds the site.
- `npm run types:check` and `npm run lint`: run both before you finish.

## How the site is served

The docs are a zone of `usevaris.com`. Vercel domains are hostnames, so the
main Varis app owns `usevaris.com` and forwards `/docs` and `/docs/*` to this
app's deployment at `https://varis-docs.vercel.app`.

- `next.config.mjs` sets `basePath: '/docs'`. Every route here lives under
  it, including `/docs/_next` assets and `/docs/api/search`.
- Next adds the base path to `<Link>` and router paths. Anything else
  fetched by URL, such as search, needs `withBasePath` from `lib/shared.ts`.
  Fumadocs' page actions (Copy Markdown, View Options) add it themselves, so
  pass them a path without it.
- In MDX, link to other pages as `/quickstart`, not `/docs/quickstart`.
- The API reference lives under `/docs/reference`, one page per operation,
  generated from `openapi.yaml` on every build. Never under `/docs/api`,
  which holds the search route.
- `openapi.yaml` is the canonical API contract for the API, every SDK, and
  the CLI. Fix an API description there, and change the API in `varis` in
  step with it.

## Writing rules

Follow the Google developer documentation style guide: second person, active
voice, present tense, conditions before instructions, sentence-case headings,
and code font for code. Don't use em dashes.

- Write the name as "Varis", never as a domain.
- Every URL is on `usevaris.com`. The API is `https://api.usevaris.com`.
- Say "credits", never "tokens", for the balance. Show every price in US
  dollars or cents, never in credits.
- Test every command and code sample against production before you publish
  it.
- Leave out anything that isn't built yet, rather than describing it as
  coming soon.
- For a note the reader mustn't miss, use `<Callout>`, available in every
  MDX page without an import. Set `type` to `info` (the default),
  `warning`, `error`, `success`, or `idea`, and add `title` if it needs one:
  `<Callout type="warning" title="Before you publish">Text.</Callout>`.
- For steps that differ by route, such as the dashboard and the CLI, use
  `<Tabs items={['Dashboard', 'CLI']}>` with a `<Tab value="...">` for
  each, available in every MDX page without an import.
- For a command or sample that differs by operating system or SDK
  language, write consecutive code blocks with a `tab` and a `tab-group`
  after the language. They render as one block with tabs, and the reader's
  choice carries to every block in the same group, on every page:
  - Operating system: `tab-group="varis-docs-os"`, with `tab` set to
    `macOS`, `Linux`, or `Windows`.
  - SDK language: `tab-group="varis-docs-language"`, with `tab` set to
    `TypeScript`. Give a language block its tab even when it's the only
    one, so that new SDKs slot in.
  - Package manager: `tab-group="varis-docs-package-manager"`, with `tab`
    set to `npm`, `pnpm`, `yarn`, `bun`, or `deno`.
  - Coding agent: `tab-group="varis-docs-agent"`, with `tab` set to
    `Claude Code`, `Codex`, `Cursor`, `Gemini CLI`, or `VS Code`.

  Spell each `tab` exactly as listed, or the choice doesn't carry over:

  ````md
  ```bash tab="macOS" tab-group="varis-docs-os"
  brew install usevaris/tap/varis
  ```
  ````

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
