'use client';

import Image from 'next/image';
import Link from 'next/link';
import SplitTextReveal from '@/components/animations/SplitTextReveal';
import ParallaxLayer from '@/components/animations/ParallaxLayer';
import ScrollReveal from '@/components/animations/ScrollReveal';
import ProjectGallery from '@/components/projects/ProjectGallery';
import type { Project } from '@/types';

interface ProjectDetailProps {
  project: Project;
  prevProject: Project | null;
  nextProject: Project | null;
}

export default function ProjectDetail({ project, prevProject, nextProject }: ProjectDetailProps) {
  const details = [
    { label: 'Location', value: project.location },
    ...(project.area ? [{ label: 'Area', value: project.area }] : []),
    { label: 'Year', value: String(project.year) },
    {
      label: 'Status',
      value: project.status.charAt(0).toUpperCase() + project.status.slice(1),
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="h-[60vh] md:h-[70vh] relative overflow-hidden">
        <ParallaxLayer speed={0.2} className="absolute inset-0">
          <Image
            src={project.heroImage.url}
            alt={project.heroImage.alt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </ParallaxLayer>
        <div className="absolute inset-0 bg-dark/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <SplitTextReveal
            as="h1"
            className="font-display text-4xl md:text-5xl lg:text-7xl text-cream text-center px-6"
          >
            {project.title}
          </SplitTextReveal>
        </div>
      </section>

      {/* Details Bar */}
      <section className="bg-dark py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 md:gap-12">
          {details.map((detail, index) => (
            <div key={detail.label} className="flex items-center gap-6 md:gap-12">
              <div className="text-center">
                <span className="font-sans text-xs text-gold uppercase tracking-widest block">
                  {detail.label}
                </span>
                <span className="font-sans text-sm text-cream mt-1 block">
                  {detail.value}
                </span>
              </div>
              {index < details.length - 1 && (
                <span className="hidden md:block w-px h-8 bg-gold/20" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <ScrollReveal>
          <p className="font-sans font-light text-lg text-mid-gray leading-relaxed">
            {project.description}
          </p>
        </ScrollReveal>
      </section>

      {/* Gallery */}
      <section className="px-6 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <ProjectGallery images={project.gallery} projectTitle={project.title} />
        </div>
      </section>

      {/* Navigation */}
      <section className="border-t border-gold/10 px-6 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-8">
          <div>
            {prevProject && (
              <Link href={`/projects/${prevProject.slug}`} className="group block">
                <span className="font-sans text-xs text-mid-gray uppercase tracking-widest">
                  Previous Project
                </span>
                <span className="font-sans font-semibold text-lg text-dark-gray group-hover:text-coral transition-colors mt-1 block">
                  {prevProject.title}
                </span>
              </Link>
            )}
          </div>
          <div className="text-right">
            {nextProject && (
              <Link href={`/projects/${nextProject.slug}`} className="group block">
                <span className="font-sans text-xs text-mid-gray uppercase tracking-widest">
                  Next Project
                </span>
                <span className="font-sans font-semibold text-lg text-dark-gray group-hover:text-coral transition-colors mt-1 block">
                  {nextProject.title}
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
