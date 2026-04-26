'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

const FALLBACK_WHATSAPP_URL =
  'https://wa.me/919999999999?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project%20with%20Forma%20Studio.';

interface WhatsAppFloatProps {
  url?: string;
}

export default function WhatsAppFloat({ url }: WhatsAppFloatProps) {
  const href = url && url.trim().length > 0 ? url : FALLBACK_WHATSAPP_URL;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let shown = false;

    const show = () => {
      if (!shown) {
        shown = true;
        setIsVisible(true);
      }
    };

    const timer = setTimeout(show, 3000);

    const handleScroll = () => {
      const scrollPercent =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent >= 0.3) {
        show();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={cn(
            'fixed bottom-6 right-6 z-50',
            'flex items-center justify-center w-14 h-14 rounded-full',
            'bg-[#25D366] text-white shadow-lg',
            'animate-pulse-subtle',
            'hover:scale-110 transition-transform duration-300'
          )}
        >
          <WhatsAppIcon size={28} />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
