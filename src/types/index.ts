// ========== Media ==========
export interface MediaAsset {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  blurDataUrl?: string;
}

// ========== Projects ==========
export type ProjectCategory =
  | 'residential'
  | 'commercial'
  | 'interior'
  | 'landscape'
  | 'renovation';

export type ProjectStatus = 'completed' | 'in-progress' | 'concept';

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  status: ProjectStatus;
  year: number;
  location: string;
  area?: string;
  client?: string;
  description: string;
  shortDescription: string;
  heroImage: MediaAsset;
  gallery: MediaAsset[];
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ========== Services ==========
export interface Service {
  id: string;
  title: string;
  slug: string;
  shortTitle: string;
  description: string;
  icon: string;
  features: string[];
  featuredProjectSlug?: string;
  image: MediaAsset;
}

// ========== Testimonials ==========
export interface Testimonial {
  id: string;
  quote: string;
  clientName: string;
  clientTitle: string;
  projectSlug?: string;
}

// ========== Team ==========
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: MediaAsset;
}

// ========== Navigation ==========
export interface NavItem {
  label: string;
  href: string;
  position: 'left' | 'right';
}

// ========== Contact Form ==========
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  projectType: ProjectCategory | 'other';
  budget: string;
  message: string;
}

// ========== Careers ==========
export type Department = 'architecture' | 'interior-design' | 'engineering' | 'management';

export type EmploymentType = 'full-time' | 'part-time' | 'internship';

export interface JobPosition {
  id: string;
  title: string;
  department: Department;
  employmentType: EmploymentType;
  location: string;
  experience: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  postedDate: string;
}

export interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface CultureValue {
  id: string;
  title: string;
  description: string;
}
