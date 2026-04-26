import HeroVideo from '@/components/home/HeroVideo';
import ParallaxShowcase from '@/components/home/ParallaxShowcase';
import AboutSnippet from '@/components/home/AboutSnippet';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import ServicesOverview from '@/components/home/ServicesOverview';
import CTASection from '@/components/home/CTASection';
import { getHomeContent, getProjects, getServices } from '@/lib/data/fetch';

export const revalidate = 60;

export default async function HomePage() {
  const [home, projects, services] = await Promise.all([
    getHomeContent(),
    getProjects(),
    getServices(),
  ]);

  const featured = projects.filter((p) => p.featured);

  return (
    <>
      <HeroVideo
        videoUrl={home.heroVideoUrl}
        taglineLine1={home.heroTaglineLine1}
        taglineLine2={home.heroTaglineLine2}
      />
      <ParallaxShowcase
        label={home.parallaxLabel}
        imageBg={home.parallaxImageBg}
        imageMid={home.parallaxImageMid}
        imageFg={home.parallaxImageFg}
        projectsCount={home.projectsCount}
        projectsCountLabel={home.projectsCountLabel}
      />
      <AboutSnippet
        title={home.aboutSnippetTitle}
        body={home.aboutSnippetBody}
        ctaText={home.aboutSnippetCtaText}
        image={home.aboutSnippetImage}
      />
      <FeaturedProjects
        projects={featured}
        label={home.featuredWorkLabel}
      />
      <ServicesOverview services={services} label={home.servicesLabel} />
      <CTASection
        heading={home.ctaHeading}
        subtitle={home.ctaSubtitle}
        buttonText={home.ctaButtonText}
      />
    </>
  );
}
