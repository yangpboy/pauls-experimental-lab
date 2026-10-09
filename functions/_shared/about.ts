import {
  DEFAULT_ABOUT_CONTENT,
  type AboutCapability,
  type AboutContent,
  type AboutLocaleContent,
  type PortfolioLanguage,
} from '../../shared/aboutContent';
import { ApiError } from './http';

interface SiteContentRow {
  value_json: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const readString = (source: Record<string, unknown>, key: string, fallback: string, maxLength = 2_000) => {
  const value = source[key];
  if (typeof value !== 'string') return fallback;
  return value.trim().slice(0, maxLength);
};

const readStringArray = (
  source: Record<string, unknown>,
  key: string,
  fallback: readonly string[],
  maxItems = 12,
  maxLength = 120,
) => {
  const value = source[key];
  if (!Array.isArray(value)) return [...fallback];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
};

const readCapability = (value: unknown, fallback: AboutCapability): AboutCapability => {
  const source = isRecord(value) ? value : {};
  return {
    title: readString(source, 'title', fallback.title, 120),
    description: readString(source, 'description', fallback.description, 1_000),
    tags: readStringArray(source, 'tags', fallback.tags, 12, 80),
  };
};

const readLocale = (value: unknown, fallback: AboutLocaleContent): AboutLocaleContent => {
  const source = isRecord(value) ? value : {};
  const capabilities = Array.isArray(source.capabilities) ? source.capabilities : [];
  const whatIDo = readStringArray(source, 'whatIDo', fallback.whatIDo, 2, 80);
  const legacyHeadline = [
    readString(source, 'introLead', '', 240),
    readString(source, 'introEngineering', '', 160),
    readString(source, 'introJoin', '', 80),
    readString(source, 'introArt', '', 160),
  ].filter(Boolean).join(' ');
  const legacyHeadlineWithEnding = `${legacyHeadline}${readString(source, 'introEnd', '', 8)}`.trim();

  return {
    role: readString(source, 'role', fallback.role, 160),
    headline: readString(source, 'headline', legacyHeadlineWithEnding || fallback.headline, 1_000),
    basedInLabel: readString(source, 'basedInLabel', fallback.basedInLabel, 80),
    basedIn: readString(source, 'basedIn', fallback.basedIn, 240),
    educationLabel: readString(source, 'educationLabel', fallback.educationLabel, 80),
    education: readString(source, 'education', fallback.education, 400),
    focusAreasLabel: readString(source, 'focusAreasLabel', fallback.focusAreasLabel, 80),
    focusAreas: readStringArray(source, 'focusAreas', fallback.focusAreas, 12, 100),
    bio: readStringArray(source, 'bio', fallback.bio, 6, 2_000),
    resume: readString(source, 'resume', fallback.resume, 80),
    whatIDo: [whatIDo[0] ?? fallback.whatIDo[0], whatIDo[1] ?? fallback.whatIDo[1]],
    capabilities: [0, 1, 2].map((index) => readCapability(capabilities[index], fallback.capabilities[index])) as AboutLocaleContent['capabilities'],
    worksTitle: readString(source, 'worksTitle', fallback.worksTitle, 120),
    timelineLabel: readString(source, 'timelineLabel', fallback.timelineLabel, 300),
    timelineHint: readString(source, 'timelineHint', fallback.timelineHint, 160),
    openProject: readString(source, 'openProject', fallback.openProject, 80),
  };
};

export const validateAboutContent = (value: unknown): AboutContent => {
  if (!isRecord(value)) {
    throw new ApiError(400, 'INVALID_ABOUT_CONTENT', 'About content must be an object.');
  }

  return (['en', 'zh'] as PortfolioLanguage[]).reduce((content, language) => {
    content[language] = readLocale(value[language], DEFAULT_ABOUT_CONTENT[language]);
    return content;
  }, {} as AboutContent);
};

export const getAboutContent = async (db: D1Database): Promise<AboutContent> => {
  const row = await db
    .prepare('SELECT value_json FROM site_content WHERE content_key = ? LIMIT 1')
    .bind('about')
    .first<SiteContentRow>();

  if (!row) return structuredClone(DEFAULT_ABOUT_CONTENT);

  try {
    return validateAboutContent(JSON.parse(row.value_json));
  } catch (error) {
    console.error('Invalid About content in D1:', error);
    return structuredClone(DEFAULT_ABOUT_CONTENT);
  }
};

export const saveAboutContent = async (db: D1Database, content: AboutContent) => {
  const updatedAt = new Date().toISOString();
  await db.prepare(`
    INSERT INTO site_content (content_key, value_json, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(content_key) DO UPDATE SET
      value_json = excluded.value_json,
      updated_at = excluded.updated_at
  `).bind('about', JSON.stringify(content), updatedAt).run();
  return content;
};
