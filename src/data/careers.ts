import type { JobPosition, Benefit, CultureValue } from '@/types';

export const cultureValues: CultureValue[] = [
  {
    id: 'culture-001',
    title: 'Design Excellence',
    description:
      'We believe every line drawn, every material chosen, and every space conceived should aspire to the highest standard of architectural craft. Excellence is not a destination \u2014 it is how we work, every day.',
  },
  {
    id: 'culture-002',
    title: 'Collaborative Spirit',
    description:
      'Our best work emerges when architects, engineers, designers, and clients gather around the same table. We foster an open studio culture where ideas flow freely and every voice shapes the outcome.',
  },
  {
    id: 'culture-003',
    title: 'Sustainable Thinking',
    description:
      'Responsibility to the environment is woven into everything we do. From passive cooling strategies to locally sourced materials, we design buildings that tread lightly on the earth.',
  },
  {
    id: 'culture-004',
    title: 'Continuous Growth',
    description:
      'We invest in our people as much as our projects. Through mentorship, conference sponsorships, and studio workshops, we ensure every team member is always learning, always evolving.',
  },
];

export const positions: JobPosition[] = [
  {
    id: 'pos-001',
    title: 'Senior Architect',
    department: 'architecture',
    employmentType: 'full-time',
    location: 'Mumbai, India',
    experience: '8+ years',
    description:
      "Lead complex architectural projects from concept through construction administration, mentoring junior designers while upholding Forma Studio's commitment to design excellence and environmental responsibility.",
    responsibilities: [
      'Lead design development for residential and commercial projects',
      'Coordinate with structural, MEP, and landscape consultants',
      'Prepare and present design proposals to clients',
      'Mentor junior architects and interns',
      'Oversee construction documentation and site visits',
    ],
    qualifications: [
      'B.Arch or M.Arch from a recognised institution',
      '8+ years of professional experience in architectural design',
      'Proficiency in Revit, AutoCAD, and Adobe Creative Suite',
      'Strong portfolio demonstrating design leadership',
      'Council of Architecture registration preferred',
    ],
    postedDate: '2026-01-15',
  },
  {
    id: 'pos-002',
    title: 'Interior Designer',
    department: 'interior-design',
    employmentType: 'full-time',
    location: 'Mumbai, India',
    experience: '4-6 years',
    description:
      'Craft refined interior environments for luxury residential and hospitality projects, working closely with our Interior Design Director to develop bespoke material narratives and spatial experiences.',
    responsibilities: [
      'Develop interior design concepts aligned with architectural vision',
      'Create detailed material palettes, FF&E schedules, and finish boards',
      'Coordinate with vendors, artisans, and fabricators',
      'Prepare 3D visualisations and presentation drawings',
      'Conduct site visits to ensure design intent is realised',
    ],
    qualifications: [
      'Degree in Interior Design or Interior Architecture',
      '4-6 years of experience in luxury residential or hospitality interiors',
      'Proficiency in SketchUp, 3ds Max or V-Ray, and AutoCAD',
      'Strong understanding of materials, finishes, and furniture design',
      'Excellent visual communication and presentation skills',
    ],
    postedDate: '2026-01-20',
  },
  {
    id: 'pos-003',
    title: 'BIM Specialist',
    department: 'engineering',
    employmentType: 'full-time',
    location: 'Mumbai, India',
    experience: '3-5 years',
    description:
      'Drive our digital design capabilities by managing BIM workflows, ensuring multi-discipline coordination, and maintaining model integrity across all project phases.',
    responsibilities: [
      'Develop and maintain Revit models to established BIM standards',
      'Perform clash detection and resolve coordination issues',
      'Create BIM execution plans and manage LOD requirements',
      'Train and support team members on BIM best practices',
      'Generate construction documentation from federated models',
    ],
    qualifications: [
      'Degree in Architecture, Engineering, or related field',
      '3-5 years of hands-on BIM experience, primarily in Revit',
      'Knowledge of Navisworks, Dynamo, and BIM 360',
      'Understanding of architectural, structural, and MEP systems',
      'Autodesk Certified Professional credential preferred',
    ],
    postedDate: '2026-02-01',
  },
  {
    id: 'pos-004',
    title: 'Project Manager',
    department: 'management',
    employmentType: 'full-time',
    location: 'Mumbai, India',
    experience: '6-10 years',
    description:
      "Orchestrate project delivery from inception to handover, ensuring every Forma Studio project meets its programme, budget, and quality targets through proactive planning and transparent communication.",
    responsibilities: [
      'Develop and manage project schedules, budgets, and resource plans',
      'Coordinate between design teams, consultants, and contractors',
      'Conduct regular client meetings and progress reporting',
      'Identify and mitigate project risks proactively',
      'Ensure compliance with regulatory and safety requirements',
    ],
    qualifications: [
      'Degree in Architecture, Civil Engineering, or Construction Management',
      '6-10 years of experience managing architectural or construction projects',
      'Proficiency in project management tools (MS Project, Primavera, or equivalent)',
      'Strong leadership, negotiation, and communication skills',
      'PMP certification is a plus',
    ],
    postedDate: '2026-01-25',
  },
  {
    id: 'pos-005',
    title: 'Junior Architect',
    department: 'architecture',
    employmentType: 'full-time',
    location: 'Mumbai, India',
    experience: '1-3 years',
    description:
      'Join our design team as a Junior Architect and contribute to a diverse range of projects while learning from experienced practitioners in a supportive, design-driven studio environment.',
    responsibilities: [
      'Assist in design development and concept exploration',
      'Prepare architectural drawings, sections, and details',
      'Build physical and digital study models',
      'Support senior architects with research and documentation',
      'Participate in design reviews and studio critiques',
    ],
    qualifications: [
      'B.Arch from a recognised institution',
      '1-3 years of post-graduation experience',
      'Proficiency in AutoCAD, Revit, and SketchUp',
      'Strong hand-sketching and conceptual design skills',
      'Enthusiasm for sustainable and climate-responsive design',
    ],
    postedDate: '2026-02-05',
  },
];

export const benefits: Benefit[] = [
  {
    id: 'benefit-001',
    icon: 'IndianRupee',
    title: 'Competitive Compensation',
    description:
      'Industry-leading salary packages with annual performance reviews and project-based bonuses.',
  },
  {
    id: 'benefit-002',
    icon: 'GraduationCap',
    title: 'Professional Development',
    description:
      'Conference sponsorships, workshop funding, and certification support to fuel your growth.',
  },
  {
    id: 'benefit-003',
    icon: 'Palette',
    title: 'Studio Culture',
    description:
      'A light-filled Bandra atelier designed for collaboration, with weekly design reviews and studio critiques.',
  },
  {
    id: 'benefit-004',
    icon: 'Clock',
    title: 'Flexible Working',
    description:
      'Hybrid work options, flexible hours, and generous paid time off to support work-life balance.',
  },
  {
    id: 'benefit-005',
    icon: 'Heart',
    title: 'Health & Wellness',
    description:
      'Comprehensive health insurance, wellness programmes, and an ergonomic workspace built for comfort.',
  },
  {
    id: 'benefit-006',
    icon: 'Globe',
    title: 'Exposure & Travel',
    description:
      'Opportunities to work across cities, visit international design fairs, and collaborate with global consultants.',
  },
];
