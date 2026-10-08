import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Eye, Loader2, Save } from 'lucide-react';
import { adminAboutApi, CmsApiError } from '../lib/api';
import {
  DEFAULT_ABOUT_CONTENT,
  type AboutContent,
  type AboutLocaleContent,
  type PortfolioLanguage,
} from '../../shared/aboutContent';

const inputClass = 'w-full rounded-md border border-[#d8d8d8] bg-white px-3 py-2.5 text-sm text-[#191919] outline-none transition placeholder:text-[#9b9b9b] focus:border-[#1769ff] focus:ring-2 focus:ring-[#1769ff]/15';
const labelClass = 'mb-1.5 block text-[11px] font-semibold text-[#5f5f5f]';
const secondaryButtonClass = 'inline-flex items-center justify-center gap-2 rounded-full border border-[#d8d8d8] bg-white px-4 py-2 text-sm font-semibold text-[#191919] transition hover:border-[#9b9b9b] hover:bg-[#f7f7f7] disabled:cursor-not-allowed disabled:opacity-45';
const primaryButtonClass = 'inline-flex items-center justify-center gap-2 rounded-full bg-[#1769ff] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0057e7] disabled:cursor-not-allowed disabled:opacity-45';

const languageNames: Record<PortfolioLanguage, string> = {
  en: 'English',
  zh: '中文',
};

function Field({ label, value, onChange, placeholder }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return <label className="block">
    <span className={labelClass}>{label}</span>
    <input className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
  </label>;
}

function TextArea({ label, value, onChange, rows = 4 }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return <label className="block">
    <span className={labelClass}>{label}</span>
    <textarea className={`${inputClass} resize-y leading-6`} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
  </label>;
}

function ListField({ label, values, onChange, hint = 'Separate items with commas.' }: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  hint?: string;
}) {
  return <label className="block">
    <span className={labelClass}>{label}</span>
    <input
      className={inputClass}
      value={values.join(', ')}
      onChange={(event) => onChange(event.target.value.split(',').map((item) => item.trim()).filter(Boolean))}
    />
    <span className="mt-1.5 block text-[10px] leading-4 text-[#858585]">{hint}</span>
  </label>;
}

