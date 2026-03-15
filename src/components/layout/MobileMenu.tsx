'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import SocialLinks from '@/components/ui/SocialLinks';
import type { NavItem } from '@/types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  visibleItems: NavItem[];
}

const overlayVariants = {
  hidden: { opacity: 0, x: '100%' },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: '100%' },
};

const linkVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: 0.15 + i * 0.08 },
  }),
};

export default function MobileMenu({ isOpen, onClose, visibleItems }: MobileMenuProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] bg-dark"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Close button */}
          <motion.button
            ref={closeButtonRef}
            className="absolute top-6 right-6 text-cream p-2"
            onClick={onClose}
            aria-label="Close menu"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.3, delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <X size={28} />
          </motion.button>

          {/* Nav links */}
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {visibleItems.map((item, i) => (
              <motion.div
                key={item.href}
                custom={i}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="text-3xl font-sans font-light tracking-wider text-cream hover:text-coral transition-colors duration-300"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-12"
            >
              <SocialLinks iconSize={22} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
