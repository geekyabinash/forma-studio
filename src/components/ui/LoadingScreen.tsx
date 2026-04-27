'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !sessionStorage.getItem('forma-loading-shown');
  });
  const overlayRef = useRef<HTMLDivElement>(null);
  const bwLogoRef = useRef<HTMLDivElement>(null);
  const colorLogoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Check if already shown this session
    if (sessionStorage.getItem('forma-loading-shown') || prefersReducedMotion) {
      return;
    }

    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('forma-loading-shown', 'true');
        document.body.style.overflow = '';
        setIsVisible(false);
      },
    });

    // 1. B&W logo fades in
    tl.fromTo(
      bwLogoRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out' }
    );

    // 2. Brief hold
    tl.to({}, { duration: 0.4 });

    // 3. Color logo crossfades in + scale pulse
    tl.fromTo(
      colorLogoRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.inOut' }
    );
    tl.fromTo(
      logoContainerRef.current,
      { scale: 1 },
      { scale: 1.03, duration: 0.4, ease: 'power2.out', yoyo: true, repeat: 1 },
      '<'  // Start at same time as color fade
    );

    // 4. Text appears
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    );

    // 5. Hold
    tl.to({}, { duration: 0.3 });

    // 6. Dismiss
    tl.to(overlayRef.current, {
      opacity: 0,
      scale: 1.05,
      duration: 0.6,
      ease: 'power2.inOut',
    });

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, [prefersReducedMotion]);

  if (!isVisible || prefersReducedMotion) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-dark flex flex-col items-center justify-center"
    >
      {/* Logo container */}
      <div ref={logoContainerRef} className="relative w-[120px] h-[64px]">
        {/* B&W logo */}
        <div ref={bwLogoRef} className="absolute inset-0 opacity-0">
          <Image
            src="/images/logo/forma-icon-bw.png"
            alt=""
            width={120}
            height={64}
            priority
            className="w-full h-full object-contain"
          />
        </div>
        {/* Color logo — layered on top */}
        <div ref={colorLogoRef} className="absolute inset-0 opacity-0">
          <Image
            src="/images/logo/forma-icon-color.png"
            alt="Forma Studio"
            width={120}
            height={64}
            priority
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Text */}
      <div ref={textRef} className="mt-6 flex items-center gap-2 opacity-0">
        <span className="font-sans font-semibold text-cream tracking-[0.2em] text-sm uppercase">
          FORMA
        </span>
        <span className="font-sans font-normal text-coral tracking-[0.35em] text-sm uppercase">
          STUDIO
        </span>
      </div>
    </div>
  );
}
