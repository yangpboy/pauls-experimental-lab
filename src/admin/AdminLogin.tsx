import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, LockKeyhole } from 'lucide-react';

export default function AdminLogin() {
  useEffect(() => {
    let mode: 'light' | 'dark' = 'light';
    try {
      const savedMode = window.localStorage.getItem('color-mode');
      if (savedMode === 'dark' || savedMode === 'light') mode = savedMode;
      else if (window.matchMedia('(prefers-color-scheme: dark)').matches) mode = 'dark';
    } catch {
      // The login gateway remains usable when browser storage is unavailable.
    }
    document.documentElement.classList.toggle('dark', mode === 'dark');
    document.documentElement.style.colorScheme = mode;
  }, []);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-white px-5 py-6 text-light-ink dark:bg-[#111111] dark:text-white md:px-10 md:py-9">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:36px_36px] text-light-ink/10 dark:text-white/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-light-coral/90 blur-[1px] md:h-96 md:w-96" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 -left-28 h-80 w-80 rounded-full bg-light-teal/80 md:h-[28rem] md:w-[28rem]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-3rem)] max-w-[1480px] flex-col md:min-h-[calc(100svh-4.5rem)]">
        <header className="flex items-center justify-between border-b-2 border-light-ink pb-4 dark:border-white">
          <a href="/" className="inline-flex items-center gap-2 font-mono text-[11px] font-black uppercase tracking-[0.16em] transition hover:text-light-coral" aria-label="Back to portfolio">
            <ArrowLeft size={16} /> Portfolio
          </a>
          <div className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.16em] md:text-xs">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Protected access
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 py-12 md:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)] md:gap-16 md:py-16">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.24em] text-light-coral">Paul's Experimental Lab / CMS</p>
            <h1 className="mt-5 max-w-4xl font-sans text-[clamp(4rem,10vw,9rem)] font-semibold uppercase leading-[0.78] tracking-[-0.07em]">
              Private<br />Studio
            </h1>
            <div className="mt-9 flex items-center gap-4">
              <img src="/icons/svg/flower-orange.svg" alt="" className="h-14 w-14 rotate-[-8deg] md:h-20 md:w-20" />
              <p className="max-w-md text-sm font-medium leading-6 text-light-ink/65 dark:text-white/65 md:text-base md:leading-7">
                A secure doorway to edit projects, arrange content blocks, upload media, and publish the portfolio.
              </p>
            </div>
          </div>

          <div className="border-2 border-light-ink bg-white p-6 shadow-[12px_12px_0_rgba(43,43,43,0.22)] dark:border-white dark:bg-[#111111] dark:shadow-[12px_12px_0_rgba(255,255,255,0.14)] md:p-9">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-light-ink text-white dark:bg-white dark:text-light-ink">
              <LockKeyhole size={22} />
            </div>
            <h2 className="mt-8 text-3xl font-semibold tracking-tight md:text-4xl">Sign in to edit</h2>
            <p className="mt-4 text-sm font-medium leading-6 text-light-ink/65 dark:text-white/65">
              Authentication is handled by Cloudflare Access. Continue with the approved Google account or email verification code.
            </p>
            <div className="mt-6 border-y border-light-ink/20 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.12em] dark:border-white/20">
              <span className="text-light-ink/45 dark:text-white/45">Allowed identity</span>
              <span className="mt-1 block normal-case tracking-normal">yangpboy@gmail.com</span>
            </div>
            <a
              href="/admin"
              className="mt-7 inline-flex w-full items-center justify-between bg-light-ink px-5 py-4 font-mono text-xs font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-1 hover:bg-light-coral focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-light-coral/40 dark:bg-white dark:text-light-ink dark:hover:bg-light-coral dark:hover:text-white"
            >
              Continue securely <ArrowRight size={18} />
            </a>
            <p className="mt-4 text-center font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-light-ink/40 dark:text-white/40">
              No password is stored by this website
            </p>
          </div>
        </section>

        <footer className="flex items-center justify-between border-t-2 border-light-ink pt-4 font-mono text-[9px] font-black uppercase tracking-[0.14em] dark:border-white md:text-[10px]">
          <span>Portfolio editor</span>
          <span>Cloudflare Access + D1 + R2</span>
        </footer>
      </div>
    </main>
  );
}
