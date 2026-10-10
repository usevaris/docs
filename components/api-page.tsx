'use client';
import { createOpenAPIPage } from 'fumadocs-openapi/ui';
import { ApiOperation } from './api-operation';

// The playground is off: it would call api.usevaris.com from the reader's
// browser with a real agent key, spending real credits.
//
// Each operation is laid out in two columns, after Mintlify's API pages:
// the readable column on the left, drawn by ApiOperation from the spec, and
// Fumadocs' request and response examples on the right, sticky as the page
// scrolls. Below 56rem of width the examples follow the text.
export const OpenAPIPage = createOpenAPIPage({
  playground: { enabled: false },
  content: {
    renderOperationLayout: (slots, { path, method, operation }) => (
      <div className="flex flex-col gap-12 text-base @4xl:flex-row @4xl:items-start @4xl:justify-between">
        <div className="not-prose w-full max-w-[560px] min-w-0 leading-7">
          <ApiOperation operation={operation} method={method} path={path} />
        </div>
        <div className="w-full min-w-0 text-sm @4xl:sticky @4xl:top-[calc(var(--fd-docs-row-1,2rem)+2rem)] @4xl:max-w-[28rem]">
          {slots.apiExample}
        </div>
      </div>
    ),
  },
});
