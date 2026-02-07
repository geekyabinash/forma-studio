'use client';

import { useState } from 'react';
import Image from 'next/image';
import SplitTextReveal from '@/components/animations/SplitTextReveal';
import ProjectFilter from '@/components/projects/ProjectFilter';
import ProjectGrid from '@/components/projects/ProjectGrid';
import { projects } from '@/data/projects';

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <>
      {/* Hero */}
      <section className="h-[50vh] md:h-[60vh] relative overflow-hidden flex flex-col items-center justify-center">
        <Image
          src="/images/projects-hero.jpg"
          alt="Architectural skyline"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-dark/65" />
        <SplitTextReveal
          as="h1"
          className="relative z-10 font-display text-5xl md:text-6xl lg:text-7xl text-cream"
        >
          Our Projects
        </SplitTextReveal>
        <p className="relative z-10 font-sans font-light text-lg text-cream/70 mt-4 text-center px-6">
          A curated collection of architectural excellence
        </p>
      </section>

      {/* Filter */}
      <ProjectFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Grid */}
      <section className="py-12 md:py-16">
        {filteredProjects.length > 0 ? (
          <ProjectGrid projects={filteredProjects} />
        ) : (
          <p className="text-center text-mid-gray py-20 font-sans">
            No projects found in this category
          </p>
        )}
      </section>
    </>
  );
}
