'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronsUpDown } from 'lucide-react';

export interface Section {
  title: ReactNode;
  url: string;
}

/**
 * Switches between the docs' sections (User Guide, API Reference), each a
 * root folder in content/docs. Not a dropdown: it expands in place, pushing
 * the sidebar down, with the current section always first. Picking another
 * navigates there, which makes it the first row, and the list closes.
 */
export function SectionSwitcher({ sections }: { sections: Section[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // The current section is the one whose URL is the longest prefix of the
  // page's, so /reference/invoke is in API Reference, not in the guide at /.
  const current = sections
    .filter((s) => s.url === '/' || pathname === s.url || pathname.startsWith(`${s.url}/`))
    .sort((a, b) => b.url.length - a.url.length)[0] ?? sections[0];
  const others = sections.filter((s) => s !== current);

  // Close on Escape or a click anywhere else.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onPointer(e: PointerEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  if (!current) return null;

  return (
    // Two boxes, as in the main app's AuroraCard: the outer one isolates, so
    // the glow sits behind the card but in front of the sidebar. The card is
    // opaque, so the glow only shows around it.
    <div ref={ref} className="relative isolate">
      <div aria-hidden="true" className="switcher-aurora" data-open={open} />
      <div className="rounded-lg border border-(--line-strong) bg-[color-mix(in_srgb,var(--fg)_3%,var(--surface))] p-0.5 text-sm">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="docs-sections"
          onClick={() => setOpen((o) => !o)}
          className={row('font-medium text-fd-foreground')}
        >
          <span className="truncate">{current.title}</span>
          <ChevronsUpDown className="ms-auto size-4 shrink-0 text-fd-muted-foreground" />
        </button>
        {/* Animating grid rows from 0fr to 1fr grows the list to its own
            height, so the sidebar below slides rather than jumps. */}
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
        >
          <div id="docs-sections" className="min-h-0 overflow-hidden" inert={!open}>
            <div className="flex flex-col gap-0.5 pt-0.5">
              {others.map((section) => (
                <Link
                  key={section.url}
                  href={section.url}
                  onClick={() => setOpen(false)}
                  className={row('text-fd-muted-foreground hover:text-fd-accent-foreground')}
                >
                  <span className="truncate">{section.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function row(extra: string) {
  return `flex w-full min-w-0 items-center gap-2 rounded-md py-1.5 pe-2 ps-3 text-start transition-colors hover:bg-fd-accent/50 ${extra}`;
}
