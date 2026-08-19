import { ArrowDown, ArrowUp } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ProjectSummary } from '../types/cms';

const COVER_OVERRIDES: Record<string, string> = {
  'dark-side-of-the-tini': '/works/tini/garage-cover.jpg',
  'explo-11': '/works/explo.11/garage-cover.jpg',
  'tube-radio': '/works/tube/garage-cover.jpg',
  'invisible-senses': '/works/invisible/garage-cover.jpg',
};

const modulo = (value: number, size: number) => ((value % size) + size) % size;

const shortestDelta = (value: number, size: number) => {
  const half = size / 2;
  return modulo(value + half, size) - half;
};

interface GarageDeckProps {
  projects: ProjectSummary[];
  loading: boolean;
  error: string | null;
  onOpen: (project: ProjectSummary) => void;
}

const projectPresentation = (project: ProjectSummary) => {
  const isPortfolio = project.slug === '2025-industrial-design-portfolio';
  const isInvisible = project.slug === 'invisible-senses';

  return {
    cover: isPortfolio ? null : (COVER_OVERRIDES[project.slug] ?? project.coverImageUrl),
    showTitle: isPortfolio || isInvisible,
    background: isPortfolio ? '#FF7A2A' : isInvisible ? '#F7F4EF' : '#10131C',
    foreground: isInvisible ? '#10131C' : '#F7F4EF',
    overlay: isPortfolio
      ? 'linear-gradient(160deg, rgba(255,122,42,.98), rgba(232,84,25,.98))'
      : isInvisible
        ? 'linear-gradient(90deg, rgba(247,244,239,.86) 0%, rgba(247,244,239,.52) 54%, rgba(247,244,239,.18) 100%), linear-gradient(180deg, rgba(247,244,239,.30), transparent 46%, rgba(247,244,239,.76))'
        : 'linear-gradient(90deg, rgba(16,19,28,.88) 0%, rgba(16,19,28,.56) 54%, rgba(16,19,28,.20) 100%), linear-gradient(180deg, rgba(16,19,28,.32), transparent 44%, rgba(16,19,28,.76))',
  };
};

