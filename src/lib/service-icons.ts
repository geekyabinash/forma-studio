export interface ServiceIconPreset {
  key: string
  label: string
  path: string
}

export const SERVICE_ICON_PRESETS: ServiceIconPreset[] = [
  {
    key: 'cube',
    label: 'Cube (BIM / 3D Modeling)',
    path: 'M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z M12 2v20 M4 6.5l8 4.5 M20 6.5l-8 4.5',
  },
  {
    key: 'building',
    label: 'Building (Architecture)',
    path: 'M3 21V7l9-4 9 4v14 M9 21V11h6v10 M9 7h6 M9 14h6',
  },
  {
    key: 'home',
    label: 'Home (Residential)',
    path: 'M3 12L12 3l9 9v9h-6v-7H9v7H3z',
  },
  {
    key: 'sofa',
    label: 'Sofa (Interior)',
    path: 'M3 14V10a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v4 M3 14h18v5H3z M6 19v2 M18 19v2',
  },
  {
    key: 'compass',
    label: 'Compass (Planning)',
    path: 'M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z M12 12l4-7 M12 12l-3 7',
  },
  {
    key: 'ruler',
    label: 'Ruler (Drafting)',
    path: 'M4 16L16 4l4 4L8 20z M7 13l2 2 M10 10l2 2 M13 7l2 2',
  },
  {
    key: 'layers',
    label: 'Layers (Coordination)',
    path: 'M12 2L2 8l10 6 10-6L12 2z M2 16l10 6 10-6 M2 12l10 6 10-6',
  },
  {
    key: 'tree',
    label: 'Tree (Landscape)',
    path: 'M12 22V13 M12 13c-4 0-7-3-7-7h14c0 4-3 7-7 7',
  },
  {
    key: 'lightbulb',
    label: 'Lightbulb (Concept)',
    path: 'M9 18h6 M10 21h4 M12 3a6 6 0 0 1 4 10c-1 1-1 2-1 4H9c0-2 0-3-1-4a6 6 0 0 1 4-10z',
  },
  {
    key: 'hardhat',
    label: 'Hard Hat (Construction)',
    path: 'M3 18h18 M3 18v-2a8 8 0 0 1 16 0v2 M9 11V8a3 3 0 0 1 6 0v3',
  },
  {
    key: 'bridge',
    label: 'Bridge (Infrastructure)',
    path: 'M3 16h18 M3 12c4 0 5-4 9-4s5 4 9 4 M3 16v3 M21 16v3 M12 8v8',
  },
  {
    key: 'document',
    label: 'Document (Specifications)',
    path: 'M5 2h10l5 5v15H5z M14 2v6h6 M8 13h8 M8 17h8',
  },
  {
    key: 'paintbrush',
    label: 'Paintbrush (Design / Finishes)',
    path: 'M9 11l4-4 5 5-4 4z M9 11l-4 4a3 3 0 1 0 4 4l4-4 M14 6l3-3',
  },
  {
    key: 'globe',
    label: 'Globe (Sustainability)',
    path: 'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z M2 12h20 M12 2a14 14 0 0 1 0 20 M12 2a14 14 0 0 0 0 20',
  },
  {
    key: 'users',
    label: 'Users (Consulting)',
    path: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  },
]

export const DEFAULT_SERVICE_ICON_PATH = SERVICE_ICON_PRESETS[1].path // building

export function resolveServiceIconPath(stored: string | null | undefined): string {
  const value = stored?.trim() ?? ''
  if (value.length === 0) return DEFAULT_SERVICE_ICON_PATH
  // Stored as a preset key
  const preset = SERVICE_ICON_PRESETS.find((p) => p.key === value)
  if (preset) return preset.path
  // Otherwise treat as raw SVG path data
  return value
}
