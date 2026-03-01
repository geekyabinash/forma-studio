import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import ProjectDetail from '@/components/projects/ProjectDetail';
import type { Project } from '@/types';

function mapDbToProject(p: typeof projects.$inferSelect): Project {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    status: p.status,
    year: p.year,
    location: p.location,
    area: p.area ?? undefined,
    client: p.client ?? undefined,
    description: p.description,
    shortDescription: p.shortDescription,
    heroImage: {
      id: 'hero',
      url: p.heroImage?.url ?? '',
      alt: p.heroImage?.alt ?? '',
      width: p.heroImage?.width ?? 0,
      height: p.heroImage?.height ?? 0,
    },
    gallery: (p.gallery || []).map((g, i) => ({
      id: `gallery-${i}`,
      url: g.url,
      alt: g.alt,
      width: g.width,
      height: g.height,
    })),
    featured: p.featured ?? false,
    sortOrder: p.sortOrder ?? 0,
    createdAt: p.createdAt?.toISOString() ?? '',
    updatedAt: p.updatedAt?.toISOString() ?? '',
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [row] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);

  if (!row) return {};

  return {
    title: row.title,
    description: row.shortDescription,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const allProjects = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder));

  const projectIndex = allProjects.findIndex((p) => p.slug === slug);
  if (projectIndex === -1) notFound();

  const project = mapDbToProject(allProjects[projectIndex]);
  const prevProject = projectIndex > 0 ? mapDbToProject(allProjects[projectIndex - 1]) : null;
  const nextProject = projectIndex < allProjects.length - 1 ? mapDbToProject(allProjects[projectIndex + 1]) : null;

  return <ProjectDetail project={project} prevProject={prevProject} nextProject={nextProject} />;
}
