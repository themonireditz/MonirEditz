export interface FontOption {
  id: string;
  name: string;
  category: string;
  family: string;
  description: string;
  sampleHeadline: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'neue-haas',
    name: 'Neue Haas Grotesk',
    category: 'Grotesk / Clean',
    family: '"Neue Haas Grotesk Display Pro", "Neue Haas Grotesk Text Pro", "Neue Haas Grotesk", "Host Grotesk", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    description: 'Modern, balanced & high-impact portfolio typography.',
    sampleHeadline: 'Crafting Stories That Captivate.'
  },
  {
    id: 'plus-jakarta',
    name: 'Plus Jakarta Sans',
    category: 'Tech / Modern',
    family: '"Plus Jakarta Sans", sans-serif',
    description: 'Crisp, contemporary tech aesthetic with high legibility.',
    sampleHeadline: 'Crafting Stories That Captivate.'
  },
  {
    id: 'inter',
    name: 'Inter',
    category: 'Minimalist UI',
    family: '"Inter", sans-serif',
    description: 'Ultra-clean, neutral UI typeface favoured by top product teams.',
    sampleHeadline: 'Crafting Stories That Captivate.'
  },
  {
    id: 'outfit',
    name: 'Outfit',
    category: 'Geometric / Punchy',
    family: '"Outfit", sans-serif',
    description: 'Dynamic geometric curves with a powerful visual presence.',
    sampleHeadline: 'Crafting Stories That Captivate.'
  },
  {
    id: 'syne',
    name: 'Syne',
    category: 'Artistic / Creative',
    family: '"Syne", sans-serif',
    description: 'Distinctive, trendy & high-fashion display style.',
    sampleHeadline: 'Crafting Stories That Captivate.'
  },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    category: 'Futuristic / Monospace',
    family: '"Space Grotesk", sans-serif',
    description: 'Edgy, tech-forward monospace-inspired letterforms.',
    sampleHeadline: 'Crafting Stories That Captivate.'
  },
  {
    id: 'poppins',
    name: 'Poppins',
    category: 'Geometric / Friendly',
    family: '"Poppins", sans-serif',
    description: 'Smooth, friendly rounded geometry with clear weight hierarchy.',
    sampleHeadline: 'Crafting Stories That Captivate.'
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    category: 'Sleek Sans',
    family: '"Montserrat", sans-serif',
    description: 'Wide, architectural sans-serif with a premium editorial feel.',
    sampleHeadline: 'Crafting Stories That Captivate.'
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    category: 'Luxury Serif',
    family: '"Playfair Display", Georgia, serif',
    description: 'High-contrast elegant serif for a classic luxury editorial vibe.',
    sampleHeadline: 'Crafting Stories That Captivate.'
  },
  {
    id: 'dm-sans',
    name: 'DM Sans',
    category: 'Contemporary / Refined',
    family: '"DM Sans", sans-serif',
    description: 'Streamlined geometric sans tailored for pristine digital readability.',
    sampleHeadline: 'Crafting Stories That Captivate.'
  }
];

export const getFontFamilyCss = (fontId?: string): string => {
  const selected = FONT_OPTIONS.find((f) => f.id === fontId);
  return selected ? selected.family : FONT_OPTIONS[0].family;
};
