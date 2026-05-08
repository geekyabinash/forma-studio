'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ScrollTrigger, useGSAP } from '@/hooks/useGSAPSetup';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { animateCountUp } from '@/lib/animations';
import ParallaxLayer from '@/components/animations/ParallaxLayer';
import ScrollReveal from '@/components/animations/ScrollReveal';
import ImageReveal from '@/components/animations/ImageReveal';

interface ImageAsset {
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface ParallaxShowcaseProps {
  label: string;
  imageBg: ImageAsset;
  imageMid: ImageAsset;
  imageFg: ImageAsset;
  projectsCount: number;
  projectsCountLabel: string;
}

export default function ParallaxShowcase({
  label,
  imageBg,
  imageMid,
  imageFg,
  projectsCount,
  projectsCountLabel,
}: ParallaxShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const isMobile = useMediaQuery('(max-width: 767px)');

  useGSAP(
    () => {
      const el = countRef.current;
      if (!el) return;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
          animateCountUp(el, projectsCount, 2);
        },
        once: true,
      });
    },
    { scope: sectionRef, dependencies: [isMobile, projectsCount] }
  );

  /* Mobile: clean vertical stack with stat counter between images */
  if (isMobile) {
    return (
      <section ref={sectionRef} className="relative w-full bg-dark overflow-hidden py-20 px-6">
        {/* Background architectural image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={imageBg.url}
            alt={imageBg.alt}
            fill
            className="object-cover opacity-15"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/40 to-dark/80" />
        </div>

        {/* Section label */}
        <p className="relative z-[1] font-sans text-base tracking-[0.3em] uppercase text-gold/60 mb-10">
          {label}
        </p>

        <div className="relative z-[1] space-y-8">
          {/* Primary image — portrait */}
          <ScrollReveal direction="up">
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src={imageMid.url}
                alt={imageMid.alt}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </ScrollReveal>

          {/* Stat counter — centered between images */}
          <ScrollReveal direction="up" delay={0.1} className="text-center py-8">
            <span
              ref={countRef}
              className="font-display text-6xl text-cream block"
            >
              0
            </span>
            <span className="font-sans text-sm text-gold tracking-widest uppercase mt-2 block">
              {projectsCountLabel}
            </span>
            <div className="w-12 h-px bg-gold/40 mt-4 mx-auto" />
          </ScrollReveal>

          {/* Secondary image — landscape */}
          <ScrollReveal direction="up" delay={0.15}>
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <Image
                src={imageFg.url}
                alt={imageFg.alt}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Grain overlay */}
        <div className="absolute inset-0 z-10 grain-overlay pointer-events-none" />
      </section>
    );
  }

  /* Desktop: asymmetric two-column editorial grid */
  return (
    <section ref={sectionRef} className="relative w-full bg-dark overflow-hidden py-32 md:py-40">
      {/* Background architectural image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageBg.url}
          alt={imageBg.alt}
          fill
          className="object-cover opacity-15"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/40 to-dark/80" />
      </div>

      <div className="relative z-[1] max-w-7xl mx-auto px-6">
        {/* Section label */}
        <ScrollReveal direction="left">
          <p className="font-sans text-sm md:text-base lg:text-lg tracking-[0.3em] uppercase text-gold/60 mb-16">
            {label}
          </p>
        </ScrollReveal>

        {/* Asymmetric two-column grid */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left column: dominant portrait image with subtle parallax */}
          <div className="col-span-7">
            <ParallaxLayer speed={0.15}>
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <Image
                  src={imageMid.url}
                  alt={imageMid.alt}
                  fill
                  className="object-cover"
                  sizes="58vw"
                />
              </div>
            </ParallaxLayer>
          </div>

          {/* Right column: offset vertically for staggered effect */}
          <div className="col-span-5 pt-24 md:pt-32">
            {/* Secondary image with clip-path reveal */}
            <ImageReveal
              src={imageFg.url}
              alt={imageFg.alt}
              width={600}
              height={450}
            />

            {/* Stat counter block */}
            <ScrollReveal direction="up" delay={0.15} className="mt-12 md:mt-16">
              <span
                ref={countRef}
                className="font-display text-7xl md:text-8xl text-cream block"
              >
                0
              </span>
              <span className="font-sans text-sm text-gold tracking-widest uppercase mt-2 block">
                {projectsCountLabel}
              </span>
              {/* Gold accent line */}
              <div className="w-12 h-px bg-gold/40 mt-6" />
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 z-10 grain-overlay pointer-events-none" />
    </section>
  );
}
