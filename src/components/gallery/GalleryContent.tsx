'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap, useGSAP } from '@/hooks/useGSAPSetup';
import SplitTextReveal from '@/components/animations/SplitTextReveal';
import ScrollReveal from '@/components/animations/ScrollReveal';
import SectionHeading from '@/components/ui/SectionHeading';
import type { GalleryItem } from '@/lib/data/fetch';

interface GalleryContentProps {
  items: GalleryItem[];
  categories: string[];
}

const categoryLabels: Record<string, string> = {
  architecture: 'Architecture',
  interiors: 'Interiors',
  details: 'Details',
  process: 'Process',
};

export default function GalleryContent({ items, categories }: GalleryContentProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredItems =
    activeCategory === 'all'
      ? items
      : items.filter((item) => item.category === activeCategory);

  const lightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  // Animate grid items on filter change
  useGSAP(
    () => {
      if (!gridRef.current) return;
      const cards = gridRef.current.querySelectorAll('[data-gallery-card]');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power3.out',
        }
      );
    },
    { scope: gridRef, dependencies: [activeCategory] }
  );

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight')
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % filteredItems.length : null
        );
      if (e.key === 'ArrowLeft')
        setLightboxIndex((prev) =>
          prev !== null
            ? (prev - 1 + filteredItems.length) % filteredItems.length
            : null
        );
    },
    [lightboxIndex, filteredItems.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  return (
    <>
      {/* Hero */}
      <section className="h-[50vh] md:h-[60vh] relative overflow-hidden flex items-center justify-center bg-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(212,101,74,0.08)_0%,_transparent_70%)]" />
        <div className="relative z-10 text-center px-6">
          <SplitTextReveal
            as="h1"
            className="font-display text-5xl md:text-6xl lg:text-7xl text-cream font-normal"
          >
            Gallery
          </SplitTextReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <p className="font-sans font-light text-lg text-cream/70 mt-4 max-w-xl mx-auto">
              A curated collection of light, shadow, and architectural detail
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="bg-dark py-16 md:py-24 px-6">
        {/* Category filter */}
        {categories.length > 0 && (
          <div className="max-w-7xl mx-auto flex flex-wrap gap-4 justify-center mb-16">
            <button
              onClick={() => setActiveCategory('all')}
              className={`font-sans text-sm tracking-wider uppercase transition-all duration-300 pb-1 border-b-2 ${
                activeCategory === 'all'
                  ? 'text-coral border-coral'
                  : 'text-cream/60 hover:text-cream border-transparent'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-sans text-sm tracking-wider uppercase transition-all duration-300 pb-1 border-b-2 ${
                  activeCategory === cat
                    ? 'text-coral border-coral'
                    : 'text-cream/60 hover:text-cream border-transparent'
                }`}
              >
                {categoryLabels[cat] ?? cat}
              </button>
            ))}
          </div>
        )}

        {/* Masonry-style grid */}
        {filteredItems.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-20">
            <p className="font-display text-3xl text-cream/40 mb-4">No images yet</p>
            <p className="font-sans font-light text-cream/30">
              Gallery images will appear here once uploaded.
            </p>
          </div>
        ) : (
          <div
            ref={gridRef}
            className="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
          >
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                data-gallery-card
                className="break-inside-avoid group cursor-pointer relative overflow-hidden"
                onClick={() => setLightboxIndex(index)}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  width={item.imageWidth}
                  height={item.imageHeight}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/50 transition-colors duration-300 flex items-end">
                  <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-display text-lg text-cream">{item.title}</p>
                    {item.description && (
                      <p className="font-sans font-light text-cream/70 text-sm mt-1">
                        {item.description}
                      </p>
                    )}
                    <span className="font-sans text-xs text-coral uppercase tracking-widest mt-2 inline-block">
                      {item.category ? (categoryLabels[item.category] ?? item.category) : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxItem && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-dark/95 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-cream/70 hover:text-cream transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X size={28} />
          </button>

          {/* Previous */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                (lightboxIndex - 1 + filteredItems.length) % filteredItems.length
              );
            }}
            className="absolute left-4 md:left-8 text-cream/50 hover:text-cream transition-colors z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={36} />
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] mx-auto px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxItem.imageUrl}
              alt={lightboxItem.imageAlt}
              width={lightboxItem.imageWidth}
              height={lightboxItem.imageHeight}
              className="max-h-[80vh] w-auto h-auto object-contain mx-auto"
              sizes="90vw"
              priority
            />
            <div className="text-center mt-4">
              <p className="font-display text-xl text-cream">{lightboxItem.title}</p>
              {lightboxItem.description && (
                <p className="font-sans font-light text-cream/60 text-sm mt-1">
                  {lightboxItem.description}
                </p>
              )}
              <p className="font-sans text-xs text-cream/40 mt-2">
                {lightboxIndex + 1} / {filteredItems.length}
              </p>
            </div>
          </div>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
            }}
            className="absolute right-4 md:right-8 text-cream/50 hover:text-cream transition-colors z-10"
            aria-label="Next image"
          >
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </>
  );
}
