import HeroVideo from '@/components/home/HeroVideo';
import ParallaxShowcase from '@/components/home/ParallaxShowcase';
import AboutSnippet from '@/components/home/AboutSnippet';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import ServicesOverview from '@/components/home/ServicesOverview';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroVideo />
      <ParallaxShowcase />
      <AboutSnippet />
      <FeaturedProjects />
      <ServicesOverview />
      <Testimonials />
      <CTASection />
    </>
  );
}
