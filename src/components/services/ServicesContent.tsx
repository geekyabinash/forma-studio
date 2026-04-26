'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollTrigger, useGSAP } from '@/hooks/useGSAPSetup';
import { animateStrokeDraw } from '@/lib/animations';
import { resolveServiceIconPath } from '@/lib/service-icons';
import type { Service } from '@/types';
import SplitTextReveal from '@/components/animations/SplitTextReveal';
import ScrollReveal from '@/components/animations/ScrollReveal';
import ParallaxLayer from '@/components/animations/ParallaxLayer';


/* ------------------------------------------------------------------ */
/*  ServiceSection                                                     */
/*  Inner component — owns its own ref + stroke-draw animation         */
/* ------------------------------------------------------------------ */

function ServiceSection({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          animateStrokeDraw(path, 1.5, 0);
        },
      });
    },
    { scope: sectionRef }
  );

  const isOdd = index % 2 !== 0;

  return (
    <section
      ref={sectionRef}
      className={`py-20 md:py-28 px-6 ${
        index % 2 === 0 ? 'bg-light-bg' : 'bg-white'
      }`}
    >
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center max-w-7xl mx-auto ${
          isOdd ? 'md:direction-rtl' : ''
        }`}
      >
        {/* Image side */}
        <div className={isOdd ? 'md:order-2' : ''}>
          <ParallaxLayer speed={0.15}>
            <div className="relative h-[400px] md:h-[500px] overflow-hidden">
              <Image
                src={service.image.url}
                alt={service.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </ParallaxLayer>
        </div>

        {/* Text side */}
        <div className={isOdd ? 'md:order-1' : ''}>
          <ScrollReveal direction={isOdd ? 'right' : 'left'}>
            {/* SVG icon with stroke-draw animation */}
            <svg
              viewBox="0 0 24 24"
              width={48}
              height={48}
              stroke="currentColor"
              strokeWidth={1.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-coral"
            >
              <path ref={pathRef} d={resolveServiceIconPath(service.icon)} />
            </svg>

            {/* Title */}
            <h2 className="font-display text-3xl md:text-4xl text-dark-gray font-normal mt-6">
              {service.title}
            </h2>

            {/* Description */}
            <p className="font-sans font-light text-lg text-mid-gray leading-relaxed mt-4">
              {service.description}
            </p>

            {/* Features list */}
            <ul className="mt-6 space-y-3">
              {service.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start font-sans text-sm text-mid-gray"
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-coral mr-3 mt-1.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Featured project link */}
            {service.featuredProjectSlug && (
              <Link
                href={`/projects/${service.featuredProjectSlug}`}
                className="group text-coral font-sans text-sm tracking-wider uppercase mt-6 inline-block"
              >
                View project &rarr;
                <span className="block w-full h-px bg-coral transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  ServicesContent — receives services data as prop                    */
/* ------------------------------------------------------------------ */

export default function ServicesContent({ services }: { services: Service[] }) {
  return (
    <>
      {/* Hero */}
      <section
        className="relative h-[50vh] md:h-[60vh] overflow-hidden flex items-center justify-center"
      >
        <Image
          src="/images/services-hero.jpg"
          alt="Grand Victorian interior of the Natural History Museum London"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-dark/60" />
        <SplitTextReveal
          as="h1"
          className="relative z-10 font-display text-5xl md:text-6xl lg:text-7xl text-cream font-normal"
        >
          Our Services
        </SplitTextReveal>
      </section>

      {/* Service sections */}
      {services.length > 0 ? (
        services.map((service, index) => (
          <ServiceSection key={service.id} service={service} index={index} />
        ))
      ) : (
        <p className="text-center text-mid-gray py-20 font-sans">
          No services to display yet.
        </p>
      )}
    </>
  );
}
