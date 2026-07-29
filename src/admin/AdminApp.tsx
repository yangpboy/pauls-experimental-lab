import { useEffect, useMemo, useState } from 'react';
import {
  AlignLeft,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronRight,
  Columns2,
  ExternalLink,
  Eye,
  FileText,
  GripVertical,
  Image as ImageIcon,
  Images,
  ImagePlus,
  LayoutTemplate,
  Loader2,
  Plus,
  Quote,
  Save,
  Settings2,
  Trash2,
  Upload,
  Video,
  Workflow,
  X,
  type LucideIcon,
} from 'lucide-react';
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

const inputClass = 'w-full rounded-md border border-[#d8d8d8] bg-white px-3 py-2.5 text-sm text-[#191919] outline-none transition placeholder:text-[#9b9b9b] focus:border-[#1769ff] focus:ring-2 focus:ring-[#1769ff]/15';
const labelClass = 'mb-1.5 block text-[11px] font-semibold text-[#5f5f5f]';
const secondaryButtonClass = 'inline-flex items-center justify-center gap-2 rounded-full border border-[#d8d8d8] bg-white px-4 py-2 text-sm font-semibold text-[#191919] transition hover:border-[#9b9b9b] hover:bg-[#f7f7f7] disabled:cursor-not-allowed disabled:opacity-45';
const primaryButtonClass = 'inline-flex items-center justify-center gap-2 rounded-full bg-[#1769ff] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0057e7] disabled:cursor-not-allowed disabled:opacity-45';

const BLOCK_META: Record<BlockType, { label: string; description: string; icon: LucideIcon }> = {
  hero: { label: 'Hero', description: 'Large opening image and title', icon: LayoutTemplate },
  text: { label: 'Text', description: 'Heading and paragraphs', icon: AlignLeft },
  image: { label: 'Image', description: 'Single full-width visual', icon: ImageIcon },
  gallery: { label: 'Photo Grid', description: 'A responsive image gallery', icon: Images },
  video: { label: 'Video', description: 'Video, YouTube, or Vimeo', icon: Video },
  quote: { label: 'Quote', description: 'Highlighted statement', icon: Quote },
  twoColumn: { label: '2 Columns', description: 'Side-by-side story content', icon: Columns2 },
  process: { label: 'Process', description: 'Ordered design steps', icon: Workflow },
};

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
      <textarea className={`${inputClass} resize-y leading-6`} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function MediaField({ label, value, onChange, onUpload, uploading, preview = 'compact' }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => void | Promise<void>;
  uploading: boolean;
  preview?: 'wide' | 'compact' | false;
}) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const displayUrl = localPreview || value;

  const selectFile = (file: File) => {
    if (localPreview) URL.revokeObjectURL(localPreview);
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    onChange(previewUrl);
    void onUpload(file);
  };

  const removeImage = () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(null);
    onChange('');
  };

  return (
    <div className="space-y-3">
      <span className={labelClass}>{label}</span>
      {preview && displayUrl ? <div className={`relative overflow-hidden rounded-md border border-[#e2e2e2] bg-[linear-gradient(45deg,#f1f1f1_25%,transparent_25%),linear-gradient(-45deg,#f1f1f1_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f1f1f1_75%),linear-gradient(-45deg,transparent_75%,#f1f1f1_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] ${preview === 'wide' ? 'min-h-52' : 'aspect-[4/3]'}`}>
        <img src={displayUrl} alt="Selected upload preview" className={`${preview === 'wide' ? 'max-h-[560px] min-h-52' : 'h-full'} w-full object-contain`} />
        {localPreview && <span className="absolute left-3 top-3 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-semibold text-white">Local preview</span>}
        {uploading && <span className="absolute inset-0 grid place-items-center bg-black/25 text-white"><span className="inline-flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-xs font-semibold"><Loader2 className="animate-spin" size={15} /> Uploading to R2…</span></span>}
      </div> : preview ? <label className={`${preview === 'wide' ? 'min-h-52' : 'min-h-32'} flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-[#cfcfcf] bg-[#fafafa] px-5 text-center transition hover:border-[#1769ff] hover:bg-[#f4f8ff]`}>
        <ImagePlus className="mb-3 text-[#1769ff]" size={26} />
        <span className="text-sm font-semibold">Choose an image</span>
        <span className="mt-1 text-xs text-[#737373]">Preview it here before the project is saved.</span>
        <input className="sr-only" type="file" accept="image/*" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) selectFile(file); event.target.value = ''; }} />
      </label> : null}
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#d8d8d8] bg-white px-3 py-2 text-xs font-semibold transition hover:border-[#1769ff] hover:text-[#1769ff]">
          {uploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
          {uploading ? 'Uploading…' : displayUrl ? 'Replace image' : 'Upload to R2'}
          <input
            className="sr-only"
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) selectFile(file);
              event.target.value = '';
            }}
          />
        </label>
        {displayUrl && <button type="button" className="text-xs font-medium text-[#737373] hover:text-red-600" onClick={removeImage}>Remove</button>}
      </div>
      <details className="text-xs text-[#737373]">
        <summary className="cursor-pointer font-medium hover:text-[#1769ff]">Use an image URL instead</summary>
        <div className="mt-2"><Field label="Image URL" value={value} onChange={(nextValue) => { setLocalPreview(null); onChange(nextValue); }} placeholder="https://media.paul-lab.com/…" /></div>
      </details>
    </div>
  );
}

type UploadMedia = (file: File, target: string) => Promise<string | null>;

