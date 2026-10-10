import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { getLayoutTabs } from "fumadocs-ui/layouts/shared";
import type * as PageTree from "fumadocs-core/page-tree";
import { MethodBadge } from "@/components/method-badge";
import { SectionSwitcher } from "@/components/section-switcher";
import { appName, githubUrl } from "@/lib/shared";

export default function Layout({ children }: LayoutProps<"/">) {
  const tree = source.getPageTree();
  // Each root folder in content/docs is a section: User Guide, API Reference.
  const sections = getLayoutTabs(tree).map(({ title, url }) => ({ title, url }));

  return (
    <DocsLayout
      tree={sidebarTree(tree)}
      nav={{
        title: (
          <span key="title" className="font-heading text-lg font-bold">
            {appName}
          </span>
        ),
        url: "/",
      }}
      githubUrl={githubUrl}
      // The section switcher replaces Fumadocs' dropdown. The sidebar still
      // shows only the current section's pages.
      tabs={false}
      sidebar={{ banner: <SectionSwitcher key="sections" sections={sections} /> }}
      // From md up, components/docs-panel.tsx shows the sidebar toggle,
      // search, GitHub, and the theme switch in its topbar, and global.css
      // hides the sidebar's copies. Below md they stay in Fumadocs' header
      // and drawer.
      themeSwitch={{ enabled: true }}
    >
      {children}
    </DocsLayout>
  );
}

// The sidebar's view of the tree, which the topbar's breadcrumb shares:
//
// - Each section's index page (User Guide's, the API Reference Overview)
//   sits outside the section's children, so the sidebar would skip it. It
//   goes first in the list instead.
// - Names truncate on one line. Sidebar items lay a name out as bare text in
//   a flex row, which wraps but never ends in "...", so it goes in a span.
// - Reference pages lead with their method in a bordered badge.
//
// Every element made here carries a key: Fumadocs puts names in child
// arrays, and React asks for keys on elements passed in from the server.
function sidebarTree(tree: PageTree.Root): PageTree.Root {
  return { ...tree, children: tree.children.map(sidebarNode) };
}

function sidebarNode(node: PageTree.Node): PageTree.Node {
  if (node.type === "separator") return node;
  if (node.type === "page") return { ...node, name: itemName(node) };

  const children = node.children.map(sidebarNode);
  if (node.root && node.index) children.unshift(sidebarNode(node.index));
  return {
    ...node,
    name: (
      <span key="name" className="min-w-0 truncate">
        {node.name}
      </span>
    ),
    children,
  };
}

function itemName(item: PageTree.Item) {
  const page = source.getNodePage(item);
  const method = page?.type === "openapi" ? page.data._openapi.method : undefined;
  if (!method) {
    return (
      <span key="name" className="min-w-0 truncate">
        {item.name}
      </span>
    );
  }
  return (
    <span key="name" className="flex min-w-0 items-center gap-2">
      <MethodBadge method={method} className="tree-method w-12" />
      <span className="truncate">{item.name}</span>
    </span>
  );
}
