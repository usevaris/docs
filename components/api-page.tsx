'use client';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { createOpenAPIPage } from 'fumadocs-openapi/ui';
import { MethodBadge } from './method-badge';
import { apiOrigin } from '@/lib/shared';

// The playground is off: it would call api.usevaris.com from the reader's
// browser with a real agent key, spending real credits.
//
// Each operation is laid out in two columns, after Mintlify's API pages:
// the readable column on the left (title, endpoint, description,
// credentials, parameters, body, responses), and the request and response
// examples on the right, sticky as the page scrolls. Below 56rem of width
// the examples follow the text. global.css (.api-op) restyles Fumadocs'
// sections as plain, ruled lists.
export const OpenAPIPage = createOpenAPIPage({
  playground: { enabled: false },
  content: {
    renderOperationLayout: (slots, { path, method, operation }) => (
      <div className="api-op flex flex-col gap-10 @4xl:flex-row @4xl:items-start @4xl:justify-between">
        <div className="api-op-main w-full max-w-[560px] min-w-0">
          <h1 className="not-prose mb-4 text-[1.75em] font-semibold">{operation.summary}</h1>
          <Endpoint method={method} path={path} />
          {slots.description}
          {slots.authSchemes}
          {slots.parameters}
          {slots.body}
          {slots.responses}
          {slots.callbacks}
        </div>
        <div className="api-op-example w-full min-w-0 @4xl:sticky @4xl:top-[calc(var(--fd-docs-row-1,2rem)+2rem)] @4xl:max-w-[28rem]">
          {slots.apiExample}
        </div>
      </div>
    ),
  },
});

function Endpoint({ method, path }: { method: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${apiOrigin}${path}`;

  return (
    <div className="not-prose mb-6 flex items-center gap-2.5 rounded-lg border px-2.5 py-2">
      <MethodBadge method={method} />
      <code className="min-w-0 flex-1 truncate font-mono text-[0.8125rem]">
        <span className="text-fd-muted-foreground">{apiOrigin}</span>
        {path}
      </code>
      <button
        type="button"
        aria-label="Copy URL"
        onClick={() => {
          void navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="shrink-0 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
}
