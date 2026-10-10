import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { appName, githubUrl } from "@/lib/shared";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      nav={{ title: appName, url: "/" }}
      githubUrl={githubUrl}
      // From md up, components/docs-panel.tsx shows GitHub and the theme
      // switch in its topbar and global.css hides these sidebar copies.
      // Below md they stay in the sidebar drawer.
      themeSwitch={{ enabled: true }}
    >
      {children}
    </DocsLayout>
  );
}
