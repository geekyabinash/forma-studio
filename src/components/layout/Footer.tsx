import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import SocialLinks, { type SocialUrls } from '@/components/ui/SocialLinks';
import type { NavItem } from '@/types';

interface FooterProps {
  quickLinks: NavItem[];
  address: string;
  phone: string;
  email: string;
  tagline: string;
  copyright: string;
  credit: string;
  socials: SocialUrls;
}

export default function Footer({
  quickLinks,
  address,
  phone,
  email,
  tagline,
  copyright,
  credit,
  socials,
}: FooterProps) {
  const contactItems = [
    { icon: MapPin, text: address },
    { icon: Phone, text: phone },
    { icon: Mail, text: email },
  ].filter((item) => item.text && item.text.trim().length > 0);

  return (
    <footer className="bg-dark py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <Logo variant="light" showText />
            {tagline && tagline.trim().length > 0 && (
              <p className="font-script text-cream/60 text-sm mt-3">
                {tagline}
              </p>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-sans font-semibold text-cream text-sm uppercase tracking-widest mb-6">
              Quick Links
            </h4>
            <nav className="flex flex-col">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-cream/80 hover:text-coral transition-colors duration-300 py-1 font-sans text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-sans font-semibold text-cream text-sm uppercase tracking-widest mb-6">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-4">
              {contactItems.map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <item.icon
                    size={16}
                    className="text-coral mt-0.5 shrink-0"
                  />
                  <span className="text-cream/80 font-sans text-sm">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Follow Us */}
          <div>
            <h4 className="font-sans font-semibold text-cream text-sm uppercase tracking-widest mb-6">
              Follow Us
            </h4>
            <SocialLinks urls={socials} />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-gold/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          {copyright && copyright.trim().length > 0 && (
            <p className="text-cream/40 text-xs font-sans">{copyright}</p>
          )}
          {credit && credit.trim().length > 0 && (
            <p className="text-cream/40 text-xs font-sans">{credit}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
