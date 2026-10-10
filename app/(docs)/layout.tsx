import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { getLayoutTabs } from "fumadocs-ui/layouts/shared";
import type * as PageTree from "fumadocs-core/page-tree";
import { SectionSwitcher } from "@/components/section-switcher";
import { appName, githubUrl } from "@/lib/shared";

export default function Layout({ children }: LayoutProps<"/">) {
  const tree = source.getPageTree();
  // Each root folder in content/docs is a section: User Guide, API Reference.
  const sections = getLayoutTabs(tree).map(({ title, url }) => ({ title, url }));

  return (
    <DocsLayout
      tree={truncateNames(tree)}
      nav={{
        title: <span className="font-heading text-lg font-bold">{appName}</span>,
        url: "/",
      }}
      githubUrl={githubUrl}
      // The section switcher replaces Fumadocs' dropdown. The sidebar still
      // shows only the current section's pages.
      tabs={false}
      sidebar={{ banner: <SectionSwitcher sections={sections} /> }}
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

// Sidebar items lay their name out as bare text in a flex row, which can
// wrap but never ellipsize. A span that truncates makes long names end in
// "..." on one line instead.
function truncateNames(tree: PageTree.Root): PageTree.Root {
  return { ...tree, children: tree.children.map(truncateNode) };
}

function truncateNode(node: PageTree.Node): PageTree.Node {
  if (node.type === "separator") return node;
  const name = <span className="min-w-0 truncate">{node.name}</span>;
  if (node.type === "page") return { ...node, name };
  return {
    ...node,
    name,
    index: node.index && (truncateNode(node.index) as PageTree.Item),
    children: node.children.map(truncateNode),
  };
}
