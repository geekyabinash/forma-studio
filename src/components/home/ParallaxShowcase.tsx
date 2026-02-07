'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ScrollTrigger, useGSAP } from '@/hooks/useGSAPSetup';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { animateCountUp } from '@/lib/animations';
import ParallaxLayer from '@/components/animations/ParallaxLayer';
import ScrollReveal from '@/components/animations/ScrollReveal';

export default function ParallaxShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const isMobile = useMediaQuery('(max-width: 767px)');

  useGSAP(
    () => {
      const el = countRef.current;
      if (!el) return;

      animateCountUp(el, 150, 2);

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
          animateCountUp(el, 150, 2);
        },
        once: true,
      });
    },
    { scope: sectionRef }
  );

  /* Mobile: vertical stack layout with fade-in per image */
  if (isMobile) {
    return (
      <section ref={sectionRef} className="relative w-full bg-dark overflow-hidden">
        <ScrollReveal direction="up" className="relative w-full h-[60vh]">
          <Image
            src="/images/parallax/layer-1-bg.jpg"
            alt="Background architectural landscape"
            fill
            className="object-cover"
            style={{ filter: 'blur(1px)' }}
          />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1} className="relative w-full h-[50vh]">
          <Image
            src="/images/parallax/layer-2-mid.jpg"
            alt="Mid-ground architectural detail"
            fill
            className="object-cover"
          />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2} className="relative w-full h-[50vh]">
          <Image
            src="/images/parallax/layer-3-fg.jpg"
            alt="Foreground architectural element"
            fill
            className="object-cover"
          />
        </ScrollReveal>

        {/* Floating stat */}
        <div className="py-16 px-6 text-center">
          <span
            ref={countRef}
            className="font-display text-6xl text-cream block"
          >
            0
          </span>
          <span className="font-sans text-sm text-gold tracking-widest uppercase mt-2 block">
            Projects Delivered
          </span>
        </div>

        {/* Grain overlay */}
        <div className="absolute inset-0 z-40 grain-overlay pointer-events-none" />
      </section>
    );
  }

  /* Desktop: overlapping parallax layers */
  return (
    <section ref={sectionRef} className="relative h-[150vh] w-full overflow-hidden bg-dark">
      {/* Layer 1: deepest background */}
      <ParallaxLayer speed={0.1} className="absolute inset-0 z-0">
        <Image
          src="/images/parallax/layer-1-bg.jpg"
          alt="Background architectural landscape"
          fill
          className="object-cover"
          style={{ filter: 'blur(1px)' }}
        />
      </ParallaxLayer>

      {/* Layer 2: mid-ground window */}
      <ParallaxLayer speed={0.3} className="absolute inset-0 z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] h-[65%] overflow-hidden">
          <Image
            src="/images/parallax/layer-2-mid.jpg"
            alt="Mid-ground architectural detail"
            fill
            className="object-cover"
          />
        </div>
      </ParallaxLayer>

      {/* Layer 3: foreground offset */}
      <ParallaxLayer speed={0.6} className="absolute inset-0 z-20">
        <div className="absolute right-[5%] bottom-[10%] w-[35%] h-[50%] overflow-hidden">
          <Image
            src="/images/parallax/layer-3-fg.jpg"
            alt="Foreground architectural element"
            fill
            className="object-cover"
          />
        </div>
      </ParallaxLayer>

      {/* Floating stat */}
      <div className="absolute z-30 left-[10%] bottom-[25%]">
        <span
          ref={countRef}
          className="font-display text-6xl md:text-7xl text-cream block"
        >
          0
        </span>
        <span className="font-sans text-sm text-gold tracking-widest uppercase mt-2 block">
          Projects Delivered
        </span>
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 z-40 grain-overlay pointer-events-none" />
    </section>
  );
}
