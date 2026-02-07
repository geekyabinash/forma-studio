'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/hooks/useGSAPSetup';
import { splitTextIntoSpans } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SplitTextRevealProps {
  children: string;
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  splitType?: 'chars' | 'words';
  className?: string;
  delay?: number;
}

export default function SplitTextReveal({
  children,
  as: Tag = 'div',
  splitType = 'chars',
  className,
  delay = 0,
}: SplitTextRevealProps) {
  const elementRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const el = elementRef.current;
      if (!el || prefersReducedMotion) return;

      const spans = splitTextIntoSpans(el, splitType);

      gsap.set(spans, {
        opacity: 0,
        y: 20,
      });

      gsap.to(spans, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: splitType === 'chars' ? 0.03 : 0.08,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: elementRef, dependencies: [prefersReducedMotion, splitType, delay] }
  );

  if (prefersReducedMotion) {
    return (
      <Tag
        ref={elementRef as React.RefObject<never>}
        className={className}
        style={{ animation: 'fadeIn 0.6s ease forwards' }}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag ref={elementRef as React.RefObject<never>} className={className}>
      {children}
    </Tag>
  );
}
