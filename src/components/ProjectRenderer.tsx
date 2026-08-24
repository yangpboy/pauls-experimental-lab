import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import LazyImage from './LazyImage';
import type { GalleryImage, ProcessStep, Project, ProjectBlock, ProjectBlockContent } from '../types/cms';

type PreviewImage = {
  url: string;
  alt: string;
  caption?: string;
};

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

const previewImages = (project: Project): PreviewImage[] => project.blocks
  .flatMap((block): PreviewImage[] => {
    const content = block.content;

    if (block.type === 'image') {
      const url = text(content.url) || text(content.imageUrl);
      return url ? [{ url, alt: text(content.alt) || project.title, caption: text(content.caption) || undefined }] : [];
    }

    if (block.type === 'gallery') {
      return galleryImages(content).map((image, index) => ({
        url: image.url,
        alt: image.alt || `${project.title} image ${index + 1}`,
        caption: image.caption,
      }));
    }

    if (block.type === 'twoColumn') {
      return [object(content.left), object(content.right)].flatMap((column, index) => {
        const url = text(column.imageUrl);
        return url ? [{ url, alt: text(column.heading) || `${project.title} column ${index + 1}` }] : [];
      });
    }

    if (block.type === 'process') {
      return processSteps(content).flatMap((step) => step.imageUrl
        ? [{ url: step.imageUrl, alt: step.title, caption: step.description }]
        : []);
    }

    return [];
  });

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

const ZoomableImage = ({
  src,
  alt,
  className,
  priority,
  onOpen,
}: {
  src: string;
  alt: string;
  className: string;
  priority?: boolean;
  onOpen: (url: string) => void;
}) => (
  <button
    type="button"
    className="group relative block w-full cursor-zoom-in overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-light-coral"
    onClick={() => onOpen(src)}
    aria-label={`Enlarge image: ${alt}`}
  >
    <LazyImage src={src} alt={alt} className={className} priority={priority} />
    <span className="pointer-events-none absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full border border-white/60 bg-black/45 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
      <ZoomIn size={16} aria-hidden="true" />
    </span>
  </button>
);

const Block = ({
  block,
  project,
  priority,
  onImageOpen,
}: {
  block: ProjectBlock;
  project: Project;
  priority: boolean;
  onImageOpen: (url: string) => void;
}) => {
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
        <ZoomableImage
          src={url}
          alt={text(content.alt) || project.title}
          className="block h-auto w-full"
          priority={priority}
          onOpen={onImageOpen}
        />
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
            <ZoomableImage
              src={image.url}
              alt={image.alt || `${project.title} image ${index + 1}`}
              className={`block w-full object-cover ${content.square ? 'aspect-square' : 'h-auto'}`}
              priority={priority && index < 2}
              onOpen={onImageOpen}
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
        {text(column.imageUrl) && (
          <ZoomableImage
            src={text(column.imageUrl)}
            alt={text(column.heading) || `${project.title} ${label}`}
            className="aspect-[4/3] w-full object-cover"
            onOpen={onImageOpen}
          />
        )}
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
              {step.imageUrl && (
                <div className="mt-6">
                  <ZoomableImage
                    src={step.imageUrl}
                    alt={step.title}
                    className="aspect-[4/3] w-full object-cover"
                    onOpen={onImageOpen}
                  />
                </div>
              )}
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
  const images = useMemo(() => previewImages(project), [project]);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const activeImage = activeImageIndex === null ? null : images[activeImageIndex];

  const closeLightbox = useCallback(() => setActiveImageIndex(null), []);
  const moveLightbox = useCallback((direction: -1 | 1) => {
    setActiveImageIndex((current) => {
      if (current === null || images.length < 2) return current;
      return (current + direction + images.length) % images.length;
    });
  }, [images.length]);

  const openLightbox = useCallback((url: string) => {
    const index = images.findIndex((image) => image.url === url);
    if (index >= 0) setActiveImageIndex(index);
  }, [images]);

  useEffect(() => {
    if (activeImageIndex === null) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') moveLightbox(-1);
      if (event.key === 'ArrowRight') moveLightbox(1);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeImageIndex, closeLightbox, moveLightbox]);

  if (project.blocks.length === 0) {
    return (
      <div className="grid min-h-[45vh] place-items-center bg-white px-6 text-center text-neutral-500 dark:bg-[#050505] dark:text-neutral-400">
        This published project does not have any content blocks yet.
      </div>
    );
  }

  return (
    <>
      <div>
        {[...project.blocks].sort((a, b) => a.sortOrder - b.sortOrder).map((block, index) => (
          <Block
            key={block.id}
            block={block}
            project={project}
            priority={index === 0}
            onImageOpen={openLightbox}
          />
        ))}
      </div>

      {activeImage && activeImageIndex !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-3 text-white md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged project image"
          onClick={closeLightbox}
        >
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/45 transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:left-8"
                onClick={(event) => {
                  event.stopPropagation();
                  moveLightbox(-1);
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={24} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="absolute right-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/45 transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-8"
                onClick={(event) => {
                  event.stopPropagation();
                  moveLightbox(1);
                }}
                aria-label="Next image"
              >
                <ChevronRight size={24} aria-hidden="true" />
              </button>
            </>
          )}

          <figure
            className="flex max-h-full max-w-full flex-col items-center gap-3 px-12 md:px-16"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={activeImage.url}
              alt={activeImage.alt}
              className="max-h-[calc(100vh-7rem)] max-w-full object-contain"
            />
            <figcaption className="max-w-4xl text-center text-xs text-white/65 md:text-sm">
              {activeImage.caption && <span>{activeImage.caption} · </span>}
              {activeImageIndex + 1} / {images.length}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
