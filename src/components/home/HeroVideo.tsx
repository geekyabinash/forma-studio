'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/hooks/useGSAPSetup';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useVideoPlayback } from '@/hooks/useVideoPlayback';
import ScrollIndicator from '@/components/ui/ScrollIndicator';
import styles from '@/styles/animations.module.css';

export default function HeroVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tagline1Ref = useRef<HTMLParagraphElement>(null);
  const tagline2Ref = useRef<HTMLParagraphElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  const isDesktop = useMediaQuery('(min-width: 768px)');
  useVideoPlayback(videoRef);

  useGSAP(
    () => {
      const title = titleRef.current;
      const line1 = tagline1Ref.current;
      const line2 = tagline2Ref.current;
      const media = mediaRef.current;
      if (!title || !line1 || !line2) return;

      // Initial states
      gsap.set([title, line1, line2], { opacity: 0, y: 20 });

      // Entrance timeline
      const tl = gsap.timeline({ delay: 0.3 });
      tl.to(title, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to(line1, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        .to(line2, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2');

      // Scroll-driven parallax on text
      gsap.to([title, line1, line2], {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Scroll-driven scale on video/image
      if (media) {
        gsap.to(media, {
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [isDesktop] }
  );

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      {/* Video / Poster fallback */}
      <div ref={mediaRef} className="absolute inset-0">
        {isDesktop ? (
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            loop
            src="/video/hero-video.mp4"
            poster="/images/hero/hero-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <Image
            src="/images/hero/hero-poster.jpg"
            alt="Forma Studio hero"
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Gradient overlay */}
      <div className={`absolute inset-0 z-[1] ${styles.heroGradientOverlay}`} />

      {/* Grain overlay */}
      <div className="absolute inset-0 z-[2] grain-overlay" />

      {/* Centered text content */}
      <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center text-center">
        <h1
          ref={titleRef}
          className="font-sans font-semibold text-5xl md:text-7xl lg:text-8xl tracking-[0.2em] text-cream"
        >
          FORMA STUDIO
        </h1>
        <p
          ref={tagline1Ref}
          className="font-display text-xl md:text-2xl lg:text-3xl text-cream/90 mt-4"
        >
          Design with intent.
        </p>
        <p
          ref={tagline2Ref}
          className="font-display text-xl md:text-2xl lg:text-3xl text-cream/90 mt-1"
        >
          Build with <span className="font-script text-coral">passion.</span>
        </p>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator className="z-[3]" />
    </section>
  );
}
