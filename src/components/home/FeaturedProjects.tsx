'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/types';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollReveal from '@/components/animations/ScrollReveal';

interface FeaturedProjectsProps {
  projects: Project[];
  label: string;
  eyebrow?: string;
  description?: string;
  manualSlugs?: string[];
  limit?: number;
  ctaText?: string;
  ctaLink?: string;
}

export default function FeaturedProjects({
  projects,
  label,
  eyebrow,
  description,
  manualSlugs,
  limit,
  ctaText,
  ctaLink,
}: FeaturedProjectsProps) {
  let display: Project[];

  if (manualSlugs && manualSlugs.length > 0) {
    const bySlug = new Map(projects.map((p) => [p.slug, p]));
    display = manualSlugs
      .map((slug) => bySlug.get(slug))
      .filter((p): p is Project => Boolean(p));
  } else {
    display = projects.filter((p) => p.featured);
  }

  if (limit && limit > 0) {
    display = display.slice(0, limit);
  }

  if (display.length === 0) return null;

  const showCta = ctaText && ctaText.trim().length > 0;
  const ctaHref = ctaLink && ctaLink.trim().length > 0 ? ctaLink : '/projects';

  return (
    <section className="bg-dark py-24 md:py-32 px-6">
      <SectionHeading title={label} eyebrow={eyebrow} dark={true} />

      {description && description.trim().length > 0 && (
        <ScrollReveal direction="up">
          <p className="max-w-3xl mx-auto mt-6 text-center font-sans font-light text-base md:text-lg text-cream/70 leading-relaxed">
            {description}
          </p>
        </ScrollReveal>
      )}

      <div className="max-w-7xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {display.map((project, index) => {
          const isOdd = index % 2 === 0;
          return (
            <ScrollReveal
              key={project.id}
              direction="up"
              delay={index * 0.1}
            >
              <Link
                href={`/projects/${project.slug}`}
                className={`group relative overflow-hidden block ${
                  isOdd
                    ? 'h-[400px] md:h-[500px]'
                    : 'h-[300px] md:h-[400px]'
                }`}
              >
                <Image
                  src={project.heroImage.url}
                  alt={project.heroImage.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent z-10" />

                {/* Text content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                  <h3 className="font-sans font-semibold text-xl md:text-2xl text-cream">
                    {project.title}
                  </h3>
                  <p className="font-sans font-light text-sm text-gold tracking-wider uppercase mt-1">
                    {project.category}
                  </p>
                  <p className="font-sans text-xs text-cream/50 mt-1">
                    {project.year}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          );
        })}
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
