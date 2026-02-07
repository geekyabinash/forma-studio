'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/hooks/useGSAPSetup';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ParallaxLayerProps {
  speed?: number;
  className?: string;
  children: React.ReactNode;
}

export default function ParallaxLayer({
  speed = 0.3,
  className,
  children,
}: ParallaxLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const prefersReducedMotion = useReducedMotion();

  const isDisabled = isMobile || prefersReducedMotion;

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el || isDisabled) return;

      const distance = speed * 100;

      gsap.to(el, {
        y: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: containerRef, dependencies: [isDisabled, speed] }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
