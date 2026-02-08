'use client';

import { useRef } from 'react';
import { ScrollTrigger, useGSAP } from '@/hooks/useGSAPSetup';
import { animateStrokeDraw } from '@/lib/animations';
import { services } from '@/data/services';
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

export default function ServicesOverview() {
  return (
    <section className="py-24 md:py-32 px-6">
      <SectionHeading title="What We Do" />

      <div className="max-w-7xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
        {services.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}
