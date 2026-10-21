import defaultMdxComponents from 'fumadocs-ui/mdx';
import {
  Callout as BaseCallout,
  CalloutContainer,
  CalloutDescription,
  CalloutTitle,
} from 'fumadocs-ui/components/callout';
import { Tab as BaseTab, Tabs as BaseTabs } from 'fumadocs-ui/components/tabs';
import BaseLink from 'fumadocs-core/link';
import type { ComponentProps } from 'react';
import {
  CodeBlockTabs as BaseCodeBlockTabs,
  CodeBlockTabsTrigger as BaseCodeBlockTabsTrigger,
} from 'fumadocs-ui/components/codeblock';
import type { MDXComponents } from 'mdx/types';

// A callout's border and background take the colour of its icon, which
// Fumadocs sets per type as --callout-color: blue for info, amber for
// warning, red for error. The title is semi-bold, with a little extra
// space before the text, and the text is at full strength, not muted.
function Callout({ className, title, children, ...props }: ComponentProps<typeof BaseCallout>) {
  return (
    <CalloutContainer
      className={`border-(color:--callout-color)/40 bg-(color:--callout-color)/5 dark:bg-(color:--callout-color)/10 ${className ?? ''}`}
      {...props}
    >
      {title && <CalloutTitle className="mb-1! font-semibold">{title}</CalloutTitle>}
      <CalloutDescription className="text-fd-card-foreground">{children}</CalloutDescription>
    </CalloutContainer>
  );
}

// Tabbed code blocks share the code background (--code-bg in
// app/global.css) with single ones.
function CodeBlockTabs(props: ComponentProps<typeof BaseCodeBlockTabs>) {
  return <BaseCodeBlockTabs {...props} className="bg-(--code-bg)" />;
}

// Fumadocs' underlined tabs, in small, heavy type, with the tabs that
// aren't selected dimmed.
function CodeBlockTabsTrigger(props: ComponentProps<typeof BaseCodeBlockTabsTrigger>) {
  return (
    <BaseCodeBlockTabsTrigger
      {...props}
      className="text-xs font-semibold text-fd-muted-foreground/60 hover:text-fd-muted-foreground data-active:text-fd-primary"
    />
  );
}

// Tabs belong to the page: the tab bar keeps Fumadocs' background, as its
// own bordered strip, and each tab's content sits below it on the page,
// unframed. A tab holding only a code block shows it as a normal block.
function Tabs(props: ComponentProps<typeof BaseTabs>) {
  return (
    <BaseTabs
      {...props}
      className="overflow-visible rounded-none border-0 bg-transparent [&>[role=tablist]]:border [&>[role=tablist]]:bg-fd-secondary"
    />
  );
}

function Tab(props: ComponentProps<typeof BaseTab>) {
  return (
    <BaseTab
      {...props}
      className="rounded-none bg-transparent p-0 pt-4 text-[length:inherit] [&>figure:only-child]:m-0 [&>figure:only-child]:border-solid"
    />
  );
}

// A link into the API reference ends in a small API badge, in the info
// colour of the POST method badge (components/method-badge.tsx).
export function Link({ href, children, ...props }: ComponentProps<typeof BaseLink>) {
  if (!href?.startsWith('/reference/')) {
    return <BaseLink href={href} {...props}>{children}</BaseLink>;
  }

  return (
    <BaseLink href={href} {...props}>
      {children}
      <span className="ms-1.5 inline-flex items-center border border-fd-info/40 px-1 align-[0.1em] text-[0.625rem] leading-4 font-semibold text-fd-info">
        API
      </span>
    </BaseLink>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    a: Link,
    Callout,
    CodeBlockTabs,
    CodeBlockTabsTrigger,
    Tabs,
    Tab,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
