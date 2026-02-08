import { Service } from '@/types';

export const services: Service[] = [
  {
    id: 'svc-001',
    title: 'Building Information Modeling (BIM)',
    slug: 'building-information-modeling',
    shortTitle: 'BIM',
    description:
      'We leverage Building Information Modeling to create intelligent 3D models that serve as a single source of truth across every project phase. Our BIM management integrates architecture, structure, and services into a coordinated digital twin — reducing clashes, controlling costs, and enabling data-driven decision-making from concept through facility management.',
    icon: 'M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z M12 2v20 M4 6.5l8 4.5 M20 6.5l-8 4.5',
    features: [
      '3D parametric modelling and clash detection',
      'BIM execution planning and LOD management',
      '4D scheduling and 5D cost estimation',
      'Multi-discipline coordination and federated models',
      'As-built model delivery and facility management handover',
    ],
    image: {
      id: 'img-svc-bim',
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop',
      alt: 'Digital architectural model representing BIM services and coordination',
      width: 1200,
      height: 800,
    },
  },
  {
    id: 'svc-002',
    title: 'Construction',
    slug: 'construction',
    shortTitle: 'Construction',
    description:
      'From ground-breaking to handover, our construction division delivers projects with uncompromising quality, safety, and programme discipline. We manage every aspect of the build process — procurement, site logistics, subcontractor coordination, and quality assurance — ensuring each project is completed on time, within budget, and to the highest industry standards.',
    icon: 'M2 20h20 M5 20V10l3-3 M12 20V6l3-3h4v17 M9 20v-6h4v6 M15 10h2 M15 14h2',
    features: [
      'Turnkey project execution and programme management',
      'Procurement, tendering, and supply chain coordination',
      'On-site quality control and safety management',
      'Progress monitoring and milestone reporting',
      'Defects liability management and project close-out',
    ],
    image: {
      id: 'img-svc-const',
      url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=800&fit=crop',
      alt: 'Active construction site with structural framework and crane',
      width: 1200,
      height: 800,
    },
  },
  {
    id: 'svc-003',
    title: 'Infrastructure Engineering Consulting',
    slug: 'infrastructure-engineering-consulting',
    shortTitle: 'Infrastructure',
    description:
      'Our infrastructure consulting practice provides end-to-end engineering advisory for complex civil and urban projects. We guide clients through feasibility studies, regulatory frameworks, and technical design to deliver resilient roads, utilities, water systems, and public infrastructure that supports sustainable community growth.',
    icon: 'M2 20l4-4h4l2-3h4l2 3h4l4 4 M6 16V8 M12 13V4 M18 16V10',
    features: [
      'Feasibility studies and due diligence reports',
      'Transportation and road network engineering',
      'Water supply, drainage, and sewerage design',
      'Utility mapping and underground services coordination',
      'Regulatory compliance and environmental clearance support',
    ],
    image: {
      id: 'img-svc-infra',
      url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&h=800&fit=crop',
      alt: 'Modern infrastructure project showcasing engineering excellence',
      width: 1200,
      height: 800,
    },
  },
  {
    id: 'svc-004',
    title: 'Structural Engineering',
    slug: 'structural-engineering',
    shortTitle: 'Structural',
    description:
      'Our structural engineering team designs safe, efficient, and elegant load-bearing systems for buildings and infrastructure of every scale. Combining advanced computational analysis with practical construction insight, we deliver optimised foundations, frames, and lateral-force-resisting systems that meet the most demanding performance and code requirements.',
    icon: 'M3 21h18 M5 21V8h4v13 M10 21V5h4v16 M15 21V3h4v18',
    features: [
      'Structural analysis and finite-element modelling',
      'Reinforced concrete, steel, and timber frame design',
      'Foundation engineering and geotechnical coordination',
      'Seismic and wind-load analysis',
      'Structural health assessment and retrofitting',
    ],
    image: {
      id: 'img-svc-struct',
      url: 'https://images.unsplash.com/photo-1632434226725-d3ee18d066ec?w=1200&h=800&fit=crop',
      alt: 'High-rise building under construction showcasing structural framework against blue sky',
      width: 1200,
      height: 800,
    },
  },
  {
    id: 'svc-005',
    title: 'PHE, Electrical, Acoustical & HVAC Systems',
    slug: 'phe-electrical-acoustical-hvac',
    shortTitle: 'MEP & HVAC',
    description:
      'We design fully integrated building services that ensure occupant comfort, energy efficiency, and regulatory compliance. Our multidisciplinary team covers plumbing and fire-protection, power distribution and lighting, room acoustics and noise control, and heating, ventilation, and air-conditioning — delivering coordinated systems that perform seamlessly from day one.',
    icon: 'M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M2 12h4 M18 12h4 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83',
    features: [
      'Plumbing, drainage, and fire-protection engineering (PHE)',
      'Electrical distribution, lighting, and low-current systems',
      'HVAC system design and energy modelling',
      'Acoustic design, noise control, and vibration isolation',
      'Green building compliance and sustainability certification support',
    ],
    image: {
      id: 'img-svc-mep',
      url: 'https://images.unsplash.com/photo-1700915181084-42aaf63982ca?w=1200&h=800&fit=crop',
      alt: 'Modern building interior with exposed HVAC ductwork and engineered building services',
      width: 1200,
      height: 800,
    },
  },
];
