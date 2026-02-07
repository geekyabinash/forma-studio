'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'light' | 'dark';
  showText?: boolean;
  className?: string;
}

export default function Logo({
  variant = 'light',
  showText = true,
  className,
}: LogoProps) {
  return (
    <div className={cn('flex items-center', className)}>
      {showText && (
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              'font-sans font-semibold tracking-[0.2em] text-lg',
              variant === 'light' ? 'text-cream' : 'text-dark'
            )}
          >
            FORMA
          </span>
          <span className="font-sans font-normal tracking-[0.35em] text-lg text-coral">
            STUDIO
          </span>
        </div>
      )}
    </div>
  );
}
