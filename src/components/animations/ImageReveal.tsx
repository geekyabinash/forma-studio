'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/hooks/useGSAPSetup';

interface ImageRevealProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function ImageReveal({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: ImageRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = wrapperRef.current;
      if (!el) return;

      gsap.set(el, {
        clipPath: 'inset(0 100% 0 0)',
        willChange: 'clip-path',
      });

      gsap.to(el, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        onComplete() {
          // Remove will-change after animation completes for performance
          gsap.set(el, { willChange: 'auto' });
        },
      });
    },
    { scope: wrapperRef }
  );

  return (
    <div ref={wrapperRef} className={className} style={{ overflow: 'hidden' }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        style={{ display: 'block', width: '100%', height: 'auto' }}
      />
    </div>
  );
}
