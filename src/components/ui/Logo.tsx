'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'light' | 'dark';
  showText?: boolean;
  className?: string;
}

export default function Logo({
  showText = true,
  className,
}: LogoProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Image
        src="/images/logo/FormaStudioLogo.png"
        alt="Forma Studio"
        width={160}
        height={160}
        className="w-12 h-12 md:w-14 md:h-14 object-contain"
      />
      {showText && (
        <Image
          src="/images/logo/FormaStudioFontHeader.png"
          alt="Forma Studio"
          width={2400}
          height={825}
          className="h-12 md:h-14 w-auto object-contain"
          priority
        />
      )}
    </div>
  );
}
