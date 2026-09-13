import { ExternalLink, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type IndexItem = {
  id: string;
  label: string;
  number: string;
  externalUrl?: string;
};

const items: IndexItem[] = [
  { id: 'explo11-chapter-1', number: '01', label: 'The Moon Landing Mission' },
  { id: 'explo11-chapter-4', number: '02', label: 'Task Planning & Research' },
  { id: 'explo11-chapter-8', number: '03', label: 'Sketches & Prototypes' },
  { id: 'explo11-chapter-12', number: '04', label: 'Mission Start' },
  {
    id: 'explo11-chapter-15',
    number: '05',
    label: 'Exhibition',
    externalUrl: 'https://pr.ntnu.edu.tw/ntnunews/index.php?mode=data&id=23525',
  },
  { id: 'explo11-film', number: '06', label: 'Testing & Interview' },
  { id: 'explo11-project-info', number: '07', label: 'Project Info' },
];

export default function Explo11Index() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="garage-glass fixed left-3 top-1/2 z-[235] flex min-h-10 -translate-x-[38%] -translate-y-1/2 -rotate-90 items-center gap-2 rounded-full border border-white/45 px-3 py-2 font-mono text-[9px] font-black uppercase tracking-[0.15em] text-white transition hover:border-light-coral hover:text-light-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-coral md:left-6"
        aria-controls="explo11-index"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <Menu size={13} aria-hidden="true" />
        Index
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[236] cursor-default bg-black/65 backdrop-blur-[2px]"
            aria-label="Close project index"
            onClick={() => setIsOpen(false)}
          />
          <aside
            id="explo11-index"
            className="fixed inset-y-0 left-0 z-[237] flex w-[min(25rem,92vw)] flex-col border-r border-white/15 bg-[#111] px-6 py-7 text-white shadow-2xl shadow-black/45 md:px-7"
            aria-label="Explo.11 project index"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-light-coral">Project archive</p>
                <h2 className="mt-3 text-4xl font-semibold leading-[0.9] tracking-tight">Explo.11</h2>
              </div>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white transition hover:border-light-coral hover:text-light-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-coral"
                aria-label="Close project index"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <nav className="mt-8 min-h-0 overflow-y-auto border-y border-white/15" aria-label="Explo.11 chapters">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[1fr_auto] border-t border-white/15 first:border-t-0">
                  <button
                    type="button"
                    className="grid min-w-0 grid-cols-[2.3rem_1fr] items-baseline gap-2 px-1 py-3 text-left transition hover:text-light-coral focus-visible:outline-none focus-visible:text-light-coral"
                    onClick={() => goTo(item.id)}
                  >
                    <span className="font-mono text-[10px] font-bold tracking-[0.1em] text-light-coral">{item.number}</span>
                    <span className="text-lg font-medium leading-tight">{item.label}</span>
                  </button>
                  {item.externalUrl && (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="grid w-11 place-items-center border-l border-white/15 text-white/55 transition hover:bg-white/5 hover:text-light-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-light-coral"
                      aria-label="Read the NTNU News article about the exhibition"
                    >
                      <ExternalLink size={15} aria-hidden="true" />
                    </a>
                  )}
                </div>
              ))}
            </nav>

            <p className="mt-auto pt-5 font-mono text-[9px] uppercase leading-5 tracking-[0.14em] text-white/45">Explo.11 · Design for mobility</p>
          </aside>
        </>
      )}
    </>
  );
}
