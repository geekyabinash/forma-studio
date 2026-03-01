'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ParallaxLayer from '@/components/animations/ParallaxLayer';
import SplitTextReveal from '@/components/animations/SplitTextReveal';
import ScrollReveal from '@/components/animations/ScrollReveal';
import ImageReveal from '@/components/animations/ImageReveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { team as staticTeam } from '@/data/team';

/* ------------------------------------------------------------------ */
/*  Fallback data (used when DB content isn't loaded yet)              */
/* ------------------------------------------------------------------ */

const defaultMilestones = [
  {
    year: '2010',
    title: 'Studio Founded',
    description:
      'Arjun Mehta establishes Forma Studio in Mumbai with a vision to create architecture that serves both people and planet.',
  },
  {
    year: '2013',
    title: 'First Major Project',
    description:
      'Completed The Glass Pavilion, winning a local design award and establishing the studio\u2019s reputation for climate-responsive residential architecture.',
  },
  {
    year: '2016',
    title: 'Team Expansion',
    description:
      'Grew to 15 professionals spanning architecture, interior design, and landscape architecture, enabling the studio to take on larger multidisciplinary commissions.',
  },
  {
    year: '2019',
    title: 'National Recognition',
    description:
      'Featured in Architectural Digest India and received commendation from the Indian Institute of Architects for sustainable design leadership.',
  },
  {
    year: '2022',
    title: '50th Project Milestone',
    description:
      'Celebrated the completion of 50 architectural projects across six Indian cities, from intimate residences to large-scale commercial developments.',
  },
  {
    year: '2024',
    title: 'New Horizons',
    description:
      'Expanded into landscape architecture and urban planning, welcoming new talent and broadening the studio\u2019s multidisciplinary capabilities.',
  },
];

const defaultParagraphs = [
  'Founded in 2010, Forma Studio emerged from a simple belief \u2014 that architecture has the power to transform not just spaces, but lives. What began as a small design practice in a converted Mumbai warehouse has grown into a multidisciplinary studio of architects, interior designers, landscape architects, and urban planners, all united by a shared commitment to design excellence and environmental responsibility.',
  'From the outset, our founder Arjun Mehta championed an approach that places people at the centre of every design decision. We listen before we draw. We study climate, culture, and context before we commit a single line to paper. This patient, research-led process ensures that every Forma Studio project is rooted in the realities of its site and shaped by the aspirations of the people who will inhabit it.',
  'Over the past decade and a half, our portfolio has expanded from residential architecture to encompass hospitality interiors, commercial developments, public landscapes, and heritage restoration. Yet no matter the scale or typology, every project shares the same DNA: rigorous environmental analysis, thoughtful material selection, and an uncompromising pursuit of beauty that endures. We measure our success not in awards \u2014 though we are grateful for the recognition \u2014 but in the lasting relationships we build with clients who return to us, project after project, because they trust our process and believe in our vision.',
  'Today, Forma Studio operates from a light-filled atelier in Mumbai\u2019s Bandra district, where hand-drawn sketches share wall space with digital renderings and material samples line every shelf. It is a space built for collaboration \u2014 where architects, engineers, craftspeople, and clients gather around the same table to shape ideas into reality. We invite you to learn more about the people who make it all possible and the journey that has brought us here.',
];

const defaultPullQuote = "We don't design buildings. We design the moments that happen inside them \u2014 the morning light on a staircase, the quiet of a courtyard, the joy of a room that feels like home.";

interface AboutData {
  heroTagline: string;
  heroSubtitle: string;
  storyParagraphs: string[];
  pullQuote: string;
  milestones: { year: string; title: string; description: string }[];
  teamMembers: { name: string; role: string; bio: string; sort_order: number; image: { url: string; alt: string; width: number; height: number } }[];
}

