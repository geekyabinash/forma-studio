import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import PageTransitionProvider from '@/components/providers/PageTransitionProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/animations/CustomCursor';
import WhatsAppFloat from '@/components/ui/WhatsAppFloat';
import { getVisibleNavItems } from '@/lib/navigation';
import { getContactSiteInfo } from '@/lib/data/fetch';

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [visibleItems, contact] = await Promise.all([
    getVisibleNavItems(),
    getContactSiteInfo(),
  ]);

  const socials = {
    instagram: contact.instagramUrl,
    facebook: contact.facebookUrl,
    linkedin: contact.linkedinUrl,
    whatsapp: contact.whatsappUrl,
  };

  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <Header visibleItems={visibleItems} />
      <PageTransitionProvider>
        <main>{children}</main>
      </PageTransitionProvider>
      <Footer
        quickLinks={visibleItems}
        address={contact.address}
        phone={contact.phone}
        email={contact.email}
        tagline={contact.footerTagline}
        copyright={contact.footerCopyright}
        credit={contact.footerCredit}
        socials={socials}
      />
      <WhatsAppFloat url={contact.whatsappUrl} />
    </SmoothScrollProvider>
  );
}
