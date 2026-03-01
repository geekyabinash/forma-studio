'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  IndianRupee,
  GraduationCap,
  Palette,
  Clock,
  Heart,
  Globe,
} from 'lucide-react';
import SplitTextReveal from '@/components/animations/SplitTextReveal';
import ScrollReveal from '@/components/animations/ScrollReveal';
import SectionHeading from '@/components/ui/SectionHeading';
import ApplicationForm from '@/components/careers/ApplicationForm';
import type { JobPosition, Benefit, CultureValue } from '@/types';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  IndianRupee,
  GraduationCap,
  Palette,
  Clock,
  Heart,
  Globe,
};

const departments = [
  { value: 'all', label: 'All Departments' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'interior-design', label: 'Interior Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'management', label: 'Management' },
];

interface CareersContentProps {
  positions: JobPosition[];
  benefits: Benefit[];
  cultureValues: CultureValue[];
}

export default function CareersContent({
  positions,
  benefits,
  cultureValues,
}: CareersContentProps) {
  const [activeDepartment, setActiveDepartment] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const filteredPositions =
    activeDepartment === 'all'
      ? positions
      : positions.filter((p) => p.department === activeDepartment);

  const toggleExpanded = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const scrollToForm = (positionTitle?: string) => {
    if (positionTitle) setSelectedPosition(positionTitle);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero */}
      <section className="h-[50vh] md:h-[60vh] relative overflow-hidden flex items-center justify-center">
        <Image
          src="/images/careers-hero.jpg"
          alt="Forma Studio team collaborating in the design atelier"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-dark/60" />
        <div className="relative z-10 text-center px-6">
          <SplitTextReveal
            as="h1"
            className="font-display text-5xl md:text-6xl lg:text-7xl text-cream font-normal"
          >
            Join Our Studio
          </SplitTextReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <p className="font-sans font-light text-lg text-cream/70 mt-4">
              Shape the future of architecture with us
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Culture / Why Join Us */}
      <section className="py-24 md:py-32 px-6">
        <SectionHeading
          title="Why Forma Studio"
          subtitle="A culture built on creativity, collaboration, and craft"
        />

        <ScrollReveal direction="up" className="max-w-3xl mx-auto mt-8">
          <p className="font-sans font-light text-lg text-mid-gray leading-relaxed text-center">
            At Forma Studio, we believe that great architecture begins with great
            people. Our studio is a place where curiosity is celebrated, mentorship
            is a way of life, and every project is an opportunity to learn and grow.
            We are looking for passionate individuals who share our commitment to
            design excellence and want to make a meaningful impact on the built
            environment.
          </p>
        </ScrollReveal>

        <div className="max-w-5xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {cultureValues.map((value, index) => (
            <ScrollReveal key={value.id} direction="up" delay={index * 0.1}>
              <div className="border-l-2 border-coral pl-6 py-2">
                <h3 className="font-display text-2xl text-dark-gray font-normal">
                  {value.title}
                </h3>
                <p className="font-sans font-light text-mid-gray text-sm mt-2 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Open Positions */}
      <section className="bg-dark py-24 md:py-32 px-6">
        <SectionHeading
          title="Open Positions"
          dark
          subtitle="Find your role at Forma Studio"
        />

        {/* Department filter */}
        <div className="max-w-7xl mx-auto mt-12 flex flex-wrap gap-4 justify-center">
          {departments.map((dept) => (
            <button
              key={dept.value}
              onClick={() => setActiveDepartment(dept.value)}
              className={`font-sans text-sm tracking-wider uppercase transition-all duration-300 pb-1 border-b-2 ${
                activeDepartment === dept.value
                  ? 'text-coral border-coral'
                  : 'text-cream/60 hover:text-cream border-transparent'
              }`}
            >
              {dept.label}
            </button>
          ))}
        </div>

        {/* Position cards */}
        <div className="max-w-4xl mx-auto mt-12 space-y-6">
          {filteredPositions.length === 0 && (
            <div className="text-center py-12">
              <p className="font-sans text-cream/50 text-lg">
                No positions available in this department at the moment.
              </p>
            </div>
          )}
          {filteredPositions.map((position, index) => (
            <ScrollReveal key={position.id} direction="up" delay={index * 0.08}>
              <div className="border border-gold/20 p-6 md:p-8 hover:border-coral/40 transition-colors duration-300">
                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl text-cream font-normal">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <span className="font-sans text-xs text-gold uppercase tracking-widest">
                        {position.department.replace('-', ' ')}
                      </span>
                      <span className="font-sans text-xs text-cream/50">
                        {position.location}
                      </span>
                      <span className="font-sans text-xs text-cream/50">
                        {position.experience}
                      </span>
                      <span className="font-sans text-xs text-cream/50 capitalize">
                        {position.employmentType.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExpanded(position.id)}
                    className="font-sans text-sm text-coral uppercase tracking-wider shrink-0"
                  >
                    {expandedId === position.id ? 'Close' : 'View Details'}
                  </button>
                </div>

                {/* Expandable details */}
                {expandedId === position.id && (
                  <div className="mt-6 pt-6 border-t border-gold/10">
                    <p className="font-sans font-light text-cream/80 text-sm leading-relaxed">
                      {position.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                      <div>
                        <h4 className="font-sans font-semibold text-cream text-sm uppercase tracking-widest mb-3">
                          Responsibilities
                        </h4>
                        <ul className="space-y-2">
                          {position.responsibilities.map((item) => (
                            <li
                              key={item}
                              className="flex items-start font-sans text-sm text-cream/70"
                            >
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-coral mr-3 mt-1.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-sans font-semibold text-cream text-sm uppercase tracking-widest mb-3">
                          Qualifications
                        </h4>
                        <ul className="space-y-2">
                          {position.qualifications.map((item) => (
                            <li
                              key={item}
                              className="flex items-start font-sans text-sm text-cream/70"
                            >
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold mr-3 mt-1.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => scrollToForm(position.title)}
                      className="mt-6 font-sans text-sm text-coral uppercase tracking-wider group"
                    >
                      Apply for this position &rarr;
                      <span className="block w-full h-px bg-coral transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </button>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Benefits & Perks */}
      <section className="py-24 md:py-32 px-6">
        <SectionHeading title="Benefits & Perks" subtitle="We invest in our people" />

        <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = iconMap[benefit.icon];
            return (
              <ScrollReveal key={benefit.id} direction="up" delay={index * 0.08}>
                <div className="text-center p-6">
                  {IconComponent && (
                    <IconComponent size={36} className="text-coral mx-auto" />
                  )}
                  <h3 className="font-display text-xl text-dark-gray font-normal mt-4">
                    {benefit.title}
                  </h3>
                  <p className="font-sans font-light text-mid-gray text-sm mt-2 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Application Form */}
      <div ref={formRef}>
        <ApplicationForm selectedPosition={selectedPosition} positions={positions} />
      </div>
    </>
  );
}
