'use client';

import Link from 'next/link';
import SplitTextReveal from '@/components/animations/SplitTextReveal';
import ScrollReveal from '@/components/animations/ScrollReveal';
import Button from '@/components/ui/Button';
import styles from '@/styles/animations.module.css';

interface CTASectionProps {
  heading: string;
  subtitle: string;
  buttonText: string;
}

export default function CTASection({
  heading,
  subtitle,
  buttonText,
}: CTASectionProps) {
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
          {heading}
        </SplitTextReveal>

        <p className="font-sans font-light text-lg text-cream/70 mt-6">
          {subtitle}
        </p>

        <div className="mt-10">
          <Link href="/contact">
            <Button variant="primary">{buttonText}</Button>
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
