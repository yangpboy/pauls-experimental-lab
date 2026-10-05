import type { ProjectSummary } from '../types/cms';

const COVER_OVERRIDES: Record<string, string> = {
  'geologic-assemblies': '/works/geologic-assemblies/assets/00-02.webp',
  'dark-side-of-the-tini': '/works/tini/garage-cover.jpg',
  'explo-11': '/works/explo.11/garage-cover.jpg',
  'tube-radio': '/works/tube/garage-cover.jpg',
  'invisible-senses': '/works/invisible/garage-cover.jpg',
};

export const getGarageProjectPresentation = (project: ProjectSummary) => {
  const isPortfolio = project.slug === '2025-industrial-design-portfolio';
  const isInvisible = project.slug === 'invisible-senses';

  return {
    cover: isPortfolio ? null : (COVER_OVERRIDES[project.slug] ?? project.coverImageUrl),
    showTitle: isPortfolio,
    background: isPortfolio ? '#FF7A2A' : isInvisible ? '#F7F4EF' : '#10131C',
    foreground: isInvisible ? '#10131C' : '#F7F4EF',
  };
};
