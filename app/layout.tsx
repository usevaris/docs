import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Geologica, JetBrains_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import { appName, siteUrl, withBasePath } from '@/lib/shared';

// The brand's faces, as in the main app. Geologica for all text, set sharp
// through its SHRP axis (global.css), so that axis ships with it. JetBrains
// Mono for code only. global.css maps them to font-sans and font-mono.
const geologica = Geologica({
  variable: '--font-geologica',
  subsets: ['latin'],
  axes: ['SHRP'],
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
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
      className={`${geologica.variable} ${jetBrainsMono.variable} antialiased`}
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