export default function AboutEditor() {
  const [draft, setDraft] = useState<AboutContent>(() => structuredClone(DEFAULT_ABOUT_CONTENT));
  const [language, setLanguage] = useState<PortfolioLanguage>('en');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const copy = draft[language];
  const previewIntro = useMemo(
    () => `${copy.introLead} ${copy.introEngineering} ${copy.introJoin} ${copy.introArt}${copy.introEnd}`.replace(/\s+/g, ' ').trim(),
    [copy],
  );

  useEffect(() => {
    let cancelled = false;
    adminAboutApi.get()
      .then((content) => {
        if (!cancelled) setDraft(content);
      })
      .catch((requestError: unknown) => {
        if (cancelled) return;
        setError(requestError instanceof CmsApiError && requestError.status === 401
          ? 'Your editor session has expired. Sign in again to edit the About page.'
          : requestError instanceof Error ? requestError.message : 'Unable to load the About page.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warnBeforeLeaving);
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving);
  }, [dirty]);

  const updateLocale = <K extends keyof AboutLocaleContent>(key: K, value: AboutLocaleContent[K]) => {
    setDraft((current) => ({
      ...current,
      [language]: { ...current[language], [key]: value },
    }));
    setDirty(true);
    setNotice(null);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const saved = await adminAboutApi.update(draft);
      setDraft(saved);
      setDirty(false);
      setNotice('About page saved. Both language versions are now up to date.');
    } catch (requestError) {
      setError(requestError instanceof CmsApiError && requestError.status === 401
        ? 'Your editor session has expired. Sign in again before saving.'
        : requestError instanceof Error ? requestError.message : 'Unable to save the About page.');
    } finally {
      setSaving(false);
    }
  };

  const updateCapability = (index: number, patch: Partial<AboutLocaleContent['capabilities'][number]>) => {
    const capabilities = copy.capabilities.map((capability, capabilityIndex) =>
      capabilityIndex === index ? { ...capability, ...patch } : capability,
    ) as AboutLocaleContent['capabilities'];
    updateLocale('capabilities', capabilities);
  };

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-[#f5f5f5] text-[#737373]"><div className="flex items-center gap-2 text-sm"><Loader2 className="animate-spin" size={18} /> Loading About content…</div></div>;
  }

  return <div className="min-h-screen bg-[#f5f5f5] text-[#191919]">
    <header className="sticky top-0 z-40 border-b border-[#dedede] bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-[1440px] items-center gap-3 px-3 md:px-6">
        <a href="/admin" className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-[#f2f2f2]" aria-label="Back to portfolio editor"><ArrowLeft size={20} /></a>
        <div className="hidden h-8 w-px bg-[#e2e2e2] sm:block" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">About page editor</p>
          <p className="flex items-center gap-1.5 text-[11px] text-[#737373]">{dirty ? <><span className="h-1.5 w-1.5 rounded-full bg-[#e3a008]" />Unsaved changes</> : <><Check size={12} />All changes saved</>}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <a href="/#about" target="_blank" rel="noreferrer" className={`${secondaryButtonClass} px-3 sm:px-4`}><Eye size={15} /><span className="hidden sm:inline">Preview</span></a>
          <button type="button" className={primaryButtonClass} disabled={saving || !dirty} onClick={() => void save()}>{saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}<span className="hidden sm:inline">Save About</span></button>
        </div>
      </div>
    </header>

    <main className="mx-auto max-w-[1440px] px-4 py-7 md:px-6 md:py-10">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#737373]">Page content</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Edit About Me</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737373]">English and Chinese share one content record. Switch tabs to edit each version, then save them together.</p>
        </div>
        <div className="inline-flex self-start rounded-full border border-[#d8d8d8] bg-white p-1" role="tablist" aria-label="Content language">
          {(['en', 'zh'] as PortfolioLanguage[]).map((item) => <button
            key={item}
            type="button"
            role="tab"
            aria-selected={language === item}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${language === item ? 'bg-[#191919] text-white' : 'text-[#666] hover:bg-[#f2f2f2]'}`}
            onClick={() => setLanguage(item)}
          >{languageNames[item]}</button>)}
        </div>
      </div>

      {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {notice && <div role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-[#dedede] bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-base font-semibold">Introduction</h2>
            <p className="mt-1 text-xs leading-5 text-[#737373]">Controls the name card, headline, location, education, and focus tags.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2"><Field label="Role" value={copy.role} onChange={(value) => updateLocale('role', value)} /></div>
              <Field label="Headline — opening" value={copy.introLead} onChange={(value) => updateLocale('introLead', value)} />
              <Field label="Headline — engineering phrase" value={copy.introEngineering} onChange={(value) => updateLocale('introEngineering', value)} />
              <Field label="Headline — connector" value={copy.introJoin} onChange={(value) => updateLocale('introJoin', value)} />
              <Field label="Headline — art phrase" value={copy.introArt} onChange={(value) => updateLocale('introArt', value)} />
              <Field label="Location label" value={copy.basedInLabel} onChange={(value) => updateLocale('basedInLabel', value)} />
              <Field label="Location" value={copy.basedIn} onChange={(value) => updateLocale('basedIn', value)} />
              <Field label="Education label" value={copy.educationLabel} onChange={(value) => updateLocale('educationLabel', value)} />
              <Field label="Education" value={copy.education} onChange={(value) => updateLocale('education', value)} />
              <Field label="Focus areas label" value={copy.focusAreasLabel} onChange={(value) => updateLocale('focusAreasLabel', value)} />
              <ListField label="Focus areas" values={copy.focusAreas} onChange={(value) => updateLocale('focusAreas', value)} />
            </div>
          </section>

          <section className="rounded-xl border border-[#dedede] bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-base font-semibold">Biography</h2>
            <div className="mt-5 space-y-4">
              <TextArea label="Paragraph 1" value={copy.bio[0] ?? ''} onChange={(value) => updateLocale('bio', [value, copy.bio[1] ?? ''])} rows={5} />
              <TextArea label="Paragraph 2" value={copy.bio[1] ?? ''} onChange={(value) => updateLocale('bio', [copy.bio[0] ?? '', value])} rows={6} />
              <Field label="Resume button" value={copy.resume} onChange={(value) => updateLocale('resume', value)} />
            </div>
          </section>

          <section className="rounded-xl border border-[#dedede] bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-base font-semibold">Capabilities</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Section title — line 1" value={copy.whatIDo[0]} onChange={(value) => updateLocale('whatIDo', [value, copy.whatIDo[1]])} />
              <Field label="Section title — line 2" value={copy.whatIDo[1]} onChange={(value) => updateLocale('whatIDo', [copy.whatIDo[0], value])} />
            </div>
            <div className="mt-5 space-y-4">
              {copy.capabilities.map((capability, index) => <fieldset key={index} className="rounded-lg border border-[#e2e2e2] bg-[#fafafa] p-4">
                <legend className="px-2 text-xs font-semibold text-[#737373]">Card {index + 1}</legend>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title" value={capability.title} onChange={(value) => updateCapability(index, { title: value })} />
                  <ListField label="Tags" values={capability.tags} onChange={(value) => updateCapability(index, { tags: value })} />
                  <div className="md:col-span-2"><TextArea label="Description" value={capability.description} onChange={(value) => updateCapability(index, { description: value })} rows={3} /></div>
                </div>
              </fieldset>)}
            </div>
          </section>

          <section className="rounded-xl border border-[#dedede] bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-base font-semibold">Works timeline</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Section title" value={copy.worksTitle} onChange={(value) => updateLocale('worksTitle', value)} />
              <Field label="Project action" value={copy.openProject} onChange={(value) => updateLocale('openProject', value)} />
              <div className="md:col-span-2"><Field label="Accessible timeline label" value={copy.timelineLabel} onChange={(value) => updateLocale('timelineLabel', value)} /></div>
              <div className="md:col-span-2"><Field label="Swipe hint" value={copy.timelineHint} onChange={(value) => updateLocale('timelineHint', value)} /></div>
            </div>
          </section>
        </div>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <div className="overflow-hidden rounded-xl border border-[#2f2f2f] bg-[#111] text-white shadow-xl">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">Content preview · {languageNames[language]}</p>
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.14em] text-white/50">PO-YU YANG</p>
              <p className="mt-2 text-sm text-white/70">{copy.role}</p>
              <h2 className="mt-8 text-3xl font-medium leading-tight">{previewIntro}</h2>
              <div className="mt-8 grid grid-cols-2 gap-4 border-y border-white/20 py-5 text-sm">
                <div><p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">{copy.basedInLabel}</p><p className="mt-2 leading-5">{copy.basedIn}</p></div>
                <div><p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">{copy.educationLabel}</p><p className="mt-2 leading-5">{copy.education}</p></div>
              </div>
              <div className="mt-6 space-y-4 text-sm leading-6 text-white/65">{copy.bio.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
              <div className="mt-8 flex flex-wrap gap-2">{copy.focusAreas.map((area) => <span key={area} className="rounded-full border border-white/20 px-3 py-1 text-xs">{area}</span>)}</div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>;
}
