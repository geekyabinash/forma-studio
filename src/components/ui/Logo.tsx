'use client';

import Image from 'next/image';
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
    <div className={cn('flex items-center gap-1.5', className)}>
      <Image
        src="/images/logo/FormaStudioLogo.png"
        alt="Forma Studio"
        width={160}
        height={160}
        className="w-9 h-9 md:w-10 md:h-10 object-contain"
      />
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
