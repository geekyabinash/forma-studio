'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollIndicatorProps {
  className?: string;
}

export default function ScrollIndicator({ className }: ScrollIndicatorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        'absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-700',
        visible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <span className="font-sans font-light text-xs tracking-widest uppercase text-cream">
        Scroll
      </span>
      <div className="animate-scroll-indicator">
        <ChevronDown size={24} className="text-cream" strokeWidth={1} />
      </div>
    </div>
  );
}
