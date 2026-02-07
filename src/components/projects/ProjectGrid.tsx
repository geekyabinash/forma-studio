'use client';

import { AnimatePresence, motion } from 'framer-motion';
import ProjectCard from '@/components/projects/ProjectCard';
import type { Project } from '@/types';

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="columns-1 md:columns-2 gap-6 space-y-6 max-w-7xl mx-auto px-6">
      <AnimatePresence mode="popLayout">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="break-inside-avoid"
          >
            <ProjectCard project={project} index={index} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
