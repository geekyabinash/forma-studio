'use client';

import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/data/projects';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollReveal from '@/components/animations/ScrollReveal';

const featuredProjects = projects.filter((p) => p.featured);

export default function FeaturedProjects() {
  return (
    <section className="bg-dark py-24 md:py-32 px-6">
      <SectionHeading title="Featured Work" dark={true} />

      <div className="max-w-7xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {featuredProjects.map((project, index) => {
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
    </section>
  );
}
