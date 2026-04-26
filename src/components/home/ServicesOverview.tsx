'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ScrollTrigger, useGSAP } from '@/hooks/useGSAPSetup';
import { animateStrokeDraw } from '@/lib/animations';
import type { Service } from '@/types';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollReveal from '@/components/animations/ScrollReveal';

/* ------------------------------------------------------------------ */
/*  Inner card component — owns its own ref + stroke-draw animation   */
/* ------------------------------------------------------------------ */

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const pathRef = useRef<SVGPathElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;

      ScrollTrigger.create({
        trigger: cardRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          animateStrokeDraw(path, 1.5, 0);
        },
      });
    },
    { scope: cardRef }
  );

  const firstSentence = service.description.split('.')[0] + '.';

  return (
    <ScrollReveal direction="up" delay={index * 0.12}>
      <div
        ref={cardRef}
        className="group p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[4px_8px_24px_rgba(0,0,0,0.12)]"
      >
        {/* SVG icon with stroke-draw */}
        <svg
          viewBox="0 0 24 24"
          width={48}
          height={48}
          stroke="currentColor"
          strokeWidth={1.5}
          fill="none"
          className="text-gold group-hover:text-coral transition-colors duration-500"
        >
          <path ref={pathRef} d={service.icon} />
        </svg>

        {/* Title */}
        <h3 className="font-sans font-semibold text-lg text-dark-gray mt-6">
          {service.title}
        </h3>

        {/* Description (first sentence only) */}
        <p className="font-sans font-light text-sm text-mid-gray mt-2 leading-relaxed">
          {firstSentence}
        </p>
      </div>
    </ScrollReveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */

interface ServicesOverviewProps {
  services: Service[];
  label: string;
  eyebrow?: string;
  description?: string;
  manualSlugs?: string[];
  limit?: number;
  ctaText?: string;
  ctaLink?: string;
}

export default function ServicesOverview({
  services,
  label,
  eyebrow,
  description,
  manualSlugs,
  limit,
  ctaText,
  ctaLink,
}: ServicesOverviewProps) {
  let display: Service[];

  if (manualSlugs && manualSlugs.length > 0) {
    const bySlug = new Map(services.map((s) => [s.slug, s]));
    display = manualSlugs
      .map((slug) => bySlug.get(slug))
      .filter((s): s is Service => Boolean(s));
  } else {
    display = services;
  }

  if (limit && limit > 0) {
    display = display.slice(0, limit);
  }

  if (display.length === 0) return null;

  const showCta = ctaText && ctaText.trim().length > 0;
  const ctaHref = ctaLink && ctaLink.trim().length > 0 ? ctaLink : '/services';

  return (
    <section className="py-24 md:py-32 px-6">
      <SectionHeading title={label} eyebrow={eyebrow} />

      {description && description.trim().length > 0 && (
        <ScrollReveal direction="up">
          <p className="max-w-3xl mx-auto mt-6 text-center font-sans font-light text-base md:text-lg text-mid-gray leading-relaxed">
            {description}
          </p>
        </ScrollReveal>
      )}

      <div className="max-w-7xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
        {display.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>

      {showCta && (
        <ScrollReveal direction="up" className="mt-14 text-center">
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-2 font-sans text-sm tracking-wider uppercase text-coral"
          >
            {ctaText}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </ScrollReveal>
      )}
    </section>
  );
}
