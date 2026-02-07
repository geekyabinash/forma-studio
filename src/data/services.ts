import { Service } from '@/types';

export const services: Service[] = [
  {
    id: 'svc-001',
    title: 'Architecture Design',
    slug: 'architecture-design',
    shortTitle: 'Architecture',
    description:
      'We craft buildings that respond to context, climate, and the aspirations of the people who inhabit them. From concept sketches through construction documentation, our architecture practice delivers award-winning residential and commercial projects grounded in rigorous environmental analysis and a deep respect for place.',
    icon: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6',
    features: [
      'Site analysis and feasibility studies',
      'Conceptual design and 3D visualisation',
      'Sustainable and climate-responsive strategies',
      'Construction documentation and site supervision',
      'Statutory approvals and regulatory compliance',
    ],
    featuredProjectSlug: 'the-glass-pavilion',
    image: {
      id: 'img-svc-arch',
      url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=800&fit=crop',
      alt: 'Modern glass building showcasing architectural design excellence',
      width: 1200,
      height: 800,
    },
  },
  {
    id: 'svc-002',
    title: 'Interior Design',
    slug: 'interior-design',
    shortTitle: 'Interiors',
    description:
      'Our interior design studio transforms spaces into immersive experiences by orchestrating light, material, and proportion. Every project begins with an understanding of how people move through and use a space, resulting in interiors that are as functionally intuitive as they are visually compelling.',
    icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
    features: [
      'Space planning and ergonomic layout',
      'Material and finish specification',
      'Custom furniture and joinery design',
      'Lighting design and automation integration',
    ],
    featuredProjectSlug: 'serenity-interiors',
    image: {
      id: 'img-svc-int',
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=800&fit=crop',
      alt: 'Elegantly designed interior living space with curated materials',
      width: 1200,
      height: 800,
    },
  },
  {
    id: 'svc-003',
    title: 'Landscape Architecture',
    slug: 'landscape-architecture',
    shortTitle: 'Landscape',
    description:
      'We design outdoor environments that enrich biodiversity, manage water sustainably, and create meaningful places for community gathering. Our landscape practice integrates ecological science with artistic vision to deliver gardens, parks, and urban green infrastructure that thrive across seasons.',
    icon: 'M2 22l5-5 4 4 5-7 6 6 M17 8a3 3 0 100-6 3 3 0 000 6z',
    features: [
      'Master planning and planting design',
      'Stormwater management and bioswale engineering',
      'Native and drought-tolerant plant specification',
      'Hardscape detailing and outdoor lighting',
      'Ecological restoration and habitat creation',
    ],
    featuredProjectSlug: 'jade-gardens',
    image: {
      id: 'img-svc-land',
      url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&h=800&fit=crop',
      alt: 'Lush landscape garden with native planting and stone pathways',
      width: 1200,
      height: 800,
    },
  },
  {
    id: 'svc-004',
    title: 'Urban Planning',
    slug: 'urban-planning',
    shortTitle: 'Urban',
    description:
      'Our urban planning team shapes neighbourhoods and districts that balance density with liveability. Through data-driven analysis, stakeholder engagement, and scenario modelling, we create resilient master plans that accommodate growth while preserving cultural identity and ecological corridors.',
    icon: 'M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18 M15 3v18',
    features: [
      'District and neighbourhood master planning',
      'Transit-oriented development frameworks',
      'Public realm and streetscape design',
      'Stakeholder consultation and participatory design',
      'Development control and zoning guidelines',
    ],
    featuredProjectSlug: 'metro-commerce-hub',
    image: {
      id: 'img-svc-urban',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
      alt: 'Modern urban commercial district with mixed-use towers',
      width: 1200,
      height: 800,
    },
  },
  {
    id: 'svc-005',
    title: 'Renovation & Restoration',
    slug: 'renovation-restoration',
    shortTitle: 'Renovation',
    description:
      'We breathe new life into heritage structures and ageing buildings through sensitive renovation and adaptive reuse. Our conservation architects combine traditional craft techniques with modern building science to extend the lifespan of valued architecture while meeting contemporary performance standards.',
    icon: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
    features: [
      'Heritage impact assessments and conservation plans',
      'Structural stabilisation and seismic retrofitting',
      'Artisanal restoration of ornamental elements',
      'Adaptive reuse strategy and programming',
      'Energy-efficiency upgrades for existing buildings',
    ],
    featuredProjectSlug: 'heritage-revive',
    image: {
      id: 'img-svc-reno',
      url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&h=800&fit=crop',
      alt: 'Beautifully restored heritage building with ornate architectural details',
      width: 1200,
      height: 800,
    },
  },
];
