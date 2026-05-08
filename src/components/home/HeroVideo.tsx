'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/hooks/useGSAPSetup';
import { useVideoPlayback } from '@/hooks/useVideoPlayback';
import ScrollIndicator from '@/components/ui/ScrollIndicator';
import styles from '@/styles/animations.module.css';

interface HeroVideoProps {
  videoUrl: string;
  taglineLine1: string;
  taglineLine2: string;
}

export default function HeroVideo({
  videoUrl,
  taglineLine1,
  taglineLine2,
}: HeroVideoProps) {
  const tagline2Parts = taglineLine2.trim().split(/\s+/);
  const tagline2Last = tagline2Parts.pop() ?? '';
  const tagline2Lead = tagline2Parts.join(' ');
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tagline1Ref = useRef<HTMLParagraphElement>(null);
  const tagline2Ref = useRef<HTMLParagraphElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  const handleVideoPlaying = useCallback(() => {
    setVideoReady(true);
  }, []);

  useVideoPlayback(videoRef);

  useGSAP(
    () => {
      const logo = logoRef.current;
      const title = titleRef.current;
      const line1 = tagline1Ref.current;
      const line2 = tagline2Ref.current;
      const media = mediaRef.current;
      if (!logo || !title || !line1 || !line2) return;

      // Initial states
      gsap.set([logo, title, line1, line2], { opacity: 0, y: 20 });

      // Entrance timeline
      const tl = gsap.timeline({ delay: 0.3 });
      tl.to(logo, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to(title, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
        .to(line1, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        .to(line2, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2');

      // Scroll-driven parallax on text
      gsap.to([logo, title, line1, line2], {
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
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      {/* Video */}
      <div ref={mediaRef} className="absolute inset-0">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          loop
          preload="auto"
          onPlaying={handleVideoPlaying}
          onCanPlay={handleVideoPlaying}
          src={videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Seamless loader — matches bg, fades out when video plays */}
      <div
        className={`absolute inset-0 z-[0] bg-dark transition-opacity duration-1000 ease-out pointer-events-none ${videoReady ? 'opacity-0' : 'opacity-100'
          }`}
      />

      {/* Gradient overlay */}
      <div className={`absolute inset-0 z-[1] ${styles.heroGradientOverlay}`} />

      {/* Grain overlay */}
      <div className="absolute inset-0 z-[2] grain-overlay" />

      {/* Centered text content */}
      <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center text-center">
        <div ref={logoRef}>
          <Image
            src="/images/logo/FormaStudioLogo.png"
            alt="Forma Studio Logo"
            width={160}
            height={160}
            className="w-20 h-20 md:w-[120px] md:h-[120px] lg:w-[160px] lg:h-[160px] object-contain"
            priority
          />
        </div>
        <h1
          ref={titleRef}
          className="-mt-2 md:-mt-3"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }}
        >
          <span className="sr-only">Forma Studio</span>
          <Image
            src="/images/logo/FormaStudioFont.png"
            alt=""
            aria-hidden
            width={2400}
            height={827}
            priority
            className="w-[280px] md:w-[460px] lg:w-[600px] h-auto"
          />
        </h1>
        <p
          ref={tagline1Ref}
          className="font-sans font-semibold text-xl md:text-2xl lg:text-3xl text-cream/90 mt-4 tracking-[0.15em]"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
        >
          {taglineLine1}
        </p>
        <p
          ref={tagline2Ref}
          className="font-sans font-semibold text-xl md:text-2xl lg:text-3xl text-cream/90 mt-1 tracking-[0.15em]"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
        >
          {tagline2Lead && <>{tagline2Lead} </>}
          <span className="text-coral">{tagline2Last}</span>
        </p>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator className="z-[3]" />
    </section>
  );
}
