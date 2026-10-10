import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type * as PageTree from 'fumadocs-core/page-tree';

/**
 * Previous and next pages in the current section, by title only. Replaces
 * Fumadocs' footer, whose cards carry each page's description too.
 */
export function PageFooter({ previous, next }: { previous?: PageTree.Item; next?: PageTree.Item }) {
  if (!previous && !next) return null;

  return (
    <nav aria-label="More pages" className="not-prose mt-10 grid max-w-[560px] grid-cols-2 gap-4">
      {previous ? (
        <Link href={previous.url} className={card}>
          <ArrowLeft className={arrow} />
          {previous.name}
        </Link>
      ) : (
        <div />
      )}
      {next && (
        <Link href={next.url} className={`${card} justify-end text-end`}>
          {next.name}
          <ArrowRight className={arrow} />
        </Link>
      )}
    </nav>
  );
}

const card =
  'flex items-center gap-3 rounded-xl border px-3 py-4 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent/50';
const arrow = 'size-4 shrink-0 text-fd-muted-foreground';
