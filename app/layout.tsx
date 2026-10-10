import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Ubuntu, Ubuntu_Mono, Ubuntu_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import { appName, siteUrl, withBasePath } from '@/lib/shared';

// The main app's faces: Ubuntu for headings, Ubuntu Sans for body text,
// Ubuntu Mono for code. global.css maps them to font-heading, font-sans, and
// font-mono.
const ubuntu = Ubuntu({
  variable: '--font-ubuntu',
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

const ubuntuSans = Ubuntu_Sans({
  variable: '--font-ubuntu-sans',
  subsets: ['latin'],
});

const ubuntuMono = Ubuntu_Mono({
  variable: '--font-ubuntu-mono',
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { template: `%s | ${appName}`, default: appName },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${ubuntu.variable} ${ubuntuSans.variable} ${ubuntuMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        {/* Light or dark follows the system, as in the main app. The search
            client doesn't know Next's basePath. */}
        <RootProvider
          theme={{ defaultTheme: 'system', enableSystem: true }}
          search={{ options: { api: withBasePath('/api/search') } }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
