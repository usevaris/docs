import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute } from '@/lib/shared';

// Serves a page's markdown at /docs/<page>.md, or at /docs/<page> when the
// client asks for markdown. request.nextUrl.pathname has basePath removed;
// cloning nextUrl keeps basePath on the rewrite target.
const { rewrite: rewriteDocs } = rewritePath('{/*path}', `${docsContentRoute}{/*path}/content.md`);
const { rewrite: rewriteSuffix } = rewritePath('{/*path}.md', `${docsContentRoute}{/*path}/content.md`);

function rewriteTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return url;
}

export default function proxy(request: NextRequest) {
  const result = rewriteSuffix(request.nextUrl.pathname);
  if (result) {
    return NextResponse.rewrite(rewriteTo(request, result));
  }

  if (isMarkdownPreferred(request)) {
    const result = rewriteDocs(request.nextUrl.pathname);

    if (result) {
      return NextResponse.rewrite(rewriteTo(request, result), {
        // this URL has two representations, selected by `Accept`
        headers: { Vary: 'Accept' },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  // Pages only: never the search API, the markdown and image routes, or assets.
  matcher: ['/((?!api/|llms|og/|_next/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
