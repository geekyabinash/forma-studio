'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/hooks/useGSAPSetup';

type Direction = 'up' | 'down' | 'left' | 'right';

interface ScrollRevealProps {
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  children: React.ReactNode;
}

function getOffset(direction: Direction): { x: number; y: number } {
  switch (direction) {
    case 'up':
      return { x: 0, y: 40 };
    case 'down':
      return { x: 0, y: -40 };
    case 'left':
      return { x: 40, y: 0 };
    case 'right':
      return { x: -40, y: 0 };
  }
}

export default function ScrollReveal({
  direction = 'up',
  delay = 0,
  duration = 0.8,
  className,
  children,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const offset = getOffset(direction);

      gsap.set(el, {
        opacity: 0,
        x: offset.x,
        y: offset.y,
      });

      gsap.to(el, {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
