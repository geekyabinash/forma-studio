'use client';

import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/animations/ScrollReveal';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const height =
    index % 3 === 0 ? 'h-[450px]' : index % 3 === 1 ? 'h-[350px]' : 'h-[400px]';

  return (
    <ScrollReveal direction="up" delay={index * 0.08}>
      <Link href={`/projects/${project.slug}`}>
        <div className={`group relative overflow-hidden ${height}`}>
          <Image
            src={project.heroImage.url}
            alt={project.heroImage.alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <h3 className="font-sans font-semibold text-xl text-cream">
              {project.title}
            </h3>
            <p className="font-sans font-light text-sm text-gold tracking-wider uppercase mt-1">
              {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
            </p>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}
