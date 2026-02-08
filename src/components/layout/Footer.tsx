'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import SocialLinks from '@/components/ui/SocialLinks';

const quickLinks = [
  { label: 'Projects', href: '/projects' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

const contactInfo = [
  {
    icon: MapPin,
    text: '123 Architecture Lane, Mumbai 400001',
  },
  {
    icon: Phone,
    text: '+91 99999 99999',
  },
  {
    icon: Mail,
    text: 'hello@formastudio.in',
  },
];

export default function Footer() {
  return (
    <footer className="bg-dark py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <Logo variant="light" showText />
            <p className="font-script text-cream/60 text-sm mt-3">
              Design with intent. Build with passion.
            </p>
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
                  className="text-cream/60 hover:text-coral transition-colors duration-300 py-1 font-sans text-sm"
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
              {contactInfo.map((item) => (
                <div
                  key={item.text}
                  className="flex items-start gap-3"
                >
                  <item.icon size={16} className="text-coral mt-0.5 shrink-0" />
                  <span className="text-cream/60 font-sans text-sm">
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
            <SocialLinks />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-gold/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-cream/40 text-xs font-sans">
            &copy; 2026 Forma Studio. All rights reserved.
          </p>
          <p className="text-cream/40 text-xs font-sans">
            Crafted with passion
          </p>
        </div>
      </div>
    </footer>
  );
}
