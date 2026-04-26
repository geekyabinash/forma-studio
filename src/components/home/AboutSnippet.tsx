'use client';

import Link from 'next/link';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollReveal from '@/components/animations/ScrollReveal';
import ImageReveal from '@/components/animations/ImageReveal';

interface AboutSnippetProps {
  title: string;
  body: string;
  ctaText: string;
  image: { url: string; alt: string; width: number; height: number };
}

export default function AboutSnippet({
  title,
  body,
  ctaText,
  image,
}: AboutSnippetProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-16 items-center">
        {/* Left column */}
        <div className="md:col-span-3">
          <ScrollReveal direction="left">
            <SectionHeading title={title} align="left" />
            <p className="font-sans font-light text-lg text-mid-gray leading-relaxed mt-6 whitespace-pre-line">
              {body}
            </p>
            <Link
              href="/about"
              className="group text-coral font-sans text-sm tracking-wider uppercase mt-8 inline-block"
            >
              {ctaText}
              <span className="ml-1">&rarr;</span>
              <span className="block w-full h-px bg-coral transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          </ScrollReveal>
        </div>

        {/* Right column */}
        <div className="md:col-span-2 md:translate-y-8">
          <ImageReveal
            src={image.url}
            alt={image.alt}
            width={image.width || 600}
            height={image.height || 800}
          />
        </div>
      </div>
    </section>
  );
}
