'use client';

import Link from 'next/link';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollReveal from '@/components/animations/ScrollReveal';
import ImageReveal from '@/components/animations/ImageReveal';

export default function AboutSnippet() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-16 items-center">
        {/* Left column */}
        <div className="md:col-span-3">
          <ScrollReveal direction="left">
            <SectionHeading title="Who We Are" align="left" />
            <p className="font-sans font-light text-lg text-mid-gray leading-relaxed mt-6">
              At Forma Studio, we believe architecture is more than structure
              &mdash; it&apos;s the silent language of space that shapes how
              people live, work, and dream. Founded on the principles of
              intentional design and passionate craftsmanship, we create
              environments that transcend the ordinary.
            </p>
            <Link
              href="/about"
              className="group text-coral font-sans text-sm tracking-wider uppercase mt-8 inline-block"
            >
              Learn more about us
              <span className="ml-1">&rarr;</span>
              <span className="block w-full h-px bg-coral transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          </ScrollReveal>
        </div>

        {/* Right column */}
        <div className="md:col-span-2 md:translate-y-8">
          <ImageReveal
            src="/images/parallax/layer-2-mid.jpg"
            alt="Forma Studio design process"
            width={600}
            height={800}
          />
        </div>
      </div>
    </section>
  );
}
