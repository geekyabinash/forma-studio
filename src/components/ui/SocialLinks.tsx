'use client';

import { InstagramIcon, FacebookIcon, LinkedinIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

interface SocialLinksProps {
  className?: string;
  iconSize?: number;
}

const socialItems = [
  { label: 'Instagram', href: '#', icon: InstagramIcon },
  { label: 'Facebook', href: '#', icon: FacebookIcon },
  { label: 'LinkedIn', href: '#', icon: LinkedinIcon },
  { label: 'WhatsApp', href: '#', icon: WhatsAppIcon },
];

export default function SocialLinks({
  className,
  iconSize = 20,
}: SocialLinksProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {socialItems.map((item) => (
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
