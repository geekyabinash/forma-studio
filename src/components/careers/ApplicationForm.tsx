'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ScrollReveal from '@/components/animations/ScrollReveal';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import { careerApplicationSchema } from '@/lib/schemas';
import type { CareerApplicationValues } from '@/lib/schemas';
import { positions } from '@/data/careers';

interface ApplicationFormProps {
  selectedPosition: string;
}

export default function ApplicationForm({ selectedPosition }: ApplicationFormProps) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CareerApplicationValues>({
    resolver: zodResolver(careerApplicationSchema),
  });

  useEffect(() => {
    if (selectedPosition) {
      setValue('position', selectedPosition);
    }
  }, [selectedPosition, setValue]);

  async function onSubmit(data: CareerApplicationValues) {
    try {
      const response = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to send');

      setSubmitStatus('success');
      reset();
    } catch {
      setSubmitStatus('error');
    }
  }

  return (
    <section className="bg-dark py-24 md:py-32 px-6">
      <SectionHeading title="Apply Now" dark subtitle="Take the first step" />

      <div className="max-w-3xl mx-auto mt-12">
        <ScrollReveal direction="up">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Name */}
            <div className="relative">
              <input
                type="text"
                placeholder=" "
                {...register('name')}
                className="w-full bg-transparent border-b border-gold/30 focus:border-coral py-3 font-sans font-light text-cream outline-none transition-colors duration-300 peer"
              />
              <label className="absolute left-0 top-3 font-sans font-light text-cream/50 transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-coral peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none">
                Full Name *
              </label>
              {errors.name && (
                <p className="font-sans text-xs text-error mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="text"
                placeholder=" "
                {...register('email')}
                className="w-full bg-transparent border-b border-gold/30 focus:border-coral py-3 font-sans font-light text-cream outline-none transition-colors duration-300 peer"
              />
              <label className="absolute left-0 top-3 font-sans font-light text-cream/50 transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-coral peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none">
                Email Address *
              </label>
              {errors.email && (
                <p className="font-sans text-xs text-error mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="relative">
              <input
                type="tel"
                placeholder=" "
                {...register('phone')}
                className="w-full bg-transparent border-b border-gold/30 focus:border-coral py-3 font-sans font-light text-cream outline-none transition-colors duration-300 peer"
              />
              <label className="absolute left-0 top-3 font-sans font-light text-cream/50 transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-coral peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none">
                Phone Number *
              </label>
              {errors.phone && (
                <p className="font-sans text-xs text-error mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Position */}
            <div className="relative">
              <select
                {...register('position')}
                className="w-full bg-transparent border-b border-gold/30 focus:border-coral py-3 font-sans font-light text-cream outline-none transition-colors duration-300 appearance-none cursor-pointer"
              >
                <option value="" disabled className="bg-dark">
                  Select a Position *
                </option>
                {positions.map((pos) => (
                  <option key={pos.id} value={pos.title} className="bg-dark">
                    {pos.title}
                  </option>
                ))}
              </select>
              {errors.position && (
                <p className="font-sans text-xs text-error mt-1">{errors.position.message}</p>
              )}
            </div>

            {/* Portfolio URL */}
            <div className="relative">
              <input
                type="url"
                placeholder=" "
                {...register('portfolioUrl')}
                className="w-full bg-transparent border-b border-gold/30 focus:border-coral py-3 font-sans font-light text-cream outline-none transition-colors duration-300 peer"
              />
              <label className="absolute left-0 top-3 font-sans font-light text-cream/50 transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-coral peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none">
                Portfolio URL (optional)
              </label>
              {errors.portfolioUrl && (
                <p className="font-sans text-xs text-error mt-1">{errors.portfolioUrl.message}</p>
              )}
            </div>

            {/* Cover Letter */}
            <div className="relative">
              <textarea
                placeholder=" "
                rows={6}
                {...register('coverLetter')}
                className="w-full bg-transparent border-b border-gold/30 focus:border-coral py-3 font-sans font-light text-cream outline-none transition-colors duration-300 resize-none peer"
              />
              <label className="absolute left-0 top-3 font-sans font-light text-cream/50 transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-coral peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none">
                Cover Letter *
              </label>
              {errors.coverLetter && (
                <p className="font-sans text-xs text-error mt-1">{errors.coverLetter.message}</p>
              )}
            </div>

            {/* Resume note */}
            <p className="font-sans text-xs text-cream/40">
              Please email your resume and portfolio to{' '}
              <a href="mailto:careers@formastudio.in" className="text-coral hover:underline">
                careers@formastudio.in
              </a>{' '}
              with the position title in the subject line.
            </p>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              className="mt-8 w-full md:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <p className="font-sans text-sm text-success mt-4">
                Thank you for your application! We&apos;ll review it and be in touch soon.
              </p>
            )}
            {submitStatus === 'error' && (
              <p className="font-sans text-sm text-error mt-4">
                Something went wrong. Please try again or email us directly.
              </p>
            )}
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}
