'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import SplitTextReveal from '@/components/animations/SplitTextReveal';
import ProjectFilter from '@/components/projects/ProjectFilter';
import ProjectGrid from '@/components/projects/ProjectGrid';
import type { Project } from '@/types';

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        const mapped = (data.projects || []).map((p: Record<string, unknown>) => ({
          id: p.id as string,
          title: p.title as string,
          slug: p.slug as string,
          category: p.category as string,
          status: p.status as string,
          year: p.year as number,
          location: p.location as string,
          area: p.area as string | undefined,
          client: p.client as string | undefined,
          description: p.description as string,
          shortDescription: (p.shortDescription || p.short_description) as string,
          heroImage: {
            id: 'hero',
            ...((p.heroImage || p.hero_image || { url: '', alt: '', width: 0, height: 0 }) as Record<string, unknown>),
          },
          gallery: ((p.gallery || []) as Record<string, unknown>[]).map((g, i) => ({
            id: `gallery-${i}`,
            ...g,
          })),
          featured: p.featured as boolean,
          sortOrder: (p.sortOrder ?? p.sort_order ?? 0) as number,
          createdAt: (p.createdAt || p.created_at || '') as string,
          updatedAt: (p.updatedAt || p.updated_at || '') as string,
        })) as Project[];
        setProjects(mapped);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

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
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-coral border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProjects.length > 0 ? (
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
