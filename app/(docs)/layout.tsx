import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { appName, githubUrl } from "@/lib/shared";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      nav={{
        title: <span className="font-heading text-lg font-bold">{appName}</span>,
        url: "/",
      }}
      githubUrl={githubUrl}
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
