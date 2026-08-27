import type { ProjectSummary } from '../types/cms';

type ProjectCreativeFieldSource = Pick<ProjectSummary, 'category'> & {
  creativeFields?: string[];
};

export const getProjectCreativeFields = (project: ProjectCreativeFieldSource): string[] => {
  const source = project.creativeFields?.length > 0
    ? project.creativeFields
    : project.category.split(',');
  const seen = new Set<string>();

  const creativeFields = source
    .map((creativeField) => creativeField.trim())
    .filter((creativeField) => {
      if (!creativeField) return false;
      const key = creativeField.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  return creativeFields.length > 0 ? creativeFields : ['Uncategorized'];
};

export const getPrimaryCreativeField = (project: ProjectCreativeFieldSource) =>
  getProjectCreativeFields(project)[0];
