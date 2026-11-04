import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Providers } from './providers';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: {
    default:  'TechnoFind',
    template: '%s · TechnoFind',
  },
  description: "Agrégateur d'actualités mondiales en temps réel, personnalisé et propulsé par l'IA.",
  keywords:  ['actualités', 'news', 'agrégateur', 'IA', 'temps réel'],
  manifest:  '/manifest.json',
  icons: {
    icon:  '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
  openGraph: {
    type:        'website',
    locale:      'fr_FR',
    title:       'TechnoFind',
    description: "Agrégateur d'actualités mondiales en temps réel.",
    siteName:    'TechnoFind',
  },
};

export const viewport: Viewport = {
  themeColor: '#F5F3EF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale   = await getLocale();
  const messages = await getMessages();
  const dir      = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}