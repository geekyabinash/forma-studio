'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { testimonials } from '@/data/testimonials';
import SectionHeading from '@/components/ui/SectionHeading';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isPausedRef = useRef(false);

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  // Auto-rotate every 5 seconds, pause on hover
  useEffect(() => {
    const id = setInterval(() => {
      if (!isPausedRef.current) {
        advance();
      }
    }, 5000);
    return () => clearInterval(id);
  }, [advance]);

  const current = testimonials[activeIndex];

  return (
    <section
      className="bg-dark py-24 md:py-32 px-6"
      onMouseEnter={() => {
        isPausedRef.current = true;
      }}
      onMouseLeave={() => {
        isPausedRef.current = false;
      }}
    >
      <SectionHeading title="Client Stories" dark={true} />

      <div className="max-w-4xl mx-auto mt-16 text-center relative">
        {/* Decorative quotation mark */}
        <span className="font-display text-[120px] md:text-[160px] text-gold/20 absolute -top-16 left-1/2 -translate-x-1/2 select-none pointer-events-none leading-none">
          &ldquo;
        </span>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <blockquote className="font-display text-xl md:text-2xl lg:text-3xl font-normal italic text-cream/90 leading-relaxed">
              {current.quote}
            </blockquote>
            <p className="font-sans font-semibold text-cream text-sm tracking-wider uppercase mt-8">
              {current.clientName}
            </p>
            <p className="font-sans font-light text-gold text-xs tracking-wider mt-1">
              {current.clientTitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation indicators */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={testimonials[i].id}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className="py-2"
            >
              <div
                className={`h-0.5 transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-8 bg-coral'
                    : 'w-4 bg-cream/30 hover:bg-cream/50'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
