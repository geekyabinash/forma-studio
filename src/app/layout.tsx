import type { Metadata } from 'next';
import { cormorant, josefin, dancingScript } from '@/styles/fonts';
import './globals.css';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import PageTransitionProvider from '@/components/providers/PageTransitionProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import CustomCursor from '@/components/animations/CustomCursor';
import WhatsAppFloat from '@/components/ui/WhatsAppFloat';

export const metadata: Metadata = {
  title: {
    default: 'Forma Studio | Architecture & Design',
    template: '%s | Forma Studio',
  },
  description:
    'Design with intent. Build with passion. Forma Studio is an architecture and design firm creating spaces that inspire.',
  openGraph: {
    title: 'Forma Studio | Architecture & Design',
    description: 'Design with intent. Build with passion.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${josefin.variable} ${dancingScript.variable}`}
    >
      <body>
        <SmoothScrollProvider>
          <CustomCursor />
          <Header />
          <PageTransitionProvider>
            <main>{children}</main>
          </PageTransitionProvider>
          <Footer />
          <WhatsAppFloat />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
