'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { currentSection, type Section } from './section-switcher';

/**
 * The docs' sections (Guide, API Reference, Changelog) as a row of tabs
 * under the header, from md up. Each is a root folder in content/docs, with
 * its own sidebar and an icon from its meta.json. global.css marks the
 * current one by weight and the colour of its icon.
 */
export function DocsTabs({ sections }: { sections: Section[] }) {
  const pathname = usePathname();
  const current = currentSection(sections, pathname);

  return (
    <nav id="docs-tabs" aria-label="Sections" className='pt-3'>
      {sections.map((section) => {
        const active = section === current;
        return (
          <Link
            key={section.url}
            href={section.url}
            aria-current={active ? 'page' : undefined}
            data-active={active}
            className="docs-tab"
          >
            {section.icon}
            {section.title}
          </Link>
        );
      })}
    </nav>
  );
}
