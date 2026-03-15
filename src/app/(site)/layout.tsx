import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import PageTransitionProvider from '@/components/providers/PageTransitionProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/animations/CustomCursor';
import WhatsAppFloat from '@/components/ui/WhatsAppFloat';
import { getVisibleNavItems } from '@/lib/navigation';

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const visibleItems = await getVisibleNavItems();

  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <Header visibleItems={visibleItems} />
      <PageTransitionProvider>
        <main>{children}</main>
      </PageTransitionProvider>
      <Footer quickLinks={visibleItems} />
      <WhatsAppFloat />
    </SmoothScrollProvider>
  );
}
