import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { adminProjectsApi, CmsApiError } from '../lib/api';
import {
  BLOCK_TYPES,
  createEmptyBlock,
  type BlockType,
  type GalleryImage,
  type ProcessStep,
  type Project,
  type ProjectBlock,
  type ProjectBlockContent,
  type ProjectInput,
  type ProjectStatus,
} from '../types/cms';

const inputClass = 'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10';
const labelClass = 'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500';
const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-900 px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0';

const emptyProject = (sortOrder = 0): ProjectInput => ({
  slug: '',
  title: '',
  summary: '',
  coverImageUrl: '',
  category: 'Product Design',
  projectDate: '',
  location: '',
  author: 'Po-Yu Yang',
  tools: [],
  status: 'draft',
  sortOrder,
  blocks: [],
});

const projectToInput = (project: Project): ProjectInput => ({
  slug: project.slug,
  title: project.title,
  summary: project.summary,
  coverImageUrl: project.coverImageUrl,
  category: project.category,
  projectDate: project.projectDate,
  location: project.location,
  author: project.author,
  tools: [...project.tools],
  status: project.status,
  sortOrder: project.sortOrder,
  blocks: project.blocks.map((block) => ({ ...block, content: structuredClone(block.content) })),
});

const slugify = (value: string) => value
  .normalize('NFKD')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const valueText = (value: unknown) => typeof value === 'string' ? value : '';
const valueObject = (value: unknown) => value && typeof value === 'object' && !Array.isArray(value)
  ? value as Record<string, unknown>
  : {};

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input className={inputClass} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 5 }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <textarea className={`${inputClass} resize-y`} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function BlockFields({ block, onChange }: { block: ProjectBlock; onChange: (content: ProjectBlockContent) => void }) {
  const update = (patch: Partial<ProjectBlockContent>) => onChange({ ...block.content, ...patch });

  if (block.type === 'hero') {
    return <div className="grid gap-4 md:grid-cols-2">
      <Field label="Image URL" value={valueText(block.content.imageUrl)} onChange={(imageUrl) => update({ imageUrl })} />
      <Field label="Eyebrow" value={valueText(block.content.eyebrow)} onChange={(eyebrow) => update({ eyebrow })} />
      <Field label="Heading" value={valueText(block.content.heading)} onChange={(heading) => update({ heading })} />
      <Field label="Subheading" value={valueText(block.content.subheading)} onChange={(subheading) => update({ subheading })} />
    </div>;
  }

  if (block.type === 'text') {
    return <div className="space-y-4">
      <Field label="Heading (optional)" value={valueText(block.content.heading)} onChange={(heading) => update({ heading })} />
      <TextArea label="Body" rows={8} value={valueText(block.content.body)} onChange={(body) => update({ body })} placeholder="Separate paragraphs with a blank line." />
    </div>;
  }

  if (block.type === 'image') {
    return <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2"><Field label="Image URL" value={valueText(block.content.url)} onChange={(url) => update({ url })} /></div>
      <Field label="Alt text" value={valueText(block.content.alt)} onChange={(alt) => update({ alt })} />
      <Field label="Caption" value={valueText(block.content.caption)} onChange={(caption) => update({ caption })} />
    </div>;
  }

  if (block.type === 'gallery') {
    const images = Array.isArray(block.content.images) ? block.content.images as GalleryImage[] : [];
    const lines = images.map((image) => [image.url, image.alt, image.caption].filter(Boolean).join(' | ')).join('\n');
    return <div className="space-y-4">
      <TextArea
        label="Images — one per line: URL | alt | caption"
        rows={9}
        value={lines}
        onChange={(value) => update({
          images: value.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
            const [url, alt, caption] = line.split('|').map((part) => part.trim());
            return { url, alt, caption };
          }),
        })}
      />
      <div className="flex flex-wrap items-end gap-4">
        <label>
          <span className={labelClass}>Columns</span>
          <select className={inputClass} value={String(block.content.columns ?? 1)} onChange={(event) => update({ columns: Number(event.target.value) })}>
            <option value="1">1</option><option value="2">2</option><option value="3">3</option>
          </select>
        </label>
        <label className="flex items-center gap-2 pb-2.5 text-sm"><input type="checkbox" checked={block.content.gap !== 'none'} onChange={(event) => update({ gap: event.target.checked ? 'normal' : 'none' })} /> Add gap</label>
        <label className="flex items-center gap-2 pb-2.5 text-sm"><input type="checkbox" checked={block.content.square === true} onChange={(event) => update({ square: event.target.checked })} /> Square crop</label>
      </div>
    </div>;
  }

  if (block.type === 'video') {
    return <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2"><Field label="Video / YouTube / Vimeo URL" value={valueText(block.content.url)} onChange={(url) => update({ url })} /></div>
      <Field label="Poster URL" value={valueText(block.content.posterUrl)} onChange={(posterUrl) => update({ posterUrl })} />
      <Field label="Caption" value={valueText(block.content.caption)} onChange={(caption) => update({ caption })} />
    </div>;
  }

  if (block.type === 'quote') {
    return <div className="space-y-4">
      <TextArea label="Quote" value={valueText(block.content.quote)} onChange={(quote) => update({ quote })} />
      <Field label="Attribution" value={valueText(block.content.attribution)} onChange={(attribution) => update({ attribution })} />
    </div>;
  }

  if (block.type === 'twoColumn') {
    const left = valueObject(block.content.left);
    const right = valueObject(block.content.right);
    const updateColumn = (side: 'left' | 'right', patch: Record<string, unknown>) => {
      const current = side === 'left' ? left : right;
      update({ [side]: { ...current, ...patch } });
    };
    return <div className="grid gap-6 md:grid-cols-2">
      {([['left', left], ['right', right]] as const).map(([side, column]) => <div key={side} className="space-y-4 rounded-lg bg-neutral-50 p-4">
        <p className="text-xs font-bold uppercase tracking-widest">{side} column</p>
        <Field label="Image URL" value={valueText(column.imageUrl)} onChange={(imageUrl) => updateColumn(side, { imageUrl })} />
        <Field label="Heading" value={valueText(column.heading)} onChange={(heading) => updateColumn(side, { heading })} />
        <TextArea label="Body" value={valueText(column.body)} onChange={(body) => updateColumn(side, { body })} />
      </div>)}
    </div>;
  }

  const steps = Array.isArray(block.content.steps) ? block.content.steps as ProcessStep[] : [];
  return <div className="space-y-4">
    <Field label="Section heading" value={valueText(block.content.heading)} onChange={(heading) => update({ heading })} />
    <TextArea
      label="Steps — one per line: Title | description | image URL"
      rows={9}
      value={steps.map((step) => [step.title, step.description, step.imageUrl].filter(Boolean).join(' | ')).join('\n')}
      onChange={(value) => update({
        steps: value.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
          const [title, description, imageUrl] = line.split('|').map((part) => part.trim());
          return { title, description, imageUrl };
        }),
      })}
    />
  </div>;
}

