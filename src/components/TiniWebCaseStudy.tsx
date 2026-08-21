import LazyImage from './LazyImage';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-[10px] font-black uppercase tracking-[.22em] text-[#84f238] md:text-xs">
    {children}
  </p>
);

const Caption = ({ children }: { children: React.ReactNode }) => (
  <figcaption className="mt-3 flex items-start justify-between gap-6 font-mono text-[9px] uppercase leading-4 tracking-[.09em] text-[#959990] md:text-[10px]">
    {children}
  </figcaption>
);

export default function TiniWebCaseStudy() {
  return (
    <article className="tini-web min-h-screen overflow-hidden bg-[#070807] text-[#eeeae0]">
      <section
        className="relative isolate flex min-h-[100svh] overflow-hidden bg-cover bg-[70%_center]"
        style={{ backgroundImage: "url('/works/tini/tini%20(2).jpg')" }}
        aria-labelledby="tini-web-title"
      >
        <video
          className="absolute inset-0 -z-20 h-full w-full origin-center translate-x-[20%] scale-[1.4] object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/works/tini/tini (2).jpg"
          aria-hidden="true"
        >
          <source src="/works/tini/hero.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(3,4,3,.7)_0%,rgba(3,4,3,.08)_38%,rgba(3,4,3,.92)_100%),linear-gradient(90deg,rgba(3,4,3,.54)_0%,transparent_65%)]"
          aria-hidden="true"
        />

        <div className="tini-columns absolute inset-x-0 top-20 border-b border-white/25 pb-4 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-white/75 md:top-5 md:text-[10px]">
          <span className="col-span-1 md:col-span-2">Irregular geologic assemblies</span>
          <span className="col-start-2 text-right md:col-start-5">Germany · 2025</span>
        </div>

        <div className="tini-columns mt-auto w-full gap-y-5 pb-[9vh] pt-36 md:gap-y-7">
          <div className="col-span-2 md:col-span-2">
            <SectionLabel>Designing with digital stone</SectionLabel>
          </div>
          <h1
            id="tini-web-title"
            className="col-span-2 col-start-1 text-[clamp(2.8rem,5.6vw,6.4rem)] font-medium uppercase leading-[.82] tracking-[-.065em] md:col-span-3 md:col-start-1"
          >
            <span className="block">Dark Side</span>
            <span className="block">of the Tini</span>
          </h1>
          <p className="col-span-1 col-start-1 font-mono text-[9px] font-bold uppercase leading-4 tracking-[.08em] text-white/80 md:col-span-2 md:col-start-1 md:text-xs">
            Po-Yu Yang × Nick Düchs
          </p>
          <p className="col-span-1 font-mono text-[9px] font-bold uppercase leading-4 tracking-[.08em] text-white/80 md:col-span-2 md:col-start-3 md:text-xs">
            Computational design · Prototyping · Light
          </p>
        </div>
      </section>

      <section className="tini-columns gap-y-12 py-24 md:gap-y-16 md:py-36">
        <div className="col-span-2 md:col-span-1">
          <SectionLabel>01 / Thesis</SectionLabel>
        </div>
        <h2 className="col-span-2 text-[clamp(3rem,7vw,7rem)] font-normal leading-[.97] tracking-[-.055em] md:col-span-5">
          What if stone were not a material to shape,
          <span className="text-[#84f238]"> but the protagonist of the design?</span>
        </h2>
        <p className="col-span-2 border-t border-white/20 pt-8 text-lg font-light leading-8 text-white/80 md:col-span-2 md:col-start-3 md:mt-12 md:text-2xl md:leading-10">
          Dark Side of the Tini explores a luminous stone suspended between
          physical weight and visual weightlessness. Analogue sketching,
          physical testing, and a computational support system respond to the
          irregular body of each individual stone.
        </p>
        <dl className="col-span-2 font-mono text-[10px] uppercase tracking-[.1em] md:col-span-1 md:col-start-5 md:mt-12">
          {[
            ['Reference', 'Hizz rocking chair'],
            ['Method', 'Grasshopper · 3D printing'],
            ['Outcome', 'Ambient object · support system'],
          ].map(([label, value]) => (
            <div key={label} className="grid grid-cols-[90px_1fr] gap-5 border-b border-white/15 py-4 first:pt-0 md:grid-cols-1 md:gap-2">
              <dt className="text-white/45">{label}</dt>
              <dd className="m-0 text-white/85">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-[#eeeae0] py-24 text-[#070807] md:py-36">
        <header className="tini-columns gap-y-10">
          <p className="col-span-2 font-mono text-[10px] font-black uppercase tracking-[.22em] text-[#386f12] md:col-span-5 md:text-xs">
            02 / Origins
          </p>
          <h2 className="col-span-2 text-[clamp(3.8rem,8vw,8.5rem)] font-medium uppercase leading-[.78] tracking-[-.07em] md:col-span-3 md:col-start-1 md:row-start-2">
            Floating.<br />Penetrating.<br /><span className="text-[#58ad1d]">Glowing.</span>
          </h2>
          <p className="col-span-2 text-sm leading-7 md:col-span-2 md:col-start-4 md:row-start-2 md:text-base">
            The Hizz rocking chair suggested separate geometries passing through
            one another while remaining visually balanced. Moonlight and early
            photography added a second rule: darkness should reveal the object,
            not conceal it.
          </p>
        </header>

        <div className="tini-columns mt-20 gap-y-16 md:mt-32 md:gap-y-32">
          <figure className="col-span-2 md:col-span-3 md:col-start-3">
            <LazyImage src="/works/tini/tini (5).jpg" alt="Hizz rocking chair reference study" className="w-full" />
            <Caption><span>01 — Reference</span><span>Visual balance</span></Caption>
          </figure>
          <figure className="col-span-2 md:col-span-3 md:col-start-1">
            <LazyImage src="/works/tini/tini (6).jpg" alt="Analytical sketches of floating and penetrating forms" className="w-full" />
            <Caption><span>02 — Reading form</span><span>Floating / penetration</span></Caption>
          </figure>
          <figure className="col-span-2 md:col-span-3 md:col-start-3">
            <LazyImage src="/works/tini/tini (7).jpg" alt="Moodboard of moonlight and luminous objects" className="w-full" />
            <Caption><span>03 — Atmosphere</span><span>A luminous stone</span></Caption>
          </figure>
        </div>
      </section>

      <section className="py-24 md:py-36">
        <header className="tini-columns gap-y-10">
          <div className="col-span-2 md:col-span-1">
            <SectionLabel>03 / Iteration</SectionLabel>
          </div>
          <h2 className="col-span-2 text-[clamp(3rem,6vw,6.5rem)] font-normal leading-[.95] tracking-[-.055em] md:col-span-2 md:col-start-2">
            The design improved each time it failed.
          </h2>
          <p className="col-span-2 text-sm leading-7 text-white/65 md:col-span-1 md:col-start-5 md:text-base">
            Early models treated the support as a generic frame. Physical
            testing revealed that the real design variable was the stone’s
            unpredictable centre of mass.
          </p>
        </header>

        <div className="tini-columns mt-20 gap-y-12 md:mt-28">
          <figure className="col-span-2 md:col-span-2">
            <LazyImage src="/works/tini/tini (9).jpg" alt="First support prototypes" className="aspect-video w-full object-cover" />
            <Caption><span>Prototype 01</span><span>Unstable centre</span></Caption>
          </figure>
          <figure className="col-span-2 md:col-span-2 md:col-start-4">
            <LazyImage src="/works/tini/tini (17).jpg" alt="Fourth physical prototype" className="aspect-video w-full object-cover" />
            <Caption><span>Prototype 04</span><span>Stone-led measurement</span></Caption>
          </figure>
        </div>

        <ol className="mt-20 border-t border-white/20 md:mt-28">
          {[
            ['01', 'The stone falls', 'An off-centre mass exposes the weakness of the first support geometry.'],
            ['02', 'The frame dominates', 'Folded metal logic makes the structure feel heavier than the stone.'],
            ['03', 'The base finds balance', 'A roly-poly principle shifts stability into a low, weighted volume.'],
            ['04', 'The stone sets the rules', 'Support heights are generated from the scanned silhouette.'],
          ].map(([number, title, description]) => (
            <li key={number} className="tini-columns gap-y-3 border-b border-white/20 py-7 md:items-center md:py-9">
              <span className="col-span-2 font-mono text-[10px] font-black tracking-[.16em] text-[#84f238] md:col-span-1">{number}</span>
              <h3 className="col-span-2 text-2xl font-normal md:col-span-2 md:col-start-2 md:text-3xl">{title}</h3>
              <p className="col-span-2 text-sm leading-6 text-white/55 md:col-span-2 md:col-start-4">{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="tini-columns gap-y-20 border-t border-white/15 bg-[#10120f] py-24 md:py-36">
        <div className="col-span-2 self-start md:col-span-2 md:sticky md:top-24">
          <SectionLabel>04 / Computational method</SectionLabel>
          <h2 className="mt-5 text-[clamp(3rem,6vw,6.5rem)] font-normal leading-[.95] tracking-[-.055em]">
            A support system drawn by the stone itself.
          </h2>
          <p className="mt-10 max-w-2xl text-sm leading-7 text-white/65 md:mt-12 md:text-base">
            A Grasshopper definition locates the centroid, samples the irregular
            boundary, and distributes connection points. The rods negotiate
            stability, transparency, and the illusion of suspension.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3 font-mono text-[9px] font-black uppercase tracking-[.12em] text-[#84f238]">
            <span>Scan</span><i className="h-px w-4 bg-white/25" />
            <span>Centroid</span><i className="h-px w-4 bg-white/25" />
            <span>Nodes</span><i className="h-px w-4 bg-white/25" />
            <span>Support</span>
          </div>
        </div>
        <div className="col-span-2 space-y-20 md:col-span-3 md:col-start-3">
          <figure>
            <LazyImage src="/works/tini/tini (13).jpg" alt="Grasshopper centroid and support definition" className="aspect-video w-full object-cover" />
            <Caption><span>Centroid</span><span>Support generation</span></Caption>
          </figure>
          <figure>
            <LazyImage src="/works/tini/tini (19).jpg" alt="Technical views of the generated support" className="aspect-video w-full object-cover" />
            <Caption><span>Generated geometry</span><span>Front / top</span></Caption>
          </figure>
        </div>
      </section>

      <section className="bg-[#030403] py-24 md:py-36">
        <header className="tini-columns gap-y-8">
          <div className="col-span-2 md:col-span-1">
            <SectionLabel>05 / Final design</SectionLabel>
          </div>
          <h2 className="col-span-2 text-[clamp(3.2rem,7vw,7.5rem)] font-normal leading-[.92] tracking-[-.06em] md:col-span-4 md:col-start-2">
            Mass, held in a field of light.
          </h2>
        </header>
        <div className="tini-columns mt-16 md:mt-24">
          <figure className="col-span-2 md:col-span-5">
            <LazyImage src="/works/tini/tini (2).jpg" alt="Final illuminated Tini object" className="min-h-[70svh] w-full object-cover" />
            <Caption><span>Dark Side of the Tini</span><span>Final visualisation</span></Caption>
          </figure>
        </div>
        <div className="tini-columns mt-20 gap-y-16 md:mt-28">
          <figure className="col-span-2 md:col-span-4 md:col-start-2">
            <LazyImage src="/works/tini/tini (14).jpg" alt="Exploded view of the support system" className="w-full" />
            <Caption><span>Double-layered base</span><span>Lower centre of gravity</span></Caption>
          </figure>
          <figure className="col-span-2 md:col-span-2 md:col-start-1">
            <LazyImage src="/works/tini/tini (3).jpg" alt="Transparent support rods holding the stone" className="aspect-video w-full object-cover" />
            <Caption><span>Transparent support</span><span>Structural clarity</span></Caption>
          </figure>
          <figure className="col-span-2 md:col-span-2 md:col-start-4">
            <LazyImage src="/works/tini/tini (4).jpg" alt="Illuminated final design from two angles" className="aspect-video w-full object-cover" />
            <Caption><span>Warm light</span><span>Atmospheric presence</span></Caption>
          </figure>
        </div>
      </section>

      <section className="bg-[#84f238] py-24 text-[#070807] md:py-36">
        <header className="tini-columns items-end gap-y-10">
          <div className="col-span-2 md:col-span-3">
            <p className="mb-5 font-mono text-[10px] font-black uppercase tracking-[.22em] text-[#24450e] md:text-xs">06 / Physical outcome</p>
            <h2 className="text-[clamp(3rem,6vw,6.5rem)] font-normal leading-[.95] tracking-[-.055em]">
              Designed on screen.<br />Tested by hand.
            </h2>
          </div>
          <p className="col-span-2 text-sm leading-7 md:col-span-1 md:col-start-5 md:text-base">
            A dense found stone, a digitally formed base, and a field of
            transparent rods meet in a structure that looks delicate but reads
            as deliberate.
          </p>
        </header>
        <div className="tini-columns mt-20 gap-y-5 md:mt-28">
          {[5, 1, 2, 3].map((image, index) => (
            <figure
              key={image}
              className={`col-span-2 overflow-hidden bg-black ${
                index === 0
                  ? 'md:col-span-3 md:col-start-1'
                  : index === 1
                    ? 'md:col-span-2 md:col-start-4'
                    : index === 2
                      ? 'md:col-span-2 md:col-start-1'
                      : 'md:col-span-3 md:col-start-3'
              }`}
            >
              <LazyImage
                src={`/works/tini/tini small pics (${image}).png`}
                alt={image === 5 ? 'Hands placing the stone into the illuminated prototype' : 'Physical Tini prototype detail'}
                className="aspect-square w-full object-cover transition duration-700 hover:scale-[1.02] hover:opacity-90"
              />
            </figure>
          ))}
        </div>
      </section>

      <footer className="flex min-h-[86svh] flex-col justify-between py-24 md:pb-10 md:pt-36">
        <div className="tini-columns gap-y-5">
          <div className="col-span-2 md:col-span-1">
            <SectionLabel>07 / Reflection</SectionLabel>
          </div>
          <h2 className="col-span-2 text-[clamp(3.2rem,7vw,7.5rem)] font-normal leading-[.95] tracking-[-.06em] md:col-span-5">
            One stone, one structure.<br />
            <span className="text-[#84f238]">A system for many forms.</span>
          </h2>
        </div>
        <div className="tini-columns mt-24 border-t border-white/20 pt-8">
          <p className="col-span-2 max-w-3xl text-base font-light leading-8 text-white/65 md:col-span-3 md:text-xl">
            Computational design becomes a way to listen to material difference.
            Instead of forcing irregular geology into a repeatable shell, each
            object generates the conditions of its own support.
          </p>
          <div className="col-span-2 mt-12 font-mono text-[10px] font-bold uppercase leading-6 tracking-[.1em] text-white/60 md:col-span-2 md:col-start-4 md:mt-0">
            <p>Po-Yu Yang × Nick Düchs</p>
            <p>Irregular Geologic Assemblies</p>
            <p>Germany · 2025</p>
          </div>
        </div>
      </footer>
    </article>
  );
}
