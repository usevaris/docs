import { createOpenAPI } from 'fumadocs-openapi/server';

// openapi.yaml at the repository root is the canonical API contract for
// every Varis component. The reference pages are built from it, so a change
// to it ships with the next deploy of the docs.
export const openapi = createOpenAPI({
  input: ['./openapi.yaml'],
});
