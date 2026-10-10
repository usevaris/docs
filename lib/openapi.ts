import { createOpenAPI } from 'fumadocs-openapi/server';

// openapi.yaml in varis-ts is the canonical API contract. The docs read it
// at build time; a Vercel deploy hook rebuilds the docs when it changes.
export const openapiSpecUrl = 'https://raw.githubusercontent.com/usevaris/varis-ts/main/openapi.yaml';

export const openapi = createOpenAPI({
  input: [openapiSpecUrl],
});