function BlockCard({ block, index, total, onUpdate, onMove, onDelete }: {
  block: ProjectBlock;
  index: number;
  total: number;
  onUpdate: (block: ProjectBlock) => void;
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
}) {
  return (
    <article className="rounded-xl border border-neutral-300 bg-white p-4 shadow-sm md:p-5">
      <header className="mb-5 flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-4">
        <span className="font-mono text-xs font-bold text-neutral-400">{String(index + 1).padStart(2, '0')}</span>
        <select
          className={`${inputClass} w-auto min-w-36 font-semibold`}
          value={block.type}
          onChange={(event) => {
            const replacement = createEmptyBlock(event.target.value as BlockType, index);
            onUpdate({ ...replacement, id: block.id });
          }}
        >
          {BLOCK_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <div className="ml-auto flex gap-1">
          <button type="button" className="rounded-md p-2 hover:bg-neutral-100 disabled:opacity-30" disabled={index === 0} onClick={() => onMove(-1)} aria-label="Move block up"><ArrowUp size={16} /></button>
          <button type="button" className="rounded-md p-2 hover:bg-neutral-100 disabled:opacity-30" disabled={index === total - 1} onClick={() => onMove(1)} aria-label="Move block down"><ArrowDown size={16} /></button>
          <button type="button" className="rounded-md p-2 text-red-600 hover:bg-red-50" onClick={onDelete} aria-label="Delete block"><Trash2 size={16} /></button>
        </div>
      </header>
      <BlockFields block={block} onChange={(content) => onUpdate({ ...block, content })} />
    </article>
  );
}

export default function AdminApp() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProjectInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [orderDirty, setOrderDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [newBlockType, setNewBlockType] = useState<BlockType>('text');

  const selectedProject = useMemo(() => projects.find((project) => project.id === selectedId) ?? null, [projects, selectedId]);

  useEffect(() => {
    let cancelled = false;
    adminProjectsApi.list()
      .then((items) => {
        if (!cancelled) setProjects(items);
      })
      .catch((requestError: unknown) => {
        if (cancelled) return;
        const message = requestError instanceof CmsApiError && requestError.status === 401
          ? 'Admin access is not authenticated. Protect /admin* and /api/admin/* with Cloudflare Access, then sign in with an allowed account.'
          : requestError instanceof Error ? requestError.message : 'Unable to load projects.';
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const selectProject = (project: Project) => {
    setSelectedId(project.id);
    setDraft(projectToInput(project));
    setError(null);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createNew = () => {
    setSelectedId(null);
    setDraft(emptyProject(projects.length));
    setError(null);
    setNotice(null);
  };

  const updateDraft = <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) => {
    setDraft((current) => current ? { ...current, [key]: value } : current);
  };

  const save = async (status: ProjectStatus) => {
    if (!draft) return;
    if (!draft.title.trim() || !draft.slug.trim()) {
      setError('Title and slug are required before saving.');
      return;
    }

    setSaving(true);
    setError(null);
    setNotice(null);
    const payload: ProjectInput = {
      ...draft,
      status,
      blocks: draft.blocks.map((block, index) => ({ ...block, sortOrder: index })),
    };

    try {
      const saved = selectedId
        ? await adminProjectsApi.update(selectedId, payload)
        : await adminProjectsApi.create(payload);
      setProjects((current) => [...current.filter((project) => project.id !== saved.id), saved].sort((a, b) => a.sortOrder - b.sortOrder));
      setSelectedId(saved.id);
      setDraft(projectToInput(saved));
      setNotice(status === 'published' ? 'Published. The public API now serves this version.' : 'Draft saved.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save this project.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!selectedProject || !window.confirm(`Delete “${selectedProject.title}”? This cannot be undone.`)) return;
    setSaving(true);
    setError(null);
    try {
      await adminProjectsApi.remove(selectedProject.id);
      setProjects((current) => current.filter((project) => project.id !== selectedProject.id));
      setSelectedId(null);
      setDraft(null);
      setNotice('Project deleted.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete this project.');
    } finally {
      setSaving(false);
    }
  };

  const moveProject = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const reordered = [...projects];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const normalized = reordered.map((project, sortOrder) => ({ ...project, sortOrder }));
    setProjects(normalized);
    if (selectedId) {
      const nextSelected = normalized.find((project) => project.id === selectedId);
      if (nextSelected) setDraft((current) => current ? { ...current, sortOrder: nextSelected.sortOrder } : current);
    }
    setOrderDirty(true);
  };

  const saveOrder = async () => {
    setSaving(true);
    setError(null);
    try {
      await adminProjectsApi.reorder(projects.map((project) => ({ id: project.id, sortOrder: project.sortOrder })));
      setOrderDirty(false);
      setNotice('Project order saved.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save project order.');
    } finally {
      setSaving(false);
    }
  };

  const updateBlock = (index: number, block: ProjectBlock) => {
    if (!draft) return;
    const blocks = [...draft.blocks];
    blocks[index] = block;
    updateDraft('blocks', blocks);
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    if (!draft) return;
    const target = index + direction;
    if (target < 0 || target >= draft.blocks.length) return;
    const blocks = [...draft.blocks];
    [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
    updateDraft('blocks', blocks.map((block, sortOrder) => ({ ...block, sortOrder })));
  };

  const uploadCover = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const asset = await adminProjectsApi.uploadAsset(file, selectedId ?? undefined);
      updateDraft('coverImageUrl', asset.url);
      setNotice(`Image uploaded to ${asset.provider.toUpperCase()}. Save the project to keep the new URL.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to upload image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <header className="sticky top-0 z-30 border-b border-neutral-300 bg-white/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-[1600px] items-center gap-4">
          <a href="/" className="rounded-md p-2 hover:bg-neutral-100" aria-label="Back to website"><ArrowLeft size={20} /></a>
          <div><p className="text-sm font-bold">Portfolio CMS</p><p className="text-xs text-neutral-500">Cloudflare D1 · private admin</p></div>
          <div className="ml-auto flex gap-2">
            {selectedProject && <button className={`${buttonClass} border-red-300 text-red-700 hover:bg-red-50`} disabled={saving} onClick={() => void remove()}><Trash2 size={16} /> Delete</button>}
            {draft && <>
              <button className={`${buttonClass} bg-white`} disabled={saving} onClick={() => void save('draft')}>{saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Draft</button>
              <button className={`${buttonClass} bg-neutral-900 text-white`} disabled={saving} onClick={() => void save('published')}>Publish</button>
            </>}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1600px] gap-6 p-4 md:p-8 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="self-start rounded-xl border border-neutral-300 bg-white p-4 lg:sticky lg:top-24">
          <button className={`${buttonClass} w-full bg-neutral-900 text-white`} onClick={createNew}><Plus size={17} /> New project</button>
          <div className="mt-5 flex items-center justify-between"><h2 className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Projects</h2>{orderDirty && <button className="text-xs font-bold underline" disabled={saving} onClick={() => void saveOrder()}>Save order</button>}</div>
          {loading ? <div className="flex items-center gap-2 py-10 text-sm text-neutral-500"><Loader2 className="animate-spin" size={18} /> Loading projects…</div> : projects.length === 0 ? <p className="py-10 text-sm text-neutral-500">No projects yet. Create the first draft.</p> : (
            <div className="mt-3 divide-y divide-neutral-200">
              {projects.map((project, index) => <div key={project.id} className={`flex gap-2 py-3 ${selectedId === project.id ? 'bg-neutral-50' : ''}`}>
                <button className="min-w-0 flex-1 px-2 text-left" onClick={() => selectProject(project)}>
                  <span className="block truncate text-sm font-semibold">{project.title}</span>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${project.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{project.status}</span>
                </button>
                <div className="flex flex-col">
                  <button className="p-1 text-neutral-500 disabled:opacity-20" disabled={index === 0} onClick={() => moveProject(index, -1)} aria-label="Move project up"><ArrowUp size={14} /></button>
                  <button className="p-1 text-neutral-500 disabled:opacity-20" disabled={index === projects.length - 1} onClick={() => moveProject(index, 1)} aria-label="Move project down"><ArrowDown size={14} /></button>
                </div>
              </div>)}
            </div>
          )}
        </aside>

        <section className="min-w-0">
          {error && <div className="mb-5 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
          {notice && <div className="mb-5 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</div>}
          {!draft ? (
            <div className="grid min-h-[55vh] place-items-center rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">Select a project or create a new draft.</div>
          ) : (
            <div className="space-y-6">
              <section className="rounded-xl border border-neutral-300 bg-white p-5 shadow-sm md:p-8">
                <div className="mb-6 flex items-center justify-between"><div><h1 className="text-2xl font-semibold">{selectedId ? 'Edit project' : 'New project'}</h1><p className="mt-1 text-sm text-neutral-500">Basic metadata is stored in projects; page content lives in ordered blocks.</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${draft.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{draft.status}</span></div>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Title" value={draft.title} onChange={(title) => { updateDraft('title', title); if (!selectedId && !draft.slug) updateDraft('slug', slugify(title)); }} />
                  <Field label="Slug" value={draft.slug} onChange={(slug) => updateDraft('slug', slugify(slug))} placeholder="project-url-slug" />
                  <div className="md:col-span-2"><TextArea label="Summary" rows={3} value={draft.summary} onChange={(summary) => updateDraft('summary', summary)} /></div>
                  <div className="md:col-span-2">
                    <Field label="Cover image URL" value={draft.coverImageUrl} onChange={(coverImageUrl) => updateDraft('coverImageUrl', coverImageUrl)} placeholder="/works/... or https://..." />
                    <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900">
                      {uploading ? <Loader2 className="animate-spin" size={15} /> : <ImagePlus size={15} />} {uploading ? 'Uploading…' : 'Upload through configured R2 / Images provider'}
                      <input className="sr-only" type="file" accept="image/*" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadCover(file); event.target.value = ''; }} />
                    </label>
                  </div>
                  <Field label="Category" value={draft.category} onChange={(category) => updateDraft('category', category)} />
                  <Field label="Project date" value={draft.projectDate} onChange={(projectDate) => updateDraft('projectDate', projectDate)} placeholder="10.2025~11.2025" />
                  <Field label="Location" value={draft.location} onChange={(location) => updateDraft('location', location)} />
                  <Field label="Author" value={draft.author} onChange={(author) => updateDraft('author', author)} />
                  <div className="md:col-span-2"><Field label="Tools (comma separated)" value={draft.tools.join(', ')} onChange={(tools) => updateDraft('tools', tools.split(',').map((tool) => tool.trim()).filter(Boolean))} /></div>
                </div>
              </section>

              <section>
                <div className="mb-4 flex flex-wrap items-end gap-2">
                  <div><h2 className="text-xl font-semibold">Content blocks</h2><p className="mt-1 text-sm text-neutral-500">Structured blocks keep layouts stable while allowing project-specific storytelling.</p></div>
                  <div className="ml-auto flex gap-2">
                    <select className={`${inputClass} w-auto`} value={newBlockType} onChange={(event) => setNewBlockType(event.target.value as BlockType)}>{BLOCK_TYPES.map((type) => <option key={type}>{type}</option>)}</select>
                    <button className={`${buttonClass} bg-white`} onClick={() => updateDraft('blocks', [...draft.blocks, createEmptyBlock(newBlockType, draft.blocks.length)])}><Plus size={16} /> Add block</button>
                  </div>
                </div>
                {draft.blocks.length === 0 ? <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-500">No blocks yet. Add a hero, text, image, gallery, video, quote, two-column, or process block.</div> : <div className="space-y-4">
                  {draft.blocks.map((block, index) => <BlockCard key={block.id} block={block} index={index} total={draft.blocks.length} onUpdate={(next) => updateBlock(index, next)} onMove={(direction) => moveBlock(index, direction)} onDelete={() => updateDraft('blocks', draft.blocks.filter((_, blockIndex) => blockIndex !== index).map((item, sortOrder) => ({ ...item, sortOrder })))} />)}
                </div>}
              </section>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
