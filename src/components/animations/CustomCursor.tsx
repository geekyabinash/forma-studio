'use client';

import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  const hasHover = useMediaQuery('(hover: hover)');

  const handleMouseMove = useCallback((e: MouseEvent) => {
    xTo.current?.(e.clientX);
    yTo.current?.(e.clientY);
  }, []);

  const handleMouseEnter = useCallback(() => {
    const el = cursorRef.current;
    if (!el) return;
    gsap.to(el, { opacity: 1, duration: 0.2 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = cursorRef.current;
    if (!el) return;
    gsap.to(el, { opacity: 0, duration: 0.2 });
  }, []);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el || !hasHover) return;

    // Initialize quickTo for smooth interpolation
    xTo.current = gsap.quickTo(el, 'x', { duration: 0.15, ease: 'power2.out' });
    yTo.current = gsap.quickTo(el, 'y', { duration: 0.15, ease: 'power2.out' });

    // Start hidden
    gsap.set(el, { opacity: 0, xPercent: -50, yPercent: -50 });

    // Mouse tracking
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Hover state for interactive elements
    function onPointerEnter() {
      gsap.to(el, {
        scale: 2.5,
        backgroundColor: 'rgba(255, 253, 245, 0.15)',
        duration: 0.25,
        ease: 'power2.out',
      });
    }

    function onPointerLeave() {
      gsap.to(el, {
        scale: 1,
        backgroundColor: 'transparent',
        duration: 0.25,
        ease: 'power2.out',
      });
    }

    const interactiveSelector = 'a, button, [data-cursor="pointer"]';

    // Use MutationObserver to handle dynamically added elements
    function attachListeners() {
      const targets = document.querySelectorAll(interactiveSelector);
      targets.forEach((target) => {
        target.addEventListener('mouseenter', onPointerEnter);
        target.addEventListener('mouseleave', onPointerLeave);
      });
      return targets;
    }

    let currentTargets = attachListeners();

    const observer = new MutationObserver(() => {
      // Detach old listeners
      currentTargets.forEach((target) => {
        target.removeEventListener('mouseenter', onPointerEnter);
        target.removeEventListener('mouseleave', onPointerLeave);
      });
      // Reattach to all current interactive elements
      currentTargets = attachListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);

      currentTargets.forEach((target) => {
        target.removeEventListener('mouseenter', onPointerEnter);
        target.removeEventListener('mouseleave', onPointerLeave);
      });

      observer.disconnect();
    };
  }, [hasHover, handleMouseMove, handleMouseEnter, handleMouseLeave]);

  // Don't render on touch devices
  if (!hasHover) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 12,
        height: 12,
        borderRadius: '50%',
        border: '1px solid #FFFDF5',
        backgroundColor: 'transparent',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference',
      }}
    />
  );
}
