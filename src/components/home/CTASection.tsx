'use client';

import Link from 'next/link';
import SplitTextReveal from '@/components/animations/SplitTextReveal';
import ScrollReveal from '@/components/animations/ScrollReveal';
import Button from '@/components/ui/Button';
import styles from '@/styles/animations.module.css';

export default function CTASection() {
  return (
    <section className="relative bg-dark py-32 md:py-40 px-6 overflow-hidden">
      {/* Gradient mesh background */}
      <div className={`absolute inset-0 ${styles.gradientMesh}`} />

      {/* Content */}
      <ScrollReveal direction="up" className="relative z-10 max-w-3xl mx-auto text-center">
        <SplitTextReveal
          as="h2"
          splitType="words"
          className="font-display text-3xl md:text-4xl lg:text-5xl text-cream font-normal"
        >
          Let&apos;s build something remarkable.
        </SplitTextReveal>

        <p className="font-sans font-light text-lg text-cream/70 mt-6">
          Ready to transform your vision into reality? Let&apos;s start a
          conversation.
        </p>

        <div className="mt-10">
          <Link href="/contact">
            <Button variant="primary">Start Your Project</Button>
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