export default function GarageDeck({ projects, loading, error, onOpen }: GarageDeckProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const positionRef = useRef(0);
  const targetRef = useRef(0);
  const velocityRef = useRef(0);
  const animationRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartPositionRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(0);
  const dragVelocityRef = useRef(0);
  const suppressClickRef = useRef(false);
  const wheelAccumulatorRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const projectKey = useMemo(() => projects.map((project) => project.id).join('|'), [projects]);

  const renderCards = useCallback(() => {
    const viewport = viewportRef.current;
    const count = projects.length;
    if (!viewport || count === 0) return;

    const narrow = viewport.clientWidth < 640;
    const baseY = narrow ? 210 : 238;
    const interval = narrow ? 126 : 170;
    const cyclePosition = modulo(positionRef.current, count);
    const activeIndex = modulo(Math.round(positionRef.current), count);

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const delta = shortestDelta(index - cyclePosition, count);
      const distance = Math.abs(delta);
      const focus = Math.max(0, 1 - distance);
      const tilt = ((index * 7) % 23) - 11;
      const xOffset = ((index * 5) % 15) - 7;
      const y = baseY + delta * interval;
      const rotation = tilt + delta * 1.7;
      const scale = .84 + focus * .2 - Math.min(distance, 2.5) * .03;
      const x = xOffset + delta * 1.5;
      const depth = 70 - distance * 38;

      card.style.transform = `translate3d(calc(-50% + ${x}%), ${y}px, ${depth}px) rotateZ(${rotation}deg) rotateX(4deg) scale(${scale})`;
      card.style.opacity = String(Math.max(.3, 1 - Math.max(0, distance - 1.8) * .25));
      card.style.filter = `saturate(${.72 + focus * .28}) brightness(${.78 + focus * .22})`;
      card.style.zIndex = String(30 - Math.round(distance * 4));
      card.dataset.selected = String(index === activeIndex);
    });

    setSelectedIndex((current) => current === activeIndex ? current : activeIndex);
  }, [projects.length]);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = 0;
    isAnimatingRef.current = false;
  }, []);

  const animateTo = useCallback((target: number, initialVelocity = 0) => {
    stopAnimation();
    targetRef.current = target;

    if (reducedMotionRef.current) {
      positionRef.current = target;
      renderCards();
      return;
    }

    velocityRef.current = initialVelocity;
    isAnimatingRef.current = true;
    let previous = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - previous) / 1000, .034);
      previous = now;
      const force = (targetRef.current - positionRef.current) * 74 - velocityRef.current * 14;
      velocityRef.current += force * dt;
      positionRef.current += velocityRef.current * dt;
      renderCards();

      if (Math.abs(targetRef.current - positionRef.current) < .001 && Math.abs(velocityRef.current) < .01) {
        positionRef.current = targetRef.current;
        renderCards();
        animationRef.current = 0;
        isAnimatingRef.current = false;
        return;
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
  }, [renderCards, stopAnimation]);

  const moveBy = useCallback((amount: number) => {
    if (projects.length === 0) return;
    animateTo(Math.round(positionRef.current) + amount);
  }, [animateTo, projects.length]);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    stopAnimation();
    positionRef.current = 0;
    targetRef.current = 0;
    velocityRef.current = 0;
    const frame = requestAnimationFrame(renderCards);
    return () => cancelAnimationFrame(frame);
  }, [projectKey, renderCards, stopAnimation]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const resizeObserver = new ResizeObserver(renderCards);
    resizeObserver.observe(viewport);

    const onWheel = (event: WheelEvent) => {
      if (projects.length < 2) return;
      event.preventDefault();
      if (isAnimatingRef.current) return;

      wheelAccumulatorRef.current += event.deltaY;
      if (Math.abs(wheelAccumulatorRef.current) < 42) return;

      const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;
      wheelAccumulatorRef.current = 0;
      moveBy(direction);
    };

    viewport.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      resizeObserver.disconnect();
      viewport.removeEventListener('wheel', onWheel);
    };
  }, [moveBy, projects.length, renderCards]);

  useEffect(() => () => stopAnimation(), [stopAnimation]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    stopAnimation();
    draggingRef.current = true;
    suppressClickRef.current = false;
    dragStartYRef.current = event.clientY;
    dragStartPositionRef.current = positionRef.current;
    lastYRef.current = event.clientY;
    lastTimeRef.current = performance.now();
    dragVelocityRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    const now = performance.now();
    const elapsed = Math.max(8, now - lastTimeRef.current);
    const dragUnit = viewport.clientWidth < 640 ? 132 : 176;
    const step = (event.clientY - lastYRef.current) / dragUnit;

    if (Math.abs(event.clientY - dragStartYRef.current) > 6) suppressClickRef.current = true;
    dragVelocityRef.current = dragVelocityRef.current * .72 + (-step / (elapsed / 1000)) * .28;
    positionRef.current = dragStartPositionRef.current - (event.clientY - dragStartYRef.current) / dragUnit;
    lastYRef.current = event.clientY;
    lastTimeRef.current = now;
    renderCards();
  };

  const finishPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const impulse = Math.max(-4, Math.min(4, dragVelocityRef.current));
    animateTo(Math.round(positionRef.current + impulse * .12), impulse);
  };

  const handleCardClick = (project: ProjectSummary, index: number) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    if (index === selectedIndex) {
      onOpen(project);
      return;
    }

    const cyclePosition = modulo(positionRef.current, projects.length);
    animateTo(positionRef.current + shortestDelta(index - cyclePosition, projects.length));
  };

  const selectedProject = projects[selectedIndex];

  return (
    <div
      ref={viewportRef}
      role="region"
      aria-label="Interactive project card deck"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
          event.preventDefault();
          moveBy(1);
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
          event.preventDefault();
          moveBy(-1);
        } else if (event.key === 'Enter' && selectedProject) {
          event.preventDefault();
          onOpen(selectedProject);
        }
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointer}
      onPointerCancel={finishPointer}
      className="relative h-[760px] w-full cursor-grab touch-pan-x overflow-hidden bg-[radial-gradient(circle_at_18%_20%,rgba(247,244,239,.08),transparent_24%),linear-gradient(180deg,#080808_0%,#030303_62%,#000_100%)] outline-none focus-visible:ring-2 focus-visible:ring-light-coral md:h-[900px] active:cursor-grabbing"
      style={{ perspective: '1600px' }}
    >
      <div className="pointer-events-none absolute left-4 top-4 z-40 font-mono text-[10px] uppercase tracking-[.08em] text-[#F7F4EF] md:left-6 md:top-6">
        Paul's Experimental Lab
      </div>
      <div className="pointer-events-none absolute right-4 top-4 z-40 font-mono text-[10px] uppercase tracking-[.08em] text-[#F7F4EF] md:right-6 md:top-6">
        Garage / {String(projects.length).padStart(2, '0')}
      </div>

      {loading && (
        <div className="absolute inset-0 z-50 grid place-items-center bg-black text-[#F7F4EF]">
          <div className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-white/60">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Loading projects
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="absolute inset-0 z-50 grid place-items-center bg-black px-6 text-center">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-light-coral">Projects unavailable</p>
            <p className="mt-3 max-w-xl text-sm text-white/60">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="absolute inset-0 z-50 grid place-items-center bg-black px-6 text-center text-sm text-white/60">
          No published projects in this category yet.
        </div>
      )}

      <div className="absolute inset-0 z-10 [transform-style:preserve-3d]">
        {projects.map((project, index) => {
          const presentation = projectPresentation(project);
          return (
            <button
              key={project.id}
              ref={(node) => { cardRefs.current[index] = node; }}
              type="button"
              onClick={() => handleCardClick(project, index)}
              aria-label={index === selectedIndex ? `Open ${project.title}` : `Select ${project.title}`}
              className="group absolute left-1/2 top-0 aspect-[1.62/1] w-[88%] max-w-[760px] overflow-hidden rounded-[10px] border border-white/25 text-left shadow-[0_28px_58px_rgba(0,0,0,.52)] transition-[box-shadow] duration-200 will-change-transform [transform-style:preserve-3d] data-[selected=true]:shadow-[0_38px_72px_rgba(0,0,0,.72)] sm:w-[82%] lg:w-[72%]"
              style={{
                background: presentation.background,
                color: presentation.foreground,
                transformOrigin: '50% 50%',
              }}
            >
              {presentation.cover && (
                <img
                  src={presentation.cover}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  loading={index < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              )}
              <div className="pointer-events-none absolute inset-0" style={{ background: presentation.overlay }} />
              <div className="relative grid h-full grid-cols-[1.05fr_.95fr] grid-rows-[auto_1fr_auto] gap-3 p-4 font-mono uppercase md:p-6">
                <div className="text-[9px] tracking-[.05em] opacity-80 md:text-[10px]">
                  {String(index + 1).padStart(2, '0')} / {project.category || 'Project'}
                </div>
                <div className="text-right text-[9px] tracking-[.05em] opacity-70 md:text-[10px]">{project.projectDate}</div>

                {presentation.showTitle && (
                  <h2 className="col-start-1 row-start-2 self-center font-sans text-[clamp(1.35rem,3.2vw,2.35rem)] font-medium leading-[.96] tracking-[-.025em]">
                    {project.title}
                  </h2>
                )}
                <p className="col-start-2 row-start-2 max-w-[190px] self-center justify-self-end text-[9px] leading-[1.35] opacity-[.78] md:text-[10px]">
                  {project.summary}
                </p>

                <div className="col-span-2 row-start-3 flex items-end justify-between gap-4 border-t border-current pt-3 text-[9px] tracking-[.04em] opacity-80 md:text-[10px]">
                  <span>{project.title}</span>
                  <span>{project.location || 'Archive'}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[30%] bg-gradient-to-b from-transparent via-black/45 to-black" />

      {selectedProject && (
        <div className="pointer-events-none absolute bottom-16 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[.08em] text-[#F7F4EF] md:bottom-20">
          <span className="h-1.5 w-1.5 rounded-full bg-light-coral shadow-[0_0_0_4px_rgba(255,122,42,.22)]" />
          {String(selectedIndex + 1).padStart(2, '0')} / {selectedProject.title}
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 z-40 flex items-end justify-between md:bottom-6 md:left-6 md:right-6">
        <span className="pointer-events-none font-mono text-[10px] uppercase tracking-[.08em] text-white/55">Drag / Scroll</span>
        <div className="flex gap-2">
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => { event.stopPropagation(); moveBy(-1); }}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/45 bg-black/45 text-white transition hover:border-light-coral hover:text-light-coral"
            aria-label="Previous project"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => { event.stopPropagation(); moveBy(1); }}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/45 bg-black/45 text-white transition hover:border-light-coral hover:text-light-coral"
            aria-label="Next project"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
