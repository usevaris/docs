import Image from 'next/image';
import mark from '@/public/brand/varis-mark-orange.svg';

// The docs' title: the brand's mark (the clasp, from public/brand, copied
// from .brand in the varis repository) and "Docs". The mark is orange in
// both themes. Imported, so Next adds the docs' basePath to its URL.
export function Logo() {
  return (
    <span className="inline-flex items-center gap-2 my-2">
      <Image src={mark} alt="Varis" width={22} height={22} />
      <span className="text-[1.25rem] font-medium text-fd-foreground">Docs</span>
    </span>
  );
}
