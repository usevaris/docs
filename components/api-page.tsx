'use client';
import { createOpenAPIPage } from 'fumadocs-openapi/ui';

// The playground is off: it would call api.usevaris.com from the reader's
// browser with a real agent key, spending real credits.
export const OpenAPIPage = createOpenAPIPage({
  playground: { enabled: false },
});
