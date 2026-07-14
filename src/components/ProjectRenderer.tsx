import LazyImage from './LazyImage';
import type { GalleryImage, ProcessStep, Project, ProjectBlock, ProjectBlockContent } from '../types/cms';

const text = (value: unknown) => typeof value === 'string' ? value : '';
const object = (value: unknown) => value && typeof value === 'object' && !Array.isArray(value)
  ? value as Record<string, unknown>
  : {};

const galleryImages = (content: ProjectBlockContent): GalleryImage[] => Array.isArray(content.images)
  ? content.images.filter((item): item is GalleryImage => Boolean(item && typeof item.url === 'string'))
  : [];

const processSteps = (content: ProjectBlockContent): ProcessStep[] => Array.isArray(content.steps)
  ? content.steps.filter((item): item is ProcessStep => Boolean(item && typeof item.title === 'string'))
  : [];

const getVideoEmbed = (value: string) => {
  try {
    const url = new URL(value);
    if (url.hostname.includes('youtube.com')) {
      const id = url.searchParams.get('v');
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (url.hostname === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${url.pathname.slice(1)}`;
    if (url.hostname.includes('vimeo.com')) return `https://player.vimeo.com/video/${url.pathname.split('/').filter(Boolean).pop()}`;
  } catch {
    return null;
  }
  return null;
};

const BodyCopy = ({ value }: { value: string }) => (
  <div className="space-y-5 text-base font-light leading-8 text-neutral-700 dark:text-neutral-300 md:text-xl md:leading-9">
    {value.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => (
      <p key={`${paragraph.slice(0, 24)}-${index}`} className="whitespace-pre-line">{paragraph}</p>
    ))}
  </div>
);

const Block = ({ block, project, priority }: { block: ProjectBlock; project: Project; priority: boolean }) => {
  const content = block.content;

  if (block.type === 'hero') {
    const imageUrl = text(content.imageUrl) || project.coverImageUrl;
    return (
      <section className="relative min-h-[62vh] overflow-hidden bg-neutral-950 text-white">
        {imageUrl && <LazyImage src={imageUrl} alt={text(content.alt) || project.title} className="absolute inset-0 h-full w-full object-cover" priority={priority} />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        <div className="relative mx-auto flex min-h-[62vh] max-w-7xl flex-col justify-end px-6 py-12 md:px-16 md:py-20">
          {text(content.eyebrow) && <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-white/70">{text(content.eyebrow)}</p>}
          <h1 className="max-w-5xl text-4xl font-semibold leading-[0.95] md:text-7xl">{text(content.heading) || project.title}</h1>
          {text(content.subheading) && <p className="mt-6 max-w-2xl text-lg text-white/75 md:text-2xl">{text(content.subheading)}</p>}
        </div>
      </section>
    );
  }

  if (block.type === 'text') {
    return (
      <section className="bg-white px-6 py-16 dark:bg-[#050505] md:px-12 md:py-24">
        <div className="mx-auto max-w-4xl">
          {text(content.heading) && <h2 className="mb-8 text-3xl font-semibold text-neutral-900 dark:text-white md:text-5xl">{text(content.heading)}</h2>}
          {text(content.body) ? <BodyCopy value={text(content.body)} /> : <p className="text-neutral-400">No text has been added to this block.</p>}
        </div>
      </section>
    );
  }

  if (block.type === 'image') {
    const url = text(content.url) || text(content.imageUrl);
    if (!url) return null;
    return (
      <figure className="bg-white dark:bg-[#050505]">
        <LazyImage src={url} alt={text(content.alt) || project.title} className="block h-auto w-full" priority={priority} />
        {text(content.caption) && <figcaption className="mx-auto max-w-6xl px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">{text(content.caption)}</figcaption>}
      </figure>
    );
  }

  if (block.type === 'gallery') {
    const images = galleryImages(content);
    if (images.length === 0) return null;
    const columns = content.columns === 2 ? 2 : content.columns === 3 ? 3 : 1;
    const columnClass = columns === 3 ? 'md:grid-cols-3' : columns === 2 ? 'md:grid-cols-2' : 'grid-cols-1';
    const gapClass = content.gap === 'none' ? 'gap-0' : 'gap-3 md:gap-5 p-3 md:p-5';
    return (
      <section className={`grid grid-cols-1 bg-white dark:bg-[#050505] ${columnClass} ${gapClass}`}>
        {images.map((image, index) => (
          <figure key={`${image.url}-${index}`} className="min-w-0">
            <LazyImage
              src={image.url}
              alt={image.alt || `${project.title} image ${index + 1}`}
              className={`block w-full object-cover ${content.square ? 'aspect-square' : 'h-auto'}`}
              priority={priority && index < 2}
            />
            {image.caption && <figcaption className="px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400">{image.caption}</figcaption>}
          </figure>
        ))}
      </section>
    );
  }

  if (block.type === 'video') {
    const url = text(content.url);
    if (!url) return null;
    const embedUrl = getVideoEmbed(url);
    return (
      <figure className="bg-black">
        {embedUrl ? (
          <iframe className="aspect-video w-full" src={embedUrl} title={text(content.caption) || project.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : (
          <video className="h-auto w-full" src={url} poster={text(content.posterUrl) || undefined} controls playsInline />
        )}
        {text(content.caption) && <figcaption className="bg-white px-6 py-4 text-sm text-neutral-500 dark:bg-[#050505] dark:text-neutral-400">{text(content.caption)}</figcaption>}
      </figure>
    );
  }

  if (block.type === 'quote') {
    return (
      <figure className="bg-light-coral px-6 py-20 text-white md:px-12 md:py-28">
        <blockquote className="mx-auto max-w-5xl text-3xl font-medium leading-tight md:text-6xl">“{text(content.quote)}”</blockquote>
        {text(content.attribution) && <figcaption className="mx-auto mt-8 max-w-5xl font-mono text-xs font-bold uppercase tracking-[0.22em] text-white/75">— {text(content.attribution)}</figcaption>}
      </figure>
    );
  }

  if (block.type === 'twoColumn') {
    const left = object(content.left);
    const right = object(content.right);
    const renderColumn = (column: Record<string, unknown>, label: string) => (
      <article className="space-y-6">
        {text(column.imageUrl) && <LazyImage src={text(column.imageUrl)} alt={`${project.title} ${label}`} className="aspect-[4/3] w-full object-cover" />}
        {text(column.heading) && <h3 className="text-2xl font-semibold md:text-4xl">{text(column.heading)}</h3>}
        {text(column.body) && <BodyCopy value={text(column.body)} />}
      </article>
    );
    return (
      <section className="bg-white px-6 py-16 text-neutral-900 dark:bg-[#050505] dark:text-white md:px-12 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-16">
          {renderColumn(left, 'left column')}
          {renderColumn(right, 'right column')}
        </div>
      </section>
    );
  }

  const steps = processSteps(content);
  return (
    <section className="bg-neutral-100 px-6 py-16 text-neutral-900 dark:bg-neutral-950 dark:text-white md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        {text(content.heading) && <h2 className="mb-12 text-3xl font-semibold md:text-5xl">{text(content.heading)}</h2>}
        <div className="grid gap-px bg-neutral-300 dark:bg-neutral-700 md:grid-cols-2">
          {steps.map((step, index) => (
            <article key={`${step.title}-${index}`} className="bg-neutral-100 p-6 dark:bg-neutral-950 md:p-10">
              <p className="font-mono text-xs font-bold text-light-coral">{String(index + 1).padStart(2, '0')}</p>
              {step.imageUrl && <LazyImage src={step.imageUrl} alt={step.title} className="mt-6 aspect-[4/3] w-full object-cover" />}
              <h3 className="mt-6 text-2xl font-semibold">{step.title}</h3>
              {step.description && <p className="mt-4 leading-7 text-neutral-600 dark:text-neutral-400">{step.description}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function ProjectRenderer({ project }: { project: Project }) {
  if (project.blocks.length === 0) {
    return (
      <div className="grid min-h-[45vh] place-items-center bg-white px-6 text-center text-neutral-500 dark:bg-[#050505] dark:text-neutral-400">
        This published project does not have any content blocks yet.
      </div>
    );
  }

  return (
    <div>
      {[...project.blocks].sort((a, b) => a.sortOrder - b.sortOrder).map((block, index) => (
        <Block key={block.id} block={block} project={project} priority={index === 0} />
      ))}
    </div>
  );
}
