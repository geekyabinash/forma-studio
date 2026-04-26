'use client';

import { InstagramIcon, FacebookIcon, LinkedinIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

export interface SocialUrls {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  whatsapp?: string;
}

interface SocialLinksProps {
  className?: string;
  iconSize?: number;
  urls?: SocialUrls;
}

export default function SocialLinks({
  className,
  iconSize = 20,
  urls,
}: SocialLinksProps) {
  const items = [
    { label: 'Instagram', href: urls?.instagram, icon: InstagramIcon },
    { label: 'Facebook', href: urls?.facebook, icon: FacebookIcon },
    { label: 'LinkedIn', href: urls?.linkedin, icon: LinkedinIcon },
    { label: 'WhatsApp', href: urls?.whatsapp, icon: WhatsAppIcon },
  ].filter((item) => item.href && item.href.trim().length > 0);

  if (items.length === 0) return null;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          aria-label={item.label}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full text-cream/70 transition-all duration-300 hover:-translate-y-1 hover:text-coral"
        >
          <item.icon size={iconSize} />
        </a>
      ))}
    </div>
  );
}
