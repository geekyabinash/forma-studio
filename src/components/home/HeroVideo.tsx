'use client';

import { useRef, useState, useCallback } from 'react';
import { gsap, useGSAP } from '@/hooks/useGSAPSetup';
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
  const [videoReady, setVideoReady] = useState(false);

  const handleVideoPlaying = useCallback(() => {
    setVideoReady(true);
  }, []);

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
          src="/video/hero-video.mp4"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Seamless loader — matches bg, fades out when video plays */}
      <div
        className={`absolute inset-0 bg-dark transition-opacity duration-1000 ease-out pointer-events-none ${
          videoReady ? 'opacity-0' : 'opacity-100'
        }`}
      />

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
          F<span className="text-coral">O</span>RMA STU
          <span
            className="text-coral inline-block -ml-[0.05em] mr-[0.15em]"
            style={{ transform: 'scaleX(-1)', letterSpacing: '0em' }}
          >
            D
          </span>
          IO
        </h1>
        <p
          ref={tagline1Ref}
          className="font-sans font-semibold text-xl md:text-2xl lg:text-3xl text-cream/90 mt-4 tracking-[0.15em]"
        >
          DESIGN WITH INTENT.
        </p>
        <p
          ref={tagline2Ref}
          className="font-sans font-semibold text-xl md:text-2xl lg:text-3xl text-cream/90 mt-1 tracking-[0.15em]"
        >
          BUILD WITH <span className="text-coral">PASSION.</span>
        </p>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator className="z-[3]" />
    </section>
  );
}