function BlockFields({ block, onChange, uploadMedia, uploadingTarget }: {
  block: ProjectBlock;
  onChange: (content: ProjectBlockContent) => void;
  uploadMedia: UploadMedia;
  uploadingTarget: string | null;
}) {
  const update = (patch: Partial<ProjectBlockContent>) => onChange({ ...block.content, ...patch });
  const uploadTo = async (file: File, key: string, apply: (url: string) => void) => {
    const url = await uploadMedia(file, `${block.id}:${key}`);
    if (url) apply(url);
  };

  if (block.type === 'hero') {
    return <div className="grid gap-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <MediaField label="Hero image" value={valueText(block.content.imageUrl)} onChange={(imageUrl) => update({ imageUrl })} onUpload={(file) => uploadTo(file, 'hero', (imageUrl) => update({ imageUrl }))} uploading={uploadingTarget === `${block.id}:hero`} preview="wide" />
      </div>
      <Field label="Eyebrow" value={valueText(block.content.eyebrow)} onChange={(eyebrow) => update({ eyebrow })} placeholder="Industrial Design / 2026" />
      <Field label="Heading" value={valueText(block.content.heading)} onChange={(heading) => update({ heading })} />
      <div className="md:col-span-2"><Field label="Subheading" value={valueText(block.content.subheading)} onChange={(subheading) => update({ subheading })} /></div>
    </div>;
  }

  if (block.type === 'text') {
    return <div className="space-y-5">
      <Field label="Heading (optional)" value={valueText(block.content.heading)} onChange={(heading) => update({ heading })} />
      <TextArea label="Body" rows={8} value={valueText(block.content.body)} onChange={(body) => update({ body })} placeholder="Separate paragraphs with a blank line." />
    </div>;
  }

  if (block.type === 'image') {
    return <div className="space-y-5">
      <MediaField label="Image" value={valueText(block.content.url)} onChange={(url) => update({ url })} onUpload={(file) => uploadTo(file, 'image', (url) => update({ url }))} uploading={uploadingTarget === `${block.id}:image`} preview="wide" />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Alt text" value={valueText(block.content.alt)} onChange={(alt) => update({ alt })} />
        <Field label="Caption" value={valueText(block.content.caption)} onChange={(caption) => update({ caption })} />
      </div>
    </div>;
  }

  if (block.type === 'gallery') {
    const images = Array.isArray(block.content.images) ? block.content.images as GalleryImage[] : [];
    const galleryUploading = uploadingTarget === `${block.id}:gallery`;
    const changeImage = (index: number, patch: Partial<GalleryImage>) => update({ images: images.map((image, imageIndex) => imageIndex === index ? { ...image, ...patch } : image) });
    const uploadFiles = async (files: FileList) => {
      const pendingPreviews = Array.from(files).map((file) => ({ url: URL.createObjectURL(file), alt: file.name.replace(/\.[^.]+$/, '') }));
      update({ images: [...images, ...pendingPreviews] });
      const uploaded: GalleryImage[] = [];
      for (let index = 0; index < files.length; index += 1) {
        const file = files.item(index);
        if (!file) continue;
        const url = await uploadMedia(file, `${block.id}:gallery`);
        if (url) uploaded.push({ url, alt: file.name.replace(/\.[^.]+$/, '') });
      }
      if (uploaded.length) update({ images: [...images, ...uploaded] });
      else update({ images });
      pendingPreviews.forEach((image) => URL.revokeObjectURL(image.url));
    };
    return <div className="space-y-5">
      <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#cfcfcf] bg-[#fafafa] px-5 text-center transition hover:border-[#1769ff] hover:bg-[#f4f8ff]">
        {galleryUploading ? <Loader2 className="mb-2 animate-spin text-[#1769ff]" size={22} /> : <ImagePlus className="mb-2 text-[#1769ff]" size={24} />}
        <span className="text-sm font-semibold">Upload images to this photo grid</span>
        <span className="mt-1 text-xs text-[#737373]">Choose multiple files; they will be stored in R2.</span>
        <input className="sr-only" type="file" accept="image/*" multiple disabled={galleryUploading} onChange={(event) => { if (event.target.files?.length) void uploadFiles(event.target.files); event.target.value = ''; }} />
      </label>
      {images.length > 0 && <div className="grid gap-3 sm:grid-cols-2">
        {images.map((image, index) => {
          const pending = image.url.startsWith('blob:');
          return <div key={`${image.url}-${index}`} className="rounded-lg border border-[#e4e4e4] bg-[#fafafa] p-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#ededed]">
            <img src={image.url} alt="" className="h-full w-full object-cover" />
            {pending ? <span className="absolute inset-0 grid place-items-center bg-black/25 text-white"><span className="inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-[10px] font-semibold"><Loader2 className="animate-spin" size={13} /> Uploading…</span></span> : <button type="button" className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-red-600" onClick={() => update({ images: images.filter((_, imageIndex) => imageIndex !== index) })} aria-label="Remove gallery image"><X size={14} /></button>}
          </div>
          {!pending && <div className="mt-3 space-y-2">
            <input className={inputClass} value={image.alt ?? ''} onChange={(event) => changeImage(index, { alt: event.target.value })} placeholder="Alt text" />
            <input className={inputClass} value={image.caption ?? ''} onChange={(event) => changeImage(index, { caption: event.target.value })} placeholder="Caption" />
          </div>}
        </div>;
        })}
      </div>}
      <div className="flex flex-wrap items-end gap-5">
        <label>
          <span className={labelClass}>Columns</span>
          <select className={`${inputClass} w-28`} value={String(block.content.columns ?? 1)} onChange={(event) => update({ columns: Number(event.target.value) })}>
            <option value="1">1 column</option><option value="2">2 columns</option><option value="3">3 columns</option>
          </select>
        </label>
        <label className="flex items-center gap-2 pb-2.5 text-sm"><input type="checkbox" checked={block.content.gap !== 'none'} onChange={(event) => update({ gap: event.target.checked ? 'normal' : 'none' })} /> Add spacing</label>
        <label className="flex items-center gap-2 pb-2.5 text-sm"><input type="checkbox" checked={block.content.square === true} onChange={(event) => update({ square: event.target.checked })} /> Square crop</label>
      </div>
    </div>;
  }

  if (block.type === 'video') {
    return <div className="grid gap-5 md:grid-cols-2">
      <div className="md:col-span-2"><Field label="Video / YouTube / Vimeo URL" value={valueText(block.content.url)} onChange={(url) => update({ url })} /></div>
      <MediaField label="Poster image" value={valueText(block.content.posterUrl)} onChange={(posterUrl) => update({ posterUrl })} onUpload={(file) => uploadTo(file, 'poster', (posterUrl) => update({ posterUrl }))} uploading={uploadingTarget === `${block.id}:poster`} preview="wide" />
      <Field label="Caption" value={valueText(block.content.caption)} onChange={(caption) => update({ caption })} />
    </div>;
  }

  if (block.type === 'quote') {
    return <div className="space-y-5">
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
    return <div className="grid gap-5 md:grid-cols-2">
      {([['left', left], ['right', right]] as const).map(([side, column]) => <div key={side} className="space-y-4 rounded-lg border border-[#e4e4e4] bg-[#fafafa] p-4">
        <p className="text-xs font-semibold capitalize text-[#737373]">{side} column</p>
        <MediaField label="Image" value={valueText(column.imageUrl)} onChange={(imageUrl) => updateColumn(side, { imageUrl })} onUpload={(file) => uploadTo(file, side, (imageUrl) => updateColumn(side, { imageUrl }))} uploading={uploadingTarget === `${block.id}:${side}`} />
        <Field label="Heading" value={valueText(column.heading)} onChange={(heading) => updateColumn(side, { heading })} />
        <TextArea label="Body" value={valueText(column.body)} onChange={(body) => updateColumn(side, { body })} />
      </div>)}
    </div>;
  }

  const steps = Array.isArray(block.content.steps) ? block.content.steps as ProcessStep[] : [];
  return <div className="space-y-5">
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

function PreviewEmpty({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return <div className="grid min-h-52 place-items-center bg-[#f7f7f7] px-6 text-center text-[#929292]"><div><Icon className="mx-auto" size={28} /><p className="mt-3 text-sm font-medium">{label}</p></div></div>;
}

function BlockPreview({ block, projectTitle, coverImageUrl }: { block: ProjectBlock; projectTitle: string; coverImageUrl: string }) {
  const content = block.content;

  if (block.type === 'hero') {
    const imageUrl = valueText(content.imageUrl) || coverImageUrl;
    return <section className="relative flex min-h-[360px] items-end overflow-hidden bg-[#151515] text-white">
      {imageUrl ? <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 grid place-items-center text-white/35"><ImageIcon size={38} /></div>}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
      <div className="relative w-full p-8 md:p-12">
        {valueText(content.eyebrow) && <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">{valueText(content.eyebrow)}</p>}
        <h2 className="max-w-3xl text-4xl font-semibold leading-[0.95] md:text-6xl">{valueText(content.heading) || projectTitle || 'Project title'}</h2>
        {valueText(content.subheading) && <p className="mt-5 max-w-xl text-base text-white/75 md:text-xl">{valueText(content.subheading)}</p>}
      </div>
    </section>;
  }

  if (block.type === 'text') {
    const body = valueText(content.body);
    return <section className="bg-white px-7 py-12 md:px-14 md:py-16">
      <div className="mx-auto max-w-3xl">
        {valueText(content.heading) && <h2 className="mb-6 text-3xl font-semibold md:text-4xl">{valueText(content.heading)}</h2>}
        {body ? <div className="space-y-4 text-base font-light leading-8 text-[#555]">{body.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => <p key={`${paragraph.slice(0, 20)}-${index}`} className="whitespace-pre-line">{paragraph}</p>)}</div> : <p className="text-sm text-[#aaa]">Add text in the editor panel.</p>}
      </div>
    </section>;
  }

  if (block.type === 'image') {
    const url = valueText(content.url) || valueText(content.imageUrl);
    if (!url) return <PreviewEmpty icon={ImageIcon} label="Upload an image from the editor panel" />;
    return <figure className="bg-white"><img src={url} alt={valueText(content.alt) || ''} className="block h-auto max-h-[720px] w-full object-contain" />{valueText(content.caption) && <figcaption className="px-6 py-4 text-sm text-[#737373]">{valueText(content.caption)}</figcaption>}</figure>;
  }

  if (block.type === 'gallery') {
    const images = Array.isArray(content.images) ? content.images as GalleryImage[] : [];
    if (!images.length) return <PreviewEmpty icon={Images} label="Upload photos from the editor panel" />;
    const columns = content.columns === 3 ? 'md:grid-cols-3' : content.columns === 2 ? 'md:grid-cols-2' : 'grid-cols-1';
    const gap = content.gap === 'none' ? 'gap-0' : 'gap-3 p-3';
    return <section className={`grid grid-cols-1 bg-white ${columns} ${gap}`}>{images.map((image, index) => <figure key={`${image.url}-${index}`} className="min-w-0"><img src={image.url} alt={image.alt || ''} className={`block w-full object-cover ${content.square ? 'aspect-square' : 'h-auto'}`} />{image.caption && <figcaption className="px-3 py-2 text-xs text-[#737373]">{image.caption}</figcaption>}</figure>)}</section>;
  }

  if (block.type === 'video') {
    const poster = valueText(content.posterUrl);
    return <figure className="relative grid aspect-video place-items-center overflow-hidden bg-[#111] text-white">{poster && <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />}<div className="relative text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/90 text-[#111]"><Video size={22} /></span><p className="mt-3 text-xs font-semibold">{valueText(content.url) ? 'Video preview' : 'Add a video URL'}</p></div></figure>;
  }

  if (block.type === 'quote') {
    return <figure className="bg-light-coral px-8 py-16 text-white md:px-14 md:py-20"><blockquote className="text-3xl font-medium leading-tight md:text-5xl">“{valueText(content.quote) || 'Add a statement in the editor panel.'}”</blockquote>{valueText(content.attribution) && <figcaption className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-white/75">— {valueText(content.attribution)}</figcaption>}</figure>;
  }

  if (block.type === 'twoColumn') {
    const left = valueObject(content.left);
    const right = valueObject(content.right);
    return <section className="grid gap-8 bg-white px-7 py-12 md:grid-cols-2 md:px-12">{[left, right].map((column, index) => <article key={index} className="space-y-4">{valueText(column.imageUrl) ? <img src={valueText(column.imageUrl)} alt="" className="aspect-[4/3] w-full object-cover" /> : <div className="grid aspect-[4/3] place-items-center bg-[#f2f2f2] text-[#aaa]"><ImageIcon size={24} /></div>}{valueText(column.heading) && <h3 className="text-2xl font-semibold">{valueText(column.heading)}</h3>}{valueText(column.body) && <p className="whitespace-pre-line text-sm leading-7 text-[#5f5f5f]">{valueText(column.body)}</p>}</article>)}</section>;
  }

  const steps = Array.isArray(content.steps) ? content.steps as ProcessStep[] : [];
  return <section className="bg-[#f3f3f3] px-7 py-12 md:px-12"><h2 className="mb-8 text-3xl font-semibold">{valueText(content.heading) || 'Process'}</h2>{steps.length ? <div className="grid gap-px bg-[#d5d5d5] md:grid-cols-2">{steps.map((step, index) => <article key={`${step.title}-${index}`} className="bg-[#f3f3f3] p-6"><p className="text-xs font-bold text-light-coral">{String(index + 1).padStart(2, '0')}</p>{step.imageUrl && <img src={step.imageUrl} alt="" className="mt-4 aspect-[4/3] w-full object-cover" />}<h3 className="mt-4 text-xl font-semibold">{step.title}</h3>{step.description && <p className="mt-2 text-sm leading-6 text-[#666]">{step.description}</p>}</article>)}</div> : <p className="text-sm text-[#999]">Add process steps in the editor panel.</p>}</section>;
}

function BlockPreviewCard({ block, index, selected, dragging, dragOver, projectTitle, coverImageUrl, onSelect, onDragStart, onDragOver, onDrop, onDragEnd }: {
  block: ProjectBlock;
  index: number;
  selected: boolean;
  dragging: boolean;
  dragOver: boolean;
  projectTitle: string;
  coverImageUrl: string;
  onSelect: () => void;
  onDragStart: () => void;
  onDragOver: () => void;
  onDrop: () => void;
  onDragEnd: () => void;
}) {
  const meta = BLOCK_META[block.type];
  const Icon = meta.icon;

  return (
    <article
      draggable
      onClick={onSelect}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', block.id);
        onDragStart();
      }}
      onDragOver={(event) => { event.preventDefault(); onDragOver(); }}
      onDrop={(event) => { event.preventDefault(); onDrop(); }}
      onDragEnd={onDragEnd}
      className={`group relative overflow-hidden rounded-md border bg-white transition ${dragging ? 'scale-[0.985] opacity-40' : ''} ${dragOver ? 'border-[#1769ff] shadow-[0_-4px_0_#1769ff]' : selected ? 'border-[#1769ff] shadow-[0_0_0_2px_rgba(23,105,255,0.12)]' : 'border-[#dedede] hover:border-[#a9a9a9]'}`}
    >
      <header className="flex cursor-grab items-center gap-2 border-b border-[#e8e8e8] bg-white px-4 py-3 active:cursor-grabbing">
        <GripVertical size={18} className="text-[#898989]" />
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#edf3ff] text-[#1769ff]"><Icon size={14} /></span>
        <span className="text-sm font-semibold">{meta.label}</span>
        <span className="text-xs text-[#8a8a8a]">Block {index + 1}</span>
        <span className="ml-auto rounded-full bg-[#f3f3f3] px-2.5 py-1 text-[10px] font-semibold text-[#686868]">Drag to reorder</span>
      </header>
      <BlockPreview block={block} projectTitle={projectTitle} coverImageUrl={coverImageUrl} />
    </article>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${status === 'published' ? 'bg-[#e3f7eb] text-[#167344]' : 'bg-[#fff2d8] text-[#8a5a00]'}`}><span className={`h-1.5 w-1.5 rounded-full ${status === 'published' ? 'bg-[#20a464]' : 'bg-[#e3a008]'}`} />{status}</span>;
}

export default function AdminApp() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProjectInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [orderDirty, setOrderDirty] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [inspectorTab, setInspectorTab] = useState<'content' | 'block' | 'details'>('content');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);

  const selectedProject = useMemo(() => projects.find((project) => project.id === selectedId) ?? null, [projects, selectedId]);
  const selectedBlockIndex = useMemo(() => draft?.blocks.findIndex((block) => block.id === selectedBlockId) ?? -1, [draft, selectedBlockId]);
  const selectedBlock = selectedBlockIndex >= 0 && draft ? draft.blocks[selectedBlockIndex] : null;
  const hasLocalMedia = useMemo(() => Boolean(draft && JSON.stringify(draft).includes('blob:')), [draft]);
  const publishChecks = useMemo(() => draft ? [
    { label: 'Project title', ready: Boolean(draft.title.trim()) },
    { label: 'Project URL', ready: Boolean(draft.slug.trim()) },
    { label: 'Cover image', ready: Boolean(draft.coverImageUrl.trim()) },
    { label: 'Content block', ready: draft.blocks.length > 0 },
  ] : [], [draft]);

  useEffect(() => {
    let cancelled = false;
    adminProjectsApi.list()
      .then((items) => {
        if (!cancelled) setProjects(items);
      })
      .catch((requestError: unknown) => {
        if (cancelled) return;
        const message = requestError instanceof CmsApiError && requestError.status === 401
          ? 'Admin access is not authenticated. Sign in through Cloudflare Access with the approved account.'
          : requestError instanceof Error ? requestError.message : 'Unable to load projects.';
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const warnBeforeLeave = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnBeforeLeave);
    return () => window.removeEventListener('beforeunload', warnBeforeLeave);
  }, [isDirty]);

  const selectProject = (project: Project) => {
    if (isDirty && !window.confirm('Discard your unsaved changes and open another project?')) return;
    setSelectedId(project.id);
    setDraft(projectToInput(project));
    setIsDirty(false);
    setSelectedBlockId(null);
    setError(null);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createNew = () => {
    if (isDirty && !window.confirm('Discard your unsaved changes and create a new project?')) return;
    setSelectedId(null);
    setDraft(emptyProject(projects.length));
    setIsDirty(true);
    setSelectedBlockId(null);
    setInspectorTab('content');
    setError(null);
    setNotice(null);
  };

  const updateDraft = <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) => {
    setDraft((current) => current ? { ...current, [key]: value } : current);
    setIsDirty(true);
    setNotice(null);
  };

  const save = async (status: ProjectStatus) => {
    if (!draft) return;
    if (hasLocalMedia) {
      setError('Wait for every image to finish uploading to R2, or remove the local preview before saving.');
      return;
    }
    if (!draft.title.trim() || !draft.slug.trim()) {
      setInspectorTab('details');
      setError('Add a project title and URL slug before saving.');
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
      setIsDirty(false);
      setNotice(status === 'published' ? 'Published — the public portfolio is now up to date.' : 'Draft saved.');
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
      setIsDirty(false);
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
      setNotice('Portfolio order saved.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save project order.');
    } finally {
      setSaving(false);
    }
  };

  const addBlock = (type: BlockType) => {
    if (!draft) return;
    const block = createEmptyBlock(type, draft.blocks.length);
    updateDraft('blocks', [...draft.blocks, block]);
    setSelectedBlockId(block.id);
    setInspectorTab('block');
    setMobileInspectorOpen(true);
    window.setTimeout(() => document.getElementById(`block-${block.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
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

  const removeBlock = (index: number) => {
    if (!draft) return;
    const removed = draft.blocks[index];
    updateDraft('blocks', draft.blocks.filter((_, blockIndex) => blockIndex !== index).map((block, sortOrder) => ({ ...block, sortOrder })));
    if (removed?.id === selectedBlockId) {
      setSelectedBlockId(null);
      setInspectorTab('content');
    }
  };

  const reorderBlockById = (sourceId: string, targetId: string) => {
    if (!draft || sourceId === targetId) return;
    const sourceIndex = draft.blocks.findIndex((block) => block.id === sourceId);
    const targetIndex = draft.blocks.findIndex((block) => block.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const blocks = [...draft.blocks];
    const [moved] = blocks.splice(sourceIndex, 1);
    blocks.splice(targetIndex, 0, moved);
    updateDraft('blocks', blocks.map((block, sortOrder) => ({ ...block, sortOrder })));
  };

  const uploadMedia: UploadMedia = async (file, target) => {
    setUploadingTarget(target);
    setError(null);
    try {
      const asset = await adminProjectsApi.uploadAsset(file, selectedId ?? undefined);
      setNotice(`${file.name} uploaded to ${asset.provider.toUpperCase()}. Save the project to keep this change.`);
      setIsDirty(true);
      return asset.url;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to upload this image.');
      return null;
    } finally {
      setUploadingTarget(null);
    }
  };

  const uploadCover = async (file: File) => {
    const url = await uploadMedia(file, 'cover');
    if (url) updateDraft('coverImageUrl', url);
  };

  const openAddPanel = () => {
    setInspectorTab('content');
    setMobileInspectorOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#191919]">
      <header className="sticky top-0 z-40 border-b border-[#dedede] bg-white">
        <div className="flex min-h-16 items-center gap-3 px-3 md:px-5">
          <a href="/" className="grid h-10 w-10 place-items-center rounded-full hover:bg-[#f2f2f2]" aria-label="Back to portfolio"><ArrowLeft size={20} /></a>
          <div className="hidden h-8 w-px bg-[#e2e2e2] sm:block" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{draft?.title || 'Portfolio editor'}</p>
            <p className="flex items-center gap-1.5 text-[11px] text-[#737373]">{isDirty ? <><span className="h-1.5 w-1.5 rounded-full bg-[#e3a008]" />Unsaved changes</> : <><Check size={12} />All changes saved</>}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {draft && <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-[#d8d8d8] bg-white lg:hidden" onClick={() => { setInspectorTab('details'); setMobileInspectorOpen(true); }} aria-label="Open project settings"><Settings2 size={16} /></button>}
            {selectedProject?.status === 'published' && <a href={`/projects/${encodeURIComponent(selectedProject.slug)}`} target="_blank" rel="noreferrer" className={`${secondaryButtonClass} hidden sm:inline-flex`}><Eye size={15} /> Preview</a>}
            {draft && <>
              <button type="button" className={`${secondaryButtonClass} px-3 sm:px-4`} disabled={saving || Boolean(uploadingTarget) || hasLocalMedia} onClick={() => void save('draft')}>{saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}<span className="hidden sm:inline">Save draft</span></button>
              <button type="button" className={primaryButtonClass} disabled={saving || Boolean(uploadingTarget) || hasLocalMedia} onClick={() => void save('published')}>Publish</button>
            </>}
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-[minmax(0,1fr)_400px] 2xl:grid-cols-[260px_minmax(0,1fr)_400px]">
        <aside className="hidden border-b border-[#dedede] bg-white 2xl:sticky 2xl:top-16 2xl:block 2xl:h-[calc(100vh-65px)] 2xl:overflow-y-auto 2xl:border-b-0 2xl:border-r">
          <div className="p-4">
            <button type="button" className={`${primaryButtonClass} w-full`} onClick={createNew}><Plus size={17} /> Create a project</button>
            <div className="mt-6 flex items-center justify-between">
              <div><p className="text-sm font-semibold">Your projects</p><p className="mt-0.5 text-xs text-[#737373]">{projects.length} total</p></div>
              {orderDirty && <button type="button" className="text-xs font-semibold text-[#1769ff] hover:underline" disabled={saving} onClick={() => void saveOrder()}>Save order</button>}
            </div>
          </div>
          {loading ? <div className="flex items-center gap-2 px-5 py-10 text-sm text-[#737373]"><Loader2 className="animate-spin" size={18} /> Loading projects…</div> : projects.length === 0 ? <p className="px-5 py-10 text-sm text-[#737373]">No projects yet. Create your first draft.</p> : (
            <div className="border-t border-[#ededed]">
              {projects.map((project, index) => <div key={project.id} className={`group flex items-center gap-3 border-b border-[#ededed] p-3 transition ${selectedId === project.id ? 'bg-[#edf3ff]' : 'hover:bg-[#fafafa]'}`}>
                <button type="button" className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => selectProject(project)}>
                  <div className="h-14 w-[72px] shrink-0 overflow-hidden rounded bg-[#e8e8e8]">
                    {project.coverImageUrl ? <img src={project.coverImageUrl} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-[#aaa]"><ImageIcon size={18} /></div>}
                  </div>
                  <div className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{project.title}</span>
                    <span className="mt-1 block truncate text-[11px] text-[#737373]">{project.category || 'Uncategorized'}</span>
                    <span className="mt-1.5 block"><StatusBadge status={project.status} /></span>
                  </div>
                </button>
                <div className="flex flex-col opacity-100 2xl:opacity-0 2xl:transition 2xl:group-hover:opacity-100">
                  <button type="button" className="rounded p-1 text-[#737373] hover:bg-white disabled:opacity-20" disabled={index === 0} onClick={() => moveProject(index, -1)} aria-label="Move project up"><ArrowUp size={13} /></button>
                  <button type="button" className="rounded p-1 text-[#737373] hover:bg-white disabled:opacity-20" disabled={index === projects.length - 1} onClick={() => moveProject(index, 1)} aria-label="Move project down"><ArrowDown size={13} /></button>
                </div>
              </div>)}
            </div>
          )}
        </aside>

        <main className="min-w-0 px-4 py-8 md:px-8 xl:px-10">
          <div className="mx-auto max-w-[1040px]">
            {!draft && <div className="mb-5 flex items-center gap-2 rounded-lg border border-[#dedede] bg-white p-2 2xl:hidden">
              <select
                className={`${inputClass} min-w-0 flex-1 border-0 bg-[#f7f7f7]`}
                value={selectedId ?? ''}
                onChange={(event) => {
                  const project = projects.find((item) => item.id === event.target.value);
                  if (project) selectProject(project);
                }}
                aria-label="Choose a project"
              >
                <option value="">Choose a project</option>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.title} · {project.status}</option>)}
              </select>
              <button type="button" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1769ff] text-white" onClick={createNew} aria-label="Create a project"><Plus size={18} /></button>
            </div>}
            {error && <div role="alert" className="mb-5 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800"><span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />{error}</div>}
            {notice && <div role="status" className="mb-5 flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><Check className="mt-0.5 shrink-0" size={15} />{notice}</div>}
            {!draft ? (
              <section className="grid min-h-[65vh] place-items-center rounded-lg border border-[#dedede] bg-white p-8 text-center shadow-sm">
                <div className="max-w-md">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#edf3ff] text-[#1769ff]"><FileText size={28} /></div>
                  <h1 className="mt-6 text-2xl font-semibold tracking-tight">Build your next case study</h1>
                  <p className="mt-3 text-sm leading-6 text-[#737373]">Choose an existing project from the library or start with a clean, block-based canvas.</p>
                  <button type="button" className={`${primaryButtonClass} mt-6`} onClick={createNew}><Plus size={17} /> Create a project</button>
                </div>
              </section>
            ) : (
              <>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#737373]">Live project preview</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">{draft.title || 'Untitled project'}</h1>
                  </div>
                  <div className="text-right"><StatusBadge status={draft.status} /><p className="mt-2 hidden text-[11px] text-[#858585] sm:block">Drag blocks to change their order</p></div>
                </div>

                {draft.blocks.length === 0 ? <section className="rounded-lg border border-[#dedede] bg-white px-6 py-16 text-center shadow-sm">
                  <div className="mx-auto max-w-xl">
                    <h2 className="text-xl font-semibold">Start building your project</h2>
                    <p className="mt-2 text-sm text-[#737373]">Add images, text, photo grids, video, and structured storytelling blocks.</p>
                    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {BLOCK_TYPES.slice(0, 4).map((type) => {
                        const meta = BLOCK_META[type];
                        const Icon = meta.icon;
                        return <button type="button" key={type} className="group flex flex-col items-center gap-3 rounded-lg p-3 hover:bg-[#f5f8ff]" onClick={() => addBlock(type)}>
                          <span className="grid h-14 w-14 place-items-center rounded-full border border-[#dedede] bg-white text-[#383838] transition group-hover:border-[#1769ff] group-hover:bg-[#1769ff] group-hover:text-white"><Icon size={22} /></span>
                          <span className="text-xs font-semibold">{meta.label}</span>
                        </button>;
                      })}
                    </div>
                  </div>
                </section> : <div className="space-y-5">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#cfcfcf] bg-white px-4 py-3 text-sm font-semibold text-[#4f4f4f] transition hover:border-[#1769ff] hover:bg-[#f5f8ff] hover:text-[#1769ff]"
                    onClick={openAddPanel}
                  >
                    <Plus size={17} /> Add block
                  </button>
                  {draft.blocks.map((block, index) => <div id={`block-${block.id}`} key={block.id}>
                    <BlockPreviewCard
                      block={block}
                      index={index}
                      selected={selectedBlockId === block.id}
                      dragging={draggedBlockId === block.id}
                      dragOver={dragOverBlockId === block.id && draggedBlockId !== block.id}
                      projectTitle={draft.title}
                      coverImageUrl={draft.coverImageUrl}
                      onSelect={() => { setSelectedBlockId(block.id); setInspectorTab('block'); setMobileInspectorOpen(true); }}
                      onDragStart={() => { setDraggedBlockId(block.id); setSelectedBlockId(block.id); }}
                      onDragOver={() => setDragOverBlockId(block.id)}
                      onDrop={() => { if (draggedBlockId) reorderBlockById(draggedBlockId, block.id); setDraggedBlockId(null); setDragOverBlockId(null); }}
                      onDragEnd={() => { setDraggedBlockId(null); setDragOverBlockId(null); }}
                    />
                  </div>)}
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#cfcfcf] bg-white px-4 py-3 text-sm font-semibold text-[#4f4f4f] transition hover:border-[#1769ff] hover:bg-[#f5f8ff] hover:text-[#1769ff]"
                    onClick={openAddPanel}
                  >
                    <Plus size={17} /> Add block
                  </button>
                </div>}
              </>
            )}
          </div>
        </main>

        {mobileInspectorOpen && <button type="button" className="fixed inset-0 top-16 z-40 bg-black/30 lg:hidden" onClick={() => setMobileInspectorOpen(false)} aria-label="Close editor panel" />}
        <aside className={`fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto border-t border-[#dedede] bg-white transition-transform duration-200 lg:sticky lg:top-16 lg:h-[calc(100vh-65px)] lg:translate-y-0 lg:border-l lg:border-t-0 ${mobileInspectorOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="sticky top-0 z-10 flex border-b border-[#dedede] bg-white">
            <button type="button" className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-4 text-xs font-semibold ${inspectorTab === 'content' ? 'border-[#1769ff] text-[#1769ff]' : 'border-transparent text-[#737373] hover:text-[#191919]'}`} onClick={() => setInspectorTab('content')}><Plus size={15} /> Add</button>
            <button type="button" className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-4 text-xs font-semibold ${inspectorTab === 'block' ? 'border-[#1769ff] text-[#1769ff]' : 'border-transparent text-[#737373] hover:text-[#191919]'}`} onClick={() => setInspectorTab('block')}><FileText size={14} /> Block</button>
            <button type="button" className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-4 text-xs font-semibold ${inspectorTab === 'details' ? 'border-[#1769ff] text-[#1769ff]' : 'border-transparent text-[#737373] hover:text-[#191919]'}`} onClick={() => setInspectorTab('details')}><Settings2 size={14} /> Settings</button>
            <button type="button" className="grid w-14 place-items-center border-l border-[#e5e5e5] text-[#686868] lg:hidden" onClick={() => setMobileInspectorOpen(false)} aria-label="Close editor panel"><X size={18} /></button>
          </div>

          {!draft ? <div className="p-6 text-sm leading-6 text-[#737373]">Open a project to add content and edit its settings.</div> : inspectorTab === 'content' ? <div className="p-5">
            <h2 className="text-sm font-semibold">Add content</h2>
            <p className="mt-1 text-xs leading-5 text-[#737373]">Choose a module to add it to the bottom of your project.</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {BLOCK_TYPES.map((type) => {
                const meta = BLOCK_META[type];
                const Icon = meta.icon;
                return <button type="button" key={type} className="group rounded-lg border border-[#e2e2e2] p-3 text-left transition hover:border-[#1769ff] hover:bg-[#f5f8ff]" onClick={() => addBlock(type)}>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f0f0f0] text-[#4e4e4e] transition group-hover:bg-[#1769ff] group-hover:text-white"><Icon size={17} /></span>
                  <span className="mt-3 block text-xs font-semibold">{meta.label}</span>
                  <span className="mt-1 block text-[10px] leading-4 text-[#858585]">{meta.description}</span>
                </button>;
              })}
            </div>
            <div className="mt-6 rounded-lg bg-[#f5f5f5] p-4">
              <p className="text-xs font-semibold">Project structure</p>
              <p className="mt-1 text-[11px] leading-5 text-[#737373]">{draft.blocks.length} content block{draft.blocks.length === 1 ? '' : 's'}. Drag preview blocks on the left to change their order.</p>
            </div>
          </div> : inspectorTab === 'block' ? <div className="p-5">
            {selectedBlock ? <>
              <div className="flex items-start gap-3">
                {(() => { const Icon = BLOCK_META[selectedBlock.type].icon; return <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#edf3ff] text-[#1769ff]"><Icon size={18} /></span>; })()}
                <div className="min-w-0"><h2 className="text-sm font-semibold">Edit {BLOCK_META[selectedBlock.type].label}</h2><p className="mt-1 text-xs leading-5 text-[#737373]">Changes appear immediately in the formal preview on the left.</p></div>
              </div>

              <div className="mt-5 rounded-lg border border-[#e2e2e2] bg-[#fafafa] p-3">
                <label>
                  <span className={labelClass}>Block type</span>
                  <select
                    className={inputClass}
                    value={selectedBlock.type}
                    onChange={(event) => {
                      if (selectedBlockIndex < 0) return;
                      const replacement = createEmptyBlock(event.target.value as BlockType, selectedBlockIndex);
                      updateBlock(selectedBlockIndex, { ...replacement, id: selectedBlock.id });
                    }}
                  >
                    {BLOCK_TYPES.map((type) => <option key={type} value={type}>{BLOCK_META[type].label}</option>)}
                  </select>
                </label>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <button type="button" className={secondaryButtonClass} disabled={selectedBlockIndex === 0} onClick={() => moveBlock(selectedBlockIndex, -1)} aria-label="Move selected block up"><ArrowUp size={15} /></button>
                  <button type="button" className={secondaryButtonClass} disabled={selectedBlockIndex === draft.blocks.length - 1} onClick={() => moveBlock(selectedBlockIndex, 1)} aria-label="Move selected block down"><ArrowDown size={15} /></button>
                  <button type="button" className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white text-red-600 transition hover:bg-red-50" onClick={() => removeBlock(selectedBlockIndex)} aria-label="Delete selected block"><Trash2 size={15} /></button>
                </div>
              </div>

              <div className="mt-6">
                <BlockFields
                  block={selectedBlock}
                  onChange={(content) => updateBlock(selectedBlockIndex, { ...selectedBlock, content })}
                  uploadMedia={uploadMedia}
                  uploadingTarget={uploadingTarget}
                />
              </div>
              {hasLocalMedia && <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">A local image preview is visible. Save and Publish stay disabled until R2 returns a permanent URL.</div>}
            </> : <div className="grid min-h-56 place-items-center rounded-lg border border-dashed border-[#d5d5d5] bg-[#fafafa] p-6 text-center"><div><FileText className="mx-auto text-[#aaa]" size={24} /><p className="mt-3 text-sm font-semibold">Select a preview block</p><p className="mt-1 text-xs leading-5 text-[#858585]">Click a block on the left to edit its content here.</p></div></div>}
          </div> : <div className="space-y-6 p-5">
            <section>
              <h2 className="text-sm font-semibold">Project details</h2>
              <p className="mt-1 text-xs leading-5 text-[#737373]">These fields control the cover card, URL, and public project metadata.</p>
              <div className="mt-5 space-y-4">
                <Field label="Project title *" value={draft.title} onChange={(title) => { updateDraft('title', title); if (!selectedId && !draft.slug) updateDraft('slug', slugify(title)); }} placeholder="Give your project a name" />
                <Field label="URL slug *" value={draft.slug} onChange={(slug) => updateDraft('slug', slugify(slug))} placeholder="project-url-slug" />
                <TextArea label="Project description" rows={4} value={draft.summary} onChange={(summary) => updateDraft('summary', summary)} placeholder="A short summary for the project card and search results." />
                <MediaField label="Cover image" value={draft.coverImageUrl} onChange={(coverImageUrl) => updateDraft('coverImageUrl', coverImageUrl)} onUpload={(file) => void uploadCover(file)} uploading={uploadingTarget === 'cover'} />
                <Field label="Creative field" value={draft.category} onChange={(category) => updateDraft('category', category)} />
                <Field label="Project date" value={draft.projectDate} onChange={(projectDate) => updateDraft('projectDate', projectDate)} placeholder="10.2025–11.2025" />
                <Field label="Location" value={draft.location} onChange={(location) => updateDraft('location', location)} />
                <Field label="Author" value={draft.author} onChange={(author) => updateDraft('author', author)} />
                <Field label="Tools used" value={draft.tools.join(', ')} onChange={(tools) => updateDraft('tools', tools.split(',').map((tool) => tool.trim()).filter(Boolean))} placeholder="Fusion 360, Blender, Figma" />
              </div>
            </section>

            <section className="border-t border-[#e6e6e6] pt-5">
              <h2 className="text-sm font-semibold">Ready to publish</h2>
              <div className="mt-3 space-y-2">
                {publishChecks.map((item) => <div key={item.label} className="flex items-center gap-2 text-xs"><span className={`grid h-4 w-4 place-items-center rounded-full ${item.ready ? 'bg-emerald-100 text-emerald-700' : 'bg-[#eeeeee] text-[#999]'}`}>{item.ready && <Check size={11} />}</span><span className={item.ready ? 'text-[#4b4b4b]' : 'text-[#8a8a8a]'}>{item.label}</span></div>)}
              </div>
              <button type="button" className={`${primaryButtonClass} mt-5 w-full`} disabled={saving || Boolean(uploadingTarget) || hasLocalMedia} onClick={() => void save('published')}>Publish project <ChevronRight size={16} /></button>
              <button type="button" className={`${secondaryButtonClass} mt-2 w-full`} disabled={saving || Boolean(uploadingTarget) || hasLocalMedia} onClick={() => void save('draft')}>Save as draft</button>
              {selectedProject?.status === 'published' && <a href={`/projects/${encodeURIComponent(selectedProject.slug)}`} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#1769ff] hover:underline">View live project <ExternalLink size={13} /></a>}
            </section>

            {selectedProject && <section className="border-t border-[#e6e6e6] pt-5">
              <button type="button" className="flex w-full items-center justify-between text-left text-xs font-semibold text-red-600 hover:text-red-700" disabled={saving} onClick={() => void remove()}><span className="flex items-center gap-2"><Trash2 size={14} /> Delete project</span><ChevronRight size={14} /></button>
            </section>}
          </div>}
        </aside>
      </div>
    </div>
  );
}
