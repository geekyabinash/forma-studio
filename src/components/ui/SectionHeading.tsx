'use client';

import { cn } from '@/lib/utils';
import SplitTextReveal from '@/components/animations/SplitTextReveal';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
  dark?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  className,
  align = 'center',
  dark = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
    >
      <SplitTextReveal
        as="h2"
        splitType="words"
        className={cn(
          'font-display text-4xl md:text-5xl lg:text-6xl font-normal',
          dark ? 'text-cream' : 'text-dark-gray'
        )}
      >
        {title}
      </SplitTextReveal>
      {subtitle && (
        <p
          className={cn(
            'font-sans font-light text-lg md:text-xl tracking-wide mt-4',
            dark ? 'text-gold' : 'text-mid-gray'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
