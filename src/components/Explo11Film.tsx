import { Captions } from 'lucide-react';

const FILM_URL = 'https://media.paul-lab.com/projects/explo-11/explo11-film.mp4?v=20260913';

export default function Explo11Film() {
  return (
    <section id="explo11-film" className="scroll-mt-4 bg-[#050505] px-4 py-16 text-white sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-6 md:mb-10 md:grid-cols-2 md:items-end xl:grid-cols-[1.15fr_0.9fr_0.85fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Mobility, through their eyes
            </h2>
          </div>
          <div className="border-l border-white/20 pl-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-light-coral">
              Interviewee
            </p>
            <p className="mt-2 text-sm font-semibold leading-5 text-white">
              黃湘涵 老師 <span className="font-normal text-white/65">Prof. Hsiang-Han Huang</span>
            </p>
            <p className="mt-1 text-xs leading-5 text-white/45">
              Associate Professor, Department of Occupational Therapy,<br />
              Chang Gung University.
            </p>
          </div>
          <div className="flex max-w-sm items-start gap-3 text-sm leading-6 text-white/65">
            <Captions className="mt-0.5 shrink-0 text-light-coral" size={20} aria-hidden="true" />
            <p>
              Time-synchronised CC subtitles are on by default. They were automatically translated from Mandarin with AI assistance and reviewed for clarity. Use the player&apos;s CC control to turn them off.
            </p>
          </div>
        </div>

        <figure className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/30">
          <video
            className="explo11-film aspect-video h-auto w-full bg-black"
            controls
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            playsInline
            preload="metadata"
            poster="/works/explo.11/explo11-film-poster.jpg"
            aria-label="Explo.11 documentary film with time-synchronised CC subtitles"
            onContextMenu={(event) => event.preventDefault()}
          >
            <source src={FILM_URL} type="video/mp4" />
            <track
              default
              kind="subtitles"
              src="/works/explo.11/explo11-en.vtt"
              srcLang="en"
              label="CC"
            />
            Your browser does not support HTML video.
          </video>
          <figcaption className="border-t border-white/10 px-5 py-4 text-xs leading-5 text-white/50 md:px-6">
            Interviews and field observations from the development of Explo.11. CC subtitles were automatically translated from the original Mandarin dialogue with AI assistance.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
