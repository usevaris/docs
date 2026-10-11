import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Callout as BaseCallout } from 'fumadocs-ui/components/callout';
import type { ComponentProps } from 'react';
import type { MDXComponents } from 'mdx/types';

// A callout's border and background take the colour of its icon, which
// Fumadocs sets per type as --callout-color: blue for info, amber for
// warning, red for error.
function Callout({ className, ...props }: ComponentProps<typeof BaseCallout>) {
  return (
    <BaseCallout
      className={`border-(color:--callout-color)/40 bg-(color:--callout-color)/5 dark:bg-(color:--callout-color)/10 ${className ?? ''}`}
      {...props}
    />
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Callout,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
