import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents, Link } from '@/components/mdx';
import { OpenAPIPage } from '@/components/api-page';
import { DocsPanel } from '@/components/docs-panel';
import { PageFooter } from '@/components/page-footer';
import { findNeighbour } from 'fumadocs-core/page-tree';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getPageMarkdownUrl, githubUrl } from '@/lib/shared';

export default async function Page(props: PageProps<'/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  // From md up, the breadcrumb lives in the panel's topbar.
  const breadcrumb = { className: 'md:hidden' };
  const footer = { component: <PageFooter {...findNeighbour(source.getPageTree(), page.url)} /> };

  // API reference pages come from openapi.yaml, not from MDX files. The
  // operation layout in components/api-page.tsx carries the title, and its
  // examples take the place of the table of contents.
  if (page.type === 'openapi') {
    return (
      <DocsPanel>
        <DocsPage
          breadcrumb={breadcrumb}
          footer={footer}
          tableOfContent={{ enabled: false }}
          tableOfContentPopover={{ enabled: false }}
          full
        >
          <DocsBody>
            <OpenAPIPage {...page.data.getOpenAPIPageProps()} />
          </DocsBody>
        </DocsPage>
      </DocsPanel>
    );
  }

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;

  return (
    <DocsPanel>
      <DocsPage
        toc={page.data.toc}
        breadcrumb={breadcrumb}
        footer={footer}
        full={page.data.full}
      >
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
        <div className="flex flex-row gap-2 items-center border-b pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`${githubUrl}/blob/main/content/docs/${page.path}`}
          />
        </div>
        <DocsBody className="guide-body">
          <MDX
            components={getMDXComponents({
              // Lets a page link to another by its relative file path.
              a: createRelativeLink(source, page, Link),
            })}
          />
        </DocsBody>
      </DocsPage>
    </DocsPanel>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
