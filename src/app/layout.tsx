import type { Metadata } from 'next';
import { cormorant, josefin, dancingScript } from '@/styles/fonts';
import './globals.css';

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
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