/* ------------------------------------------------------------------ */
/*  About Page                                                         */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  const [content, setContent] = useState<AboutData>({
    heroTagline: 'About Forma Studio',
    heroSubtitle: '',
    storyParagraphs: defaultParagraphs,
    pullQuote: defaultPullQuote,
    milestones: defaultMilestones,
    teamMembers: [],
  });

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch('/api/about');
        const data = await response.json();
        if (data.about) {
          setContent({
            heroTagline: data.about.heroTagline || data.about.hero_tagline || 'About Forma Studio',
            heroSubtitle: data.about.heroSubtitle || data.about.hero_subtitle || '',
            storyParagraphs: data.about.storyParagraphs || data.about.story_paragraphs || defaultParagraphs,
            pullQuote: data.about.pullQuote || data.about.pull_quote || defaultPullQuote,
            milestones: data.about.milestones || defaultMilestones,
            teamMembers: data.about.teamMembers || [],
          });
        }
      } catch {
        // Use fallback defaults silently
      }
    }
    fetchContent();
  }, []);

  return (
    <>
      {/* ============================================================ */}
      {/* Section A: Hero                                               */}
      {/* ============================================================ */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <ParallaxLayer speed={0.2} className="absolute inset-0">
          <Image
            src="/images/parallax/about-hero-user.jpg"
            alt="Forma Studio architectural portfolio backdrop"
            fill
            className="object-cover"
            priority
          />
        </ParallaxLayer>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-dark/40 bg-gradient-to-b from-dark/60 via-transparent to-dark/40 z-10" />

        {/* Content */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <SplitTextReveal
            as="h1"
            className="font-display text-5xl md:text-6xl lg:text-7xl text-cream font-normal"
            style={{ textShadow: '0 4px 12px rgba(0,0,0,0.6)' }}
          >
            {content.heroTagline}
          </SplitTextReveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Section B: Studio Story                                       */}
      {/* ============================================================ */}
      <section className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        {content.storyParagraphs.map((paragraph, index) => (
          <div key={index}>
            <ScrollReveal direction="up" delay={index * 0.1}>
              <p className={`font-sans font-light text-lg text-mid-gray leading-relaxed ${index > 0 ? 'mt-8' : ''}`}>
                {paragraph}
              </p>
            </ScrollReveal>

            {/* Pull quote after second paragraph */}
            {index === 1 && (
              <ScrollReveal direction="up" delay={0.2}>
                <blockquote className="border-l-2 border-gold pl-8 my-12">
                  <p className="font-script text-2xl md:text-3xl text-coral italic leading-snug">
                    {content.pullQuote}
                  </p>
                </blockquote>
              </ScrollReveal>
            )}
          </div>
        ))}

        {/* Story image */}
        <div className="mt-16">
          <ImageReveal
            src="/images/parallax/layer-3-fg.jpg"
            alt="Forma Studio atelier workspace and design process"
            width={1200}
            height={800}
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* Section C: Team                                               */}
      {/* ============================================================ */}
      <section className="bg-dark py-24 md:py-32 px-6">
        <SectionHeading title="Our Team" dark={true} />

        <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(content.teamMembers.length > 0
            ? [...content.teamMembers].sort((a, b) => a.sort_order - b.sort_order).map((m, i) => ({
                id: `team-db-${i}`,
                name: m.name,
                role: m.role,
                bio: m.bio,
                image: m.image,
              }))
            : staticTeam
          ).map((member, index) => (
            <ScrollReveal
              key={member.id}
              direction="up"
              delay={index * 0.1}
            >
              <div className="group relative overflow-hidden">
                {/* Portrait */}
                <div className="relative h-[400px]">
                  <Image
                    src={member.image.url}
                    alt={member.image.alt}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark/90 to-transparent">
                  <p className="font-sans font-semibold text-cream text-lg">
                    {member.name}
                  </p>
                  <p className="font-sans font-light text-gold text-sm tracking-wider uppercase mt-1">
                    {member.role}
                  </p>
                  <p className="font-sans text-cream/60 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {member.bio}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* Section D: Timeline                                           */}
      {/* ============================================================ */}
      <section className="py-24 md:py-32 px-6">
        <SectionHeading title="Our Journey" />

        <div className="max-w-3xl mx-auto mt-16 relative">
          {/* Vertical centre line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gold/20" />

          {content.milestones.map((milestone, index) => {
            const isEven = index % 2 === 0;

            return (
              <ScrollReveal
                key={`${milestone.year}-${index}`}
                direction="up"
                delay={index * 0.08}
                className="relative mb-16 last:mb-0"
              >
                {/* Dot */}
                <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-coral z-10" />

                {/* Content */}
                <div
                  className={
                    isEven
                      ? 'pr-[calc(50%+2rem)] text-right'
                      : 'pl-[calc(50%+2rem)] text-left'
                  }
                >
                  <p className="font-display text-3xl text-coral">
                    {milestone.year}
                  </p>
                  <p className="font-sans font-semibold text-dark-gray text-lg mt-1">
                    {milestone.title}
                  </p>
                  <p className="font-sans font-light text-mid-gray text-sm mt-1">
                    {milestone.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
