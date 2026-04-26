'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Phone, Mail } from 'lucide-react';
import SplitTextReveal from '@/components/animations/SplitTextReveal';
import ScrollReveal from '@/components/animations/ScrollReveal';
import Button from '@/components/ui/Button';
import SocialLinks from '@/components/ui/SocialLinks';
import { contactFormSchema } from '@/lib/schemas';
import type { ContactFormValues } from '@/lib/schemas';

interface ContactInfoData {
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  instagramUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  whatsappUrl: string;
}

export default function ContactPage() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [info, setInfo] = useState<ContactInfoData>({
    address: '123 Architecture Lane, Bandra West, Mumbai 400050, India',
    phone: '+91 99999 99999',
    email: 'hello@formastudio.in',
    workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM | Sat: 10:00 AM - 2:00 PM',
    instagramUrl: '',
    facebookUrl: '',
    linkedinUrl: '',
    whatsappUrl: '',
  });

  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const response = await fetch('/api/contact-info');
        const data = await response.json();
        if (data.contactInfo) {
          setInfo((prev) => ({
            address: data.contactInfo.address || prev.address,
            phone: data.contactInfo.phone || prev.phone,
            email: data.contactInfo.email || prev.email,
            workingHours:
              data.contactInfo.workingHours ||
              data.contactInfo.working_hours ||
              prev.workingHours,
            instagramUrl: data.contactInfo.instagramUrl || '',
            facebookUrl: data.contactInfo.facebookUrl || '',
            linkedinUrl: data.contactInfo.linkedinUrl || '',
            whatsappUrl: data.contactInfo.whatsappUrl || '',
          }));
        }
      } catch {
        // Use fallback defaults silently
      }
    }
    fetchContactInfo();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  async function onSubmit(data: ContactFormValues) {
    try {
      const response = await fetch('/api/contact', {
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
    <>
      {/* Hero */}
      <section className="h-[50vh] md:h-[60vh] bg-dark relative flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/contact-hero-user.jpg"
            alt="Architectural workspace"
            className="w-full h-full object-cover opacity-60"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/40 to-dark/90" />
        </div>

        <div className="relative z-10 text-center">
          <SplitTextReveal
            as="h1"
            className="font-display text-5xl md:text-6xl lg:text-7xl text-cream"
            style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
          >
            Get in Touch
          </SplitTextReveal>
          <p className="font-sans font-light text-cream/90 text-lg mt-4 tracking-wider uppercase" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Let&apos;s build something exceptional
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side - Form */}
          <ScrollReveal direction="left">
            <h2 className="font-display text-3xl text-dark-gray font-normal mb-8">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Name */}
              <div className="relative">
                <input
                  type="text"
                  placeholder=" "
                  {...register('name')}
                  className="w-full bg-transparent border-b border-gold/50 focus:border-coral py-3 font-sans font-light text-dark-gray outline-none transition-colors duration-300 peer"
                />
                <label className="absolute left-0 top-3 font-sans font-normal text-mid-gray/80 transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-coral peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none">
                  Name
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
                  className="w-full bg-transparent border-b border-gold/50 focus:border-coral py-3 font-sans font-light text-dark-gray outline-none transition-colors duration-300 peer"
                />
                <label className="absolute left-0 top-3 font-sans font-normal text-mid-gray/80 transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-coral peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none">
                  Email
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
                  className="w-full bg-transparent border-b border-gold/50 focus:border-coral py-3 font-sans font-light text-dark-gray outline-none transition-colors duration-300 peer"
                />
                <label className="absolute left-0 top-3 font-sans font-normal text-mid-gray/80 transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-coral peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none">
                  Phone
                </label>
                {errors.phone && (
                  <p className="font-sans text-xs text-error mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Project Type */}
              <div className="relative">
                <select
                  {...register('projectType')}
                  className="w-full bg-transparent border-b border-gold/50 focus:border-coral py-3 font-sans font-light text-dark-gray outline-none transition-colors duration-300 appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    Project Type
                  </option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="interior">Interior</option>
                  <option value="landscape">Landscape</option>
                  <option value="renovation">Renovation</option>
                  <option value="other">Other</option>
                </select>
                {errors.projectType && (
                  <p className="font-sans text-xs text-error mt-1">{errors.projectType.message}</p>
                )}
              </div>

              {/* Budget Range */}
              <div className="relative">
                <select
                  {...register('budget')}
                  className="w-full bg-transparent border-b border-gold/50 focus:border-coral py-3 font-sans font-light text-dark-gray outline-none transition-colors duration-300 appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    Budget Range
                  </option>
                  <option value="under-25l">Under &#x20B9;25 Lakhs</option>
                  <option value="25l-50l">&#x20B9;25-50 Lakhs</option>
                  <option value="50l-1cr">&#x20B9;50 Lakhs - 1 Crore</option>
                  <option value="1cr-5cr">&#x20B9;1-5 Crore</option>
                  <option value="above-5cr">Above &#x20B9;5 Crore</option>
                </select>
                {errors.budget && (
                  <p className="font-sans text-xs text-error mt-1">{errors.budget.message}</p>
                )}
              </div>

              {/* Message */}
              <div className="relative">
                <textarea
                  placeholder=" "
                  rows={4}
                  {...register('message')}
                  className="w-full bg-transparent border-b border-gold/50 focus:border-coral py-3 font-sans font-light text-dark-gray outline-none transition-colors duration-300 resize-none peer"
                />
                <label className="absolute left-0 top-3 font-sans font-normal text-mid-gray/80 transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-coral peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none">
                  Message
                </label>
                {errors.message && (
                  <p className="font-sans text-xs text-error mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                className="mt-8 w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <p className="font-sans text-sm text-success mt-4">
                  Thank you! We&apos;ll be in touch soon.
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="font-sans text-sm text-error mt-4">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </ScrollReveal>

          {/* Right Side - Contact Info */}
          <ScrollReveal direction="right">
            <div className="bg-dark p-8 md:p-12">
              <h3 className="font-sans font-semibold text-cream text-lg tracking-wider uppercase mb-8">
                Office
              </h3>

              {/* Address */}
              <div className="flex items-start gap-4 mb-6">
                <MapPin size={20} className="text-coral shrink-0 mt-1" />
                <div>
                  <span className="font-sans text-xs text-gold uppercase tracking-widest block">
                    Address
                  </span>
                  <span className="font-sans font-light text-cream/80 text-sm mt-1 block whitespace-pre-line">
                    {info.address}
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 mb-6">
                <Phone size={20} className="text-coral shrink-0 mt-1" />
                <div>
                  <span className="font-sans text-xs text-gold uppercase tracking-widest block">
                    Phone
                  </span>
                  <span className="font-sans font-light text-cream/80 text-sm mt-1 block">
                    {info.phone}
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 mb-6">
                <Mail size={20} className="text-coral shrink-0 mt-1" />
                <div>
                  <span className="font-sans text-xs text-gold uppercase tracking-widest block">
                    Email
                  </span>
                  <span className="font-sans font-light text-cream/80 text-sm mt-1 block">
                    {info.email}
                  </span>
                </div>
              </div>

              {/* Working Hours */}
              <div className="mt-8">
                <span className="font-sans text-xs text-gold uppercase tracking-widest block">
                  Working Hours
                </span>
                {info.workingHours.split('|').map((line, i) => (
                  <span
                    key={i}
                    className={`font-sans font-light ${i === 0 ? 'text-cream/80' : 'text-cream/60'} text-sm ${i === 0 ? 'mt-1' : ''} block`}
                  >
                    {line.trim()}
                  </span>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <SocialLinks
                  urls={{
                    instagram: info.instagramUrl,
                    facebook: info.facebookUrl,
                    linkedin: info.linkedinUrl,
                    whatsapp: info.whatsappUrl,
                  }}
                />
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 h-[200px] bg-dark-gray/30 flex items-center justify-center">
                <span className="text-cream/30 font-sans text-sm">Google Map Coming Soon</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
