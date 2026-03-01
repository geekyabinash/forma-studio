import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import PageTransitionProvider from '@/components/providers/PageTransitionProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/animations/CustomCursor';
import WhatsAppFloat from '@/components/ui/WhatsAppFloat';

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <Header />
      <PageTransitionProvider>
        <main>{children}</main>
      </PageTransitionProvider>
      <Footer />
      <WhatsAppFloat />
    </SmoothScrollProvider>
  );
}
