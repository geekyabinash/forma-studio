'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/ui/Logo';
import MobileMenu from '@/components/layout/MobileMenu';
import styles from '@/styles/animations.module.css';
import type { NavItem } from '@/types';

interface HeaderProps {
  visibleItems: NavItem[];
}

export default function Header({ visibleItems }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const leftLinks = visibleItems.filter((item) => item.position === 'left');
  const rightLinks = visibleItems.filter((item) => item.position === 'right');

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-500',
          isScrolled
            ? 'bg-dark/85 backdrop-blur-xl shadow-lg'
            : 'bg-gradient-to-b from-dark/60 via-dark/20 to-transparent'
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 h-[64px] md:h-[80px] flex items-center justify-between md:justify-center" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
          {/* Desktop left nav */}
          <div className="hidden md:flex items-center gap-8">
            {leftLinks.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.08 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    styles.navLink,
                    'font-sans text-sm font-normal tracking-widest uppercase text-cream/90 hover:text-cream transition-colors duration-300'
                  )}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Logo */}
          <Link href="/" className="mx-8 md:mx-12">
            <Logo variant="light" />
          </Link>

          {/* Desktop right nav */}
          <div className="hidden md:flex items-center gap-8">
            {rightLinks.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.8 + (leftLinks.length + i) * 0.08,
                }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    styles.navLink,
                    'font-sans text-sm font-normal tracking-widest uppercase text-cream/90 hover:text-cream transition-colors duration-300'
                  )}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-cream p-2"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </motion.header>
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        visibleItems={visibleItems}
      />
    </>
  );
}
