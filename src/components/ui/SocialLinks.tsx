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

const FALLBACK_URLS: Required<SocialUrls> = {
  instagram: 'https://www.instagram.com/',
  facebook: 'https://www.facebook.com/',
  linkedin: 'https://www.linkedin.com/',
  whatsapp: 'https://wa.me/',
};

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
  const resolve = (configured: string | undefined, fallback: string) => {
    const trimmed = configured?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : fallback;
  };

  const items = [
    {
      label: 'Instagram',
      href: resolve(urls?.instagram, FALLBACK_URLS.instagram),
      icon: InstagramIcon,
    },
    {
      label: 'Facebook',
      href: resolve(urls?.facebook, FALLBACK_URLS.facebook),
      icon: FacebookIcon,
    },
    {
      label: 'LinkedIn',
      href: resolve(urls?.linkedin, FALLBACK_URLS.linkedin),
      icon: LinkedinIcon,
    },
    {
      label: 'WhatsApp',
      href: resolve(urls?.whatsapp, FALLBACK_URLS.whatsapp),
      icon: WhatsAppIcon,
    },
  ];

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
