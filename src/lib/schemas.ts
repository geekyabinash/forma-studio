import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email'),
  phone: z.string().optional(),
  projectType: z.enum(['residential', 'commercial', 'interior', 'landscape', 'renovation', 'other']),
  budget: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const careerApplicationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  position: z.string().min(1, 'Please select a position'),
  portfolioUrl: z
    .string()
    .url('Please enter a valid URL')
    .or(z.literal(''))
    .optional(),
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters'),
});

export type CareerApplicationValues = z.infer<typeof careerApplicationSchema>;

export const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  short_title: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().optional(),
  features: z.array(z.string()),
  image_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  image_alt: z.string().optional(),
  image_width: z.number().optional(),
  image_height: z.number().optional(),
  featured_project_slug: z.string().optional(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

// ========== Admin: Career Positions ==========
export const careerPositionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  department: z.enum(['architecture', 'interior-design', 'engineering', 'management']),
  employment_type: z.enum(['full-time', 'part-time', 'internship']),
  location: z.string().min(1, 'Location is required'),
  experience: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  responsibilities: z.array(z.string()),
  qualifications: z.array(z.string()),
  posted_date: z.string().date(),
  is_active: z.boolean(),
});

export type CareerPositionValues = z.infer<typeof careerPositionSchema>;

// ========== Admin: Career Benefits ==========
export const careerBenefitSchema = z.object({
  icon: z.string().min(1, 'Icon is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  sort_order: z.number().optional(),
});

export type CareerBenefitValues = z.infer<typeof careerBenefitSchema>;

// ========== Admin: Career Values ==========
export const careerValueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  sort_order: z.number().optional(),
});

export type CareerValueValues = z.infer<typeof careerValueSchema>;

// ========== Admin: Gallery ==========
export const galleryItemSchema = z.object({
  image_url: z.string().url(),
  image_alt: z.string().optional(),
  image_width: z.number().optional(),
  image_height: z.number().optional(),
  caption: z.string().optional(),
  category: z.enum(['architecture', 'interiors', 'details', 'process']).optional(),
  project_slug: z.string().optional(),
});

export type GalleryItemValues = z.infer<typeof galleryItemSchema>;

// ========== Admin: Inbox ==========
export const submissionUpdateSchema = z.object({
  status: z.enum(['unread', 'read', 'archived']).optional(),
  notes: z.string().optional(),
});

export type SubmissionUpdateValues = z.infer<typeof submissionUpdateSchema>;

// ========== Admin: Projects ==========
const mediaAssetSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional().default(''),
  width: z.number().optional().default(0),
  height: z.number().optional().default(0),
});

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  category: z.enum(['residential', 'commercial', 'interior', 'landscape', 'renovation']),
  status: z.enum(['completed', 'in-progress', 'concept']),
  year: z.number().min(2000).max(2100),
  location: z.string().min(1, 'Location is required'),
  area: z.string().optional(),
  client: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  short_description: z.string().min(1, 'Short description is required'),
  hero_image: mediaAssetSchema.optional(),
  gallery: z.array(mediaAssetSchema).optional().default([]),
  featured: z.boolean().optional().default(false),
  sort_order: z.number().optional().default(0),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

// ========== Admin: About Content ==========
export const aboutContentSchema = z.object({
  hero_tagline: z.string().min(1, 'Hero tagline is required'),
  hero_subtitle: z.string().min(1, 'Hero subtitle is required'),
  story_title: z.string().min(1, 'Story title is required'),
  story_paragraphs: z.array(z.string()).min(1, 'At least one paragraph is required'),
  pull_quote: z.string().min(1, 'Pull quote is required'),
  pull_quote_attribution: z.string().optional(),
  milestones: z.array(z.object({
    year: z.string().min(1, 'Year is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
  })),
  team_members: z.array(z.object({
    name: z.string().min(1, 'Name is required'),
    role: z.string().min(1, 'Role is required'),
    bio: z.string().min(1, 'Bio is required'),
    sort_order: z.number().default(0),
    image: z.object({
      url: z.string().url(),
      alt: z.string().optional().default(''),
      width: z.number().optional().default(0),
      height: z.number().optional().default(0),
    }),
  })).optional().default([]),
});

export type AboutContentFormValues = z.infer<typeof aboutContentSchema>;

// ========== Admin: Contact Info ==========
export const contactInfoSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Please enter a valid email'),
  working_hours: z.string().min(1, 'Working hours is required'),
});

export type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;
