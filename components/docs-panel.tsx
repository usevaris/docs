import type { ReactNode } from 'react';

/**
 * Where a page scrolls, from md up: the article and its table of contents,
 * beside the sidebar inside the bordered content container (#nd-docs-layout
 * in global.css). The sidebar scrolls on its own. Below md it dissolves into
 * Fumadocs' own layout, where the whole page scrolls.
 */
export function DocsPanel({ children }: { children: ReactNode }) {
  return (
    <div id="docs-panel">
      <div id="docs-scroll">{children}</div>
    </div>
  );
}
