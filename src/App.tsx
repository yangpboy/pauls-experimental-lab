/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'framer-motion';
import { lazy, Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { X, Share2, ArrowUpRight, Heart, ChevronLeft, ChevronRight, BookOpen, ArrowDown, Menu } from 'lucide-react';
import LazyImage from './components/LazyImage';
import { GARAGE_POSTS, parseGarageDate } from './data/garage';
import type { GaragePost } from './data/garage';

const PlasterModel3D = lazy(() => import('./components/PlasterModel3D'));
const LowPerformanceHead = lazy(() => import('./components/LowPerformanceHead'));

const SHOW_SKETCHBOOK = false;

const SKETCHBOOK_PAGES = [
  {
    title: 'Form Study',
    date: 'Sketch 01',
    image: '/works/tube/tube (1).jpg',
    note: 'Volume, silhouette, and front-face proportion exploration.',
  },
  {
    title: 'Detail Pass',
    date: 'Sketch 02',
    image: '/works/tube/tube (2).jpg',
    note: 'Control details and material transition ideas.',
  },
  {
    title: 'Invisible Senses',
    date: 'Sketch 03',
    image: '/works/invisible/invisible (2).jpg',
    note: 'Early sensory interaction and object relationship mapping.',
  },
  {
    title: 'Interaction Flow',
    date: 'Sketch 04',
    image: '/works/invisible/invisible (4).jpg',
    note: 'How touch, feedback, and physical behavior connect.',
  },
  {
    title: 'Tini Structure',
    date: 'Sketch 05',
    image: '/works/tini/tini main (1).png',
    note: 'Balance, support nodes, and stone posture iteration.',
  },
  {
    title: 'Portfolio Notes',
    date: 'Sketch 06',
    image: '/works/portfolio/2025portfolio (6).jpg',
    note: 'Presentation rhythm and project storytelling draft.',
  },
];

const getDefaultLikes = (id: number) => 20 + ((id * 37) % 100);

// Reusable component for scroll reveal animations
const FadeIn = ({ children, delay = 0, direction = 'up', className = '' }: { children: React.ReactNode, delay?: number, direction?: 'up' | 'left' | 'right', className?: string }) => {
  const directions = {
    up: { y: 40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// PO Page Component for Paul's Info
const POPage = ({ 
  theme
}: { 
  theme: 'dark' | 'light';
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const timelinePosts = useMemo(
    () => [...GARAGE_POSTS].sort((a, b) => parseGarageDate(a.date) - parseGarageDate(b.date)),
    []
  );

  return (
    <div className={`w-full min-h-screen relative z-10 transition-colors ${theme === 'dark' ? 'bg-[#111111] text-white' : 'bg-white text-[#333333]'}`}>
      {/* Top Section: Split View */}
      <div className="flex flex-col md:flex-row min-h-screen w-full relative z-10">
            {/* Left: Image & Name */}
            <div className="w-full md:w-1/2 h-[40vh] md:h-screen md:sticky top-0 relative overflow-hidden">
              <img 
                src="/115.jpg" 
                alt="Paul Yang" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16">
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="font-mono text-5xl md:text-8xl font-black text-white tracking-normal relative z-20"
                >
                  PO-YU<br/>YANG
                </motion.h2>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/70 mt-4 font-mono text-sm tracking-widest uppercase relative z-20"
                >
                  Industrial Designer & Researcher
                </motion.p>
              </div>
            </div>

            {/* Right: Content */}
            <div className={`w-full md:w-1/2 min-h-screen flex flex-col justify-end relative z-20 transition-colors ${theme === 'dark' ? 'bg-[#111111]' : 'bg-white'}`}>
              <div className="p-8 md:p-16 lg:p-24 max-w-2xl mx-auto flex flex-col min-h-full justify-end pb-8 md:pb-16">
              
              <FadeIn delay={0.2}>
                <div className="space-y-12">
                  {/* Intro */}
                  <div>
                    <h3 className={`text-2xl md:text-3xl font-light leading-tight mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      Bridging the gap between <span className="font-medium italic">engineering precision</span> and <span className="font-medium italic">artistic expression</span>.
                    </h3>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-8 py-8 border-y border-current/10">
                    <div>
                      <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 ${theme === 'dark' ? 'text-white/50' : 'text-black/50'}`}>Based In</h4>
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Taiwan & Germany</p>
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 ${theme === 'dark' ? 'text-white/50' : 'text-black/50'}`}>Education</h4>
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>National Taiwan Normal University</p>
                    </div>
                    <div className="col-span-2">
                      <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 ${theme === 'dark' ? 'text-white/50' : 'text-black/50'}`}>Focus Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Industrial Design', 'User Research', 'UI/UX', 'Prototyping'].map(skill => (
                          <span key={skill} className={`px-3 py-1 text-xs rounded-full border ${theme === 'dark' ? 'border-white/20 text-white/80' : 'border-black/20 text-black/80'}`}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className={`space-y-6 text-base md:text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p>
                      With a background shaped by both engineering and art, I bring a unique perspective that balances craftsmanship, creativity, and human-centered experiences.
                    </p>
                    <p>
                      My journey from Taiwan to Germany has broadened my view of how products, users, and environments connect across cultures. I believe that design is not just about problem-solving; it's about enriching life by offering more possibilities and choices.
                    </p>
                  </div>
                </div>
              </FadeIn>

              {/* Footer Actions */}
              <FadeIn delay={0.4}>
                <div className="mt-16 pt-8 border-t border-current/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                  <a 
                    href="https://drive.google.com/file/d/1YCm8B_nR_XCcjIx8Nl5gYHuGUAXYI5Mx/view?usp=drive_link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-3 px-8 py-4 rounded-full border transition-all ${theme === 'dark' ? 'border-white/20 hover:bg-white text-white hover:text-black' : 'border-black/20 hover:bg-black text-black hover:text-white'}`}
                  >
                    <span className="text-sm font-bold tracking-widest uppercase">View Resume</span>
                    <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>

                  <div className={`flex gap-6 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <a href="https://www.linkedin.com/in/paul-yang-b2755329a" target="_blank" rel="noreferrer" className="hover:text-current transition-colors underline underline-offset-4 decoration-1">LinkedIn</a>
                    <a href="mailto:YangPBoy@gmail.com" className="hover:text-current transition-colors underline underline-offset-4 decoration-1">Email</a>
                    <a href="https://www.instagram.com/yangpboy?igsh=MTh0ZXpmaXN3dzF1Mw%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="hover:text-current transition-colors underline underline-offset-4 decoration-1">Instagram</a>
                  </div>
                </div>
              </FadeIn>

            </div>
          </div>
          </div>

          {/* Bottom Section: WHAT I DO & My Works */}
          <div className={`w-full py-24 px-8 transition-colors md:px-24 ${theme === 'dark' ? 'bg-[#111111]' : 'bg-white'}`}>
            <div className="relative z-10 w-full pb-24">
              <FadeIn>
                <h2 className={`font-mono text-4xl md:text-8xl font-black tracking-normal mb-12 md:mb-16 ${theme === 'light' ? 'text-light-coral' : ''}`}>
                  WHAT<br/>I DO
                </h2>
              </FadeIn>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                <FadeIn delay={0.2}>
                  <div className={`border p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] transition-all group h-full ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5 hover:border-light-teal/50' : 'glass hover:border-light-teal'}`}>
                    <h3 className={`font-mono text-2xl md:text-3xl font-bold mb-4 md:mb-6 transition-colors ${theme === 'dark' ? 'group-hover:text-light-teal' : 'text-light-ink group-hover:text-light-teal'}`}>DESIGN</h3>
                    <p className={`mb-6 md:mb-8 leading-relaxed text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-light-ink/70'}`}>
                      Crafting intuitive user interfaces and engaging user experiences with a focus on aesthetics.
                    </p>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {['UI/UX', 'Figma', 'Interaction', '3D Modeling'].map(tech => (
                        <span key={tech} className={`px-2 py-1 text-xs rounded-md ${theme === 'dark' ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-600'}`}>{tech}</span>
                      ))}
                    </div>
                  </div>
                </FadeIn>
                <FadeIn delay={0.4}>
                  <div className={`border p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] transition-all group h-full ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5 hover:border-light-coral/50' : 'glass hover:border-light-coral'}`}>
                    <h3 className={`font-mono text-2xl md:text-3xl font-bold mb-4 md:mb-6 transition-colors ${theme === 'dark' ? 'group-hover:text-light-coral' : 'text-light-ink group-hover:text-light-coral'}`}>RESEARCH</h3>
                    <p className={`mb-6 md:mb-8 leading-relaxed text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-light-ink/70'}`}>
                      Conducting in-depth user research and usability testing to uncover insights that drive meaningful design decisions.
                    </p>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {['User Research', 'Usability Testing', 'Data Analysis', 'Field Study'].map(tech => (
                        <span key={tech} className={`px-2 py-1 text-xs rounded-md ${theme === 'dark' ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-600'}`}>{tech}</span>
                      ))}
                    </div>
                  </div>
                </FadeIn>
                <FadeIn delay={0.6}>
                  <div className={`border p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] transition-all group h-full ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5 hover:border-light-yellow/50' : 'glass hover:border-light-yellow'}`}>
                    <h3 className={`font-mono text-2xl md:text-3xl font-bold mb-4 md:mb-6 transition-colors ${theme === 'dark' ? 'group-hover:text-light-yellow' : 'text-light-ink group-hover:text-light-yellow'}`}>EXERCISE</h3>
                    <p className={`mb-6 md:mb-8 leading-relaxed text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-light-ink/70'}`}>
                      Exercising every day is good for your physical and mental health.
                    </p>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {['Basketball', 'Table Tennis', 'Badminton', 'Cycling', 'Jogging', 'Mountain Climbing', 'Swimming'].map(tech => (
                        <span key={tech} className={`px-2 py-1 text-xs rounded-md ${theme === 'dark' ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-600'}`}>{tech}</span>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              </div>

              <FadeIn>
                <h2 className={`font-mono text-4xl md:text-7xl font-black tracking-normal mb-12 md:mb-16 ${theme === 'light' ? 'text-light-coral' : ''}`}>My Works</h2>
              </FadeIn>
              
              <div className="relative w-screen left-1/2 -translate-x-1/2 mt-12 md:mt-24">
                {/* Background Layer (shorter than content to create breakout effect) */}
                <div className={`absolute top-16 bottom-16 md:top-48 md:bottom-48 left-0 right-0 ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#f5f5f5]'}`}
                     style={{ backgroundImage: theme === 'dark' ? 'radial-gradient(#333 1px, transparent 1px)' : 'radial-gradient(#ccc 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                <div 
                  ref={scrollContainerRef}
                  className="hide-scrollbar relative overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing"
                  onMouseDown={(e) => {
                    isDragging.current = true;
                    if (scrollContainerRef.current) {
                      startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
                      scrollLeft.current = scrollContainerRef.current.scrollLeft;
                    }
                  }}
                  onMouseLeave={() => {
                    isDragging.current = false;
                  }}
                  onMouseUp={() => {
                    isDragging.current = false;
                  }}
                  onMouseMove={(e) => {
                    if (!isDragging.current || !scrollContainerRef.current) return;
                    e.preventDefault();
                    const x = e.pageX - scrollContainerRef.current.offsetLeft;
                    const walk = (x - startX.current) * 1.5;
                    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
                  }}
                >
                  <div className="relative flex items-center min-w-max px-8 md:px-24 h-[600px] md:h-[900px] gap-12 md:gap-24">
                    
                    {/* Central Tech Line (Horizontal) */}
                    <div className={`absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 ${theme === 'dark' ? 'bg-white/20' : 'bg-black/20'}`} />
                    
                    {timelinePosts.map((post, i) => {
                      const isEven = i % 2 === 0;
                      
                      return (
                        <div key={post.id} className="relative w-[280px] md:w-[350px] h-full flex-shrink-0 group">
                          
                          {/* Tech Node */}
                          <div className="absolute top-1/2 left-1/2 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 z-10">
                            <div className={`w-3 h-3 md:w-4 md:h-4 rotate-45 border-2 transition-all duration-300 group-hover:scale-150 group-hover:bg-light-coral ${theme === 'dark' ? 'bg-[#0a0a0a] border-light-coral' : 'bg-[#f5f5f5] border-light-coral'}`} />
                          </div>

                          {/* Date & Location */}
                          <div className={`absolute left-0 w-full flex flex-col items-center z-10 transition-transform duration-500 ${isEven ? 'bottom-[calc(50%+2rem)] group-hover:-translate-y-2' : 'top-[calc(50%+2rem)] group-hover:translate-y-2'}`}>
                            <FadeIn delay={i * 0.1}>
                              <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border ${theme === 'dark' ? 'bg-black/50 border-white/10' : 'bg-white/50 border-black/10'} backdrop-blur-sm`}>
                                <span className="w-2 h-2 rounded-full bg-light-coral animate-pulse" />
                                <span className={`font-mono text-xl md:text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                                  {post.date}
                                </span>
                              </div>
                              {post.location && (
                                <span className={`block text-center text-xs mt-3 font-mono tracking-widest uppercase ${theme === 'dark' ? 'text-white/50' : 'text-black/50'}`}>
                                  // {post.location}
                                </span>
                              )}
                            </FadeIn>
                          </div>
                          
                          {/* Content Card */}
                          <div className={`absolute left-0 w-full z-10 transition-transform duration-500 ${isEven ? 'top-[calc(50%+2rem)] group-hover:translate-y-2' : 'bottom-[calc(50%+2rem)] group-hover:-translate-y-2'}`}>
                            <FadeIn delay={i * 0.1 + 0.1}>
                              <div 
                                className={`overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 ${theme === 'dark' ? 'bg-[#111] border-white/10 shadow-black/50' : 'bg-white border-black/10 shadow-black/5'}`}
                               >
                                <div className="relative w-full aspect-video overflow-hidden border-b border-inherit">
                                  <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    draggable={false}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                  <div className="absolute top-3 right-3 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-widest bg-black/70 text-white rounded backdrop-blur-md">
                                    {post.caption || 'PROJECT'}
                                  </div>
                                </div>
                                <div className="p-5 md:p-6">
                                  <h3 className={`font-mono text-xl md:text-2xl font-black mb-2 uppercase tracking-normal ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{post.title}</h3>
                                  <p className={`text-sm leading-relaxed line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{post.description}</p>
                                </div>
                              </div>
                            </FadeIn>
                          </div>

                          {/* Connecting Line (Node to Card/Date) */}
                          <div className={`absolute left-1/2 w-px -translate-x-1/2 z-0 ${theme === 'dark' ? 'bg-white/20' : 'bg-black/20'} ${isEven ? 'top-1/2 bottom-[calc(50%+2rem)]' : 'bottom-1/2 top-[calc(50%+2rem)]'}`} />
                          <div className={`absolute left-1/2 w-px -translate-x-1/2 z-0 ${theme === 'dark' ? 'bg-white/20' : 'bg-black/20'} ${isEven ? 'bottom-1/2 top-[calc(50%+2rem)]' : 'top-1/2 bottom-[calc(50%+2rem)]'}`} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>
  );
};

const SketchbookSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = SKETCHBOOK_PAGES.length;
  const leftPage = SKETCHBOOK_PAGES[currentPage];
  const rightPage = SKETCHBOOK_PAGES[currentPage + 1] ?? null;

  const turnBackward = () => {
    setCurrentPage((page) => Math.max(0, page - 2));
  };

  const turnForward = () => {
    setCurrentPage((page) => Math.min(totalPages - 1, page + 2));
  };

  return (
    <section id="sketchbook" className="relative overflow-hidden bg-[#f7f2e8] px-4 py-20 text-[#231f1a] md:px-12 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3 font-mono text-xs font-black uppercase tracking-[0.24em] text-[#9b4b22]">
              <BookOpen size={18} />
              Sketchbook
            </div>
            <h2 className="font-mono text-4xl font-black uppercase leading-none tracking-normal md:text-7xl">
              Flip Through<br />the Drafts
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={turnBackward}
              disabled={currentPage === 0}
              aria-label="Previous sketch pages"
              className="grid h-12 w-12 place-items-center border border-light-ink bg-white text-light-ink shadow-[4px_4px_0_#2B2B2B] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
            >
              <ChevronLeft size={22} />
            </button>
            <div className="min-w-24 bg-[#231f1a] px-4 py-3 text-center font-mono text-sm font-black text-white">
              {currentPage + 1}-{Math.min(currentPage + 2, totalPages)} / {totalPages}
            </div>
            <button
              type="button"
              onClick={turnForward}
              disabled={currentPage >= totalPages - 2}
              aria-label="Next sketch pages"
              className="grid h-12 w-12 place-items-center border border-light-ink bg-white text-light-ink shadow-[4px_4px_0_#2B2B2B] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl [perspective:1800px]">
          <div className="absolute left-1/2 top-7 hidden h-[calc(100%-3.5rem)] w-8 -translate-x-1/2 rounded-full bg-black/20 blur-xl md:block" />
          <div className="relative grid min-h-[560px] grid-cols-1 border border-light-ink bg-light-gray p-3 shadow-[14px_18px_0_rgba(43,43,43,0.24)] md:grid-cols-2 md:p-5">
            {[leftPage, rightPage].filter(Boolean).map((page, index) => {
              const pageSide = index === 0 ? 'left' : 'right';

              return (
                <motion.article
                  key={`${page!.title}-${currentPage}`}
                  initial={{ rotateY: pageSide === 'left' ? -10 : 10, opacity: 0.6 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className={`relative flex min-h-[530px] flex-col overflow-hidden bg-white p-4 shadow-inner md:min-h-[660px] md:p-7 ${
                    pageSide === 'left' ? 'md:origin-right md:border-r md:border-black/20' : 'md:origin-left'
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-35 mix-blend-multiply [background-image:linear-gradient(rgba(35,31,26,0.08)_1px,transparent_1px)] [background-size:100%_28px]" />
                  <div className="relative z-10 flex items-center justify-between border-b border-black/20 pb-4 font-mono text-xs font-black uppercase tracking-[0.18em] text-black/55">
                    <span>{page!.date}</span>
                    <span>{String(currentPage + index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="relative z-10 my-5 flex flex-1 items-center justify-center overflow-hidden border border-black/20 bg-white">
                    <img
                      src={page!.image}
                      alt={page!.title}
                      className="h-full max-h-[450px] w-full object-contain p-3 mix-blend-multiply md:max-h-[520px]"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="relative z-10 border-t border-black/20 pt-5">
                    <h3 className="font-mono text-2xl font-black uppercase leading-none tracking-normal md:text-4xl">
                      {page!.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-sm font-medium leading-7 text-black/65 md:text-base">
                      {page!.note}
                    </p>
                  </div>
                </motion.article>
              );
            })}
            {!rightPage && (
              <div className="hidden min-h-[660px] bg-white shadow-inner md:block" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [activePage, setActivePage] = useState<'head' | 'garage' | 'sketchbook' | 'about'>('head');
  const [activeGarageCategory, setActiveGarageCategory] = useState('All');
  const [headRenderMode, setHeadRenderMode] = useState<'normal' | 'low'>('normal');
  const [colorMode, setColorMode] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';

    try {
      const savedMode = window.localStorage.getItem('color-mode');
      if (savedMode === 'light' || savedMode === 'dark') return savedMode;
    } catch {
      // Storage can be unavailable in strict browser/privacy contexts.
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [language, setLanguage] = useState<'zh' | 'en'>('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedGaragePost, setSelectedGaragePost] = useState<GaragePost | null>(null);
  const [projectLikes, setProjectLikes] = useState(0);
  const [isProjectLiked, setIsProjectLiked] = useState(false);

  const theme = colorMode;
  const themeToggleIcon = colorMode === 'light' ? '/icons/B_ dark.png' : '/icons/W_ light.png';
  const text = language === 'zh'
    ? {
      head: '首頁',
      garage: '車庫',
      about: '關於',
      dark: '暗',
      light: '亮',
      normalMode: '一般模式',
      lowMode: '低效能模式',
      loadingHead: '載入頭像',
      garageSubtitle: 'Paul 的實驗檔案',
      categories: '分類',
      sketchTitle: 'Sketchbook',
      sketchCategory: 'Sketch',
      sketchDescription: '草圖、形式研究與正在發展中的概念練習。',
      readMore: 'Read More',
      linkGarage: 'Link to Garage',
    }
    : {
      head: 'Head',
      garage: 'Garage',
      about: 'About',
      dark: 'Dark',
      light: 'Light',
      normalMode: 'Normal',
      lowMode: 'Low',
      loadingHead: 'Loading head',
      garageSubtitle: "Paul's experimental archive",
      categories: 'Categories',
      sketchTitle: 'Sketchbook',
      sketchCategory: 'Sketch',
      sketchDescription: 'Sketches, form studies, and developing concept exercises.',
      readMore: 'Read More',
      linkGarage: 'Link to Garage',
    };

  const garagePosts = useMemo(
    () => [...GARAGE_POSTS].sort((a, b) => parseGarageDate(b.date) - parseGarageDate(a.date)),
    []
  );

  const garageCategories = useMemo(
    () => [
      'All',
      ...(SHOW_SKETCHBOOK ? ['Sketch'] : []),
      ...Array.from(new Set(garagePosts.map((post) => post.category || 'Uncategorized'))),
    ],
    [garagePosts]
  );

  const filteredGaragePosts = useMemo(
    () => activeGarageCategory === 'All'
      ? garagePosts
      : garagePosts.filter((post) => (post.category || 'Uncategorized') === activeGarageCategory),
    [activeGarageCategory, garagePosts]
  );
  const navItems = [
    { label: text.head, page: 'head' as const },
    { label: text.garage, page: 'garage' as const },
    { label: text.about, page: 'about' as const },
  ];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', colorMode === 'dark');
    document.documentElement.style.colorScheme = colorMode;

    try {
      window.localStorage.setItem('color-mode', colorMode);
    } catch {
      // Theme switching should still work when persistence is blocked.
    }
  }, [colorMode]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const navigateToPage = (page: 'head' | 'garage' | 'sketchbook' | 'about') => {
    setIsMobileMenuOpen(false);
    setActivePage(page);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
  };

  const openGaragePost = (post: GaragePost) => {
    const storedData = localStorage.getItem(`garage_post_${post.id}`);

    if (storedData) {
      const parsed = JSON.parse(storedData);
      setProjectLikes(parsed.likes || 0);
      setIsProjectLiked(parsed.isLiked || false);
    } else {
      setProjectLikes(getDefaultLikes(post.id));
      setIsProjectLiked(false);
    }

    setSelectedGaragePost(post);
  };

  const handleLikeProject = () => {
    if (!selectedGaragePost) return;

    const newIsLiked = !isProjectLiked;
    const newLikes = newIsLiked ? projectLikes + 1 : projectLikes - 1;

    setIsProjectLiked(newIsLiked);
    setProjectLikes(newLikes);

    const storedData = localStorage.getItem(`garage_post_${selectedGaragePost.id}`);
    const parsed = storedData ? JSON.parse(storedData) : {};

    localStorage.setItem(`garage_post_${selectedGaragePost.id}`, JSON.stringify({
      ...parsed,
      likes: newLikes,
      isLiked: newIsLiked,
    }));
  };

  const handleGarageShare = async (post: GaragePost) => {
    const shareData = {
      title: post.title,
      text: post.caption,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${post.title} - ${post.caption}\n${window.location.href}`);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-light-gray text-light-ink font-sans selection:bg-light-teal/40 dark:bg-[#111111] dark:text-white">
      <nav className="pointer-events-none fixed left-0 right-0 top-0 z-[120] flex items-start justify-between gap-4 px-4 py-4 md:px-12 md:py-9">
        <button
          onClick={() => navigateToPage('head')}
          className="pointer-events-auto max-w-[58vw] bg-white px-3 py-2 text-left font-mono text-[11px] font-black uppercase leading-none tracking-normal shadow-sm transition-transform hover:-translate-y-0.5 dark:bg-[#111111] dark:text-white sm:max-w-none sm:text-base md:px-6 md:py-2.5 md:text-2xl"
        >
          Paul's Experimental Lab
        </button>

        <div className="pointer-events-auto hidden shrink-0 items-center gap-5 md:flex">
          <div className="flex items-center gap-6 font-mono text-3xl uppercase leading-none">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => navigateToPage(item.page)}
                className={`bg-white px-2 py-1 decoration-2 underline-offset-8 transition hover:-translate-y-0.5 hover:text-light-coral dark:bg-[#111111] md:px-3 md:py-1.5 ${
                  activePage === item.page
                    ? 'text-light-coral underline decoration-light-coral dark:text-light-coral'
                    : 'text-light-ink no-underline dark:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setColorMode((mode) => (mode === 'light' ? 'dark' : 'light'))}
              className="grid h-10 w-10 place-items-center transition hover:-translate-y-0.5"
              aria-label={colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              <img
                src={themeToggleIcon}
                alt=""
                className="h-7 w-7 object-contain"
              />
            </button>
            <button
              type="button"
              onClick={() => setLanguage((mode) => (mode === 'en' ? 'zh' : 'en'))}
              className="bg-white px-2 py-1 font-mono text-lg font-black uppercase leading-none transition hover:-translate-y-0.5 hover:text-light-coral dark:bg-[#111111] md:px-3 md:py-1.5"
            >
              {language === 'en' ? '中' : 'EN'}
            </button>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="grid h-11 w-11 place-items-center border-2 border-light-ink bg-white text-light-ink shadow-sm transition hover:text-light-coral dark:border-white dark:bg-[#111111] dark:text-white"
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div
          className={`pointer-events-auto absolute left-4 right-4 top-[68px] border-2 border-light-ink bg-white p-4 shadow-[8px_8px_0_rgba(43,43,43,0.22)] dark:border-white dark:bg-[#111111] md:hidden ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="flex flex-col gap-3 font-mono text-3xl uppercase leading-none">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => navigateToPage(item.page)}
                className={`text-left decoration-2 underline-offset-8 transition hover:text-light-coral ${
                  activePage === item.page
                    ? 'text-light-coral underline decoration-light-coral'
                    : 'text-light-ink no-underline dark:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t-2 border-light-ink pt-4 font-mono text-sm font-black uppercase dark:border-white">
            <span>{language === 'en' ? 'Mode' : '模式'}</span>
            <button
              type="button"
              onClick={() => setColorMode((mode) => (mode === 'light' ? 'dark' : 'light'))}
              className="grid h-10 w-10 place-items-center transition hover:-translate-y-0.5"
              aria-label={colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              <img
                src={themeToggleIcon}
                alt=""
                className="h-7 w-7 object-contain"
              />
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between font-mono text-sm font-black uppercase">
            <span>{language === 'en' ? 'Language' : '語言'}</span>
            <button
              type="button"
              onClick={() => setLanguage((mode) => (mode === 'en' ? 'zh' : 'en'))}
              className="border-2 border-light-ink px-4 py-2 transition hover:-translate-y-0.5 hover:text-light-coral dark:border-white"
            >
              {language === 'en' ? '中' : 'EN'}
            </button>
          </div>
        </div>
      </nav>

      <div className="fixed left-5 top-1/2 z-[80] hidden -translate-y-1/2 flex-col items-center justify-center gap-5 md:flex">
        {[
          { name: 'Instagram', icon: '/icons/B_ ig.png', href: 'https://www.instagram.com/yangpboy?igsh=MTh0ZXpmaXN3dzF1Mw%3D%3D&utm_source=qr' },
          { name: 'LinkedIn', icon: '/icons/B_ linkedln.png', href: 'https://www.linkedin.com/in/paul-yang-b2755329a' },
          { name: 'Behance', icon: '/icons/B_ behance.png', href: 'https://www.behance.net/paulyang10' },
          { name: 'Email', icon: '/icons/B_ mail.png', href: 'mailto:yangpboy02@gmail.com' },
        ].map((social) => (
          <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="group flex items-center transition-transform hover:-translate-y-1">
            <img src={social.icon} alt={social.name} className="h-8 w-8 object-contain dark:invert" />
          </a>
        ))}
      </div>

      {activePage === 'head' && (
        <>
          <section id="head" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-white dark:bg-[#111111]">
            <div className="absolute inset-0 flex items-center justify-center px-0 pt-14 sm:px-6 md:pt-20">
              <div className="h-[74svh] min-h-[500px] w-screen max-w-none sm:h-[70svh] md:h-[76vh] md:min-h-[560px] md:w-[96vw] md:max-w-[1120px]">
                <Suspense
                  fallback={
                    <div className="flex h-full w-full items-center justify-center font-mono text-sm font-black uppercase tracking-normal text-light-ink/50 dark:text-white/50">
                      {text.loadingHead}
                    </div>
                  }
                >
                  {headRenderMode === 'normal' ? (
                    <PlasterModel3D
                      theme={theme}
                      onAboutClick={() => navigateToPage('about')}
                    />
                  ) : (
                    <LowPerformanceHead
                      theme={theme}
                      onAboutClick={() => navigateToPage('about')}
                    />
                  )}
                </Suspense>
              </div>
            </div>
            <div className="absolute bottom-6 right-5 z-30 flex items-center gap-3 bg-white px-3 py-2 font-mono text-xs font-black uppercase text-light-ink shadow-sm dark:bg-[#111111] dark:text-white md:bottom-8 md:right-10 md:text-sm">
              <span className={headRenderMode === 'normal' ? 'text-light-coral' : 'text-light-ink/45 dark:text-white/45'}>
                {text.normalMode}
              </span>
              <button
                type="button"
                aria-label="Toggle low performance mode"
                aria-pressed={headRenderMode === 'low'}
                onClick={() => setHeadRenderMode((mode) => (mode === 'normal' ? 'low' : 'normal'))}
                className={`relative h-7 w-14 rounded-full border-2 border-light-ink transition dark:border-white ${
                  headRenderMode === 'low' ? 'bg-light-coral' : 'bg-white dark:bg-[#111111]'
                }`}
              >
                <span
                  className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-light-ink transition dark:bg-white ${
                    headRenderMode === 'low' ? 'left-[30px]' : 'left-1'
                  }`}
                />
              </button>
              <span className={headRenderMode === 'low' ? 'text-light-coral' : 'text-light-ink/45 dark:text-white/45'}>
                {text.lowMode}
              </span>
            </div>
          </section>

          <section id="lab" className="relative z-10 flex min-h-[100svh] items-center justify-center bg-white px-6 py-24 text-center dark:bg-[#111111] md:px-16">
            <div className="max-w-4xl">
              <h1 className="font-mono text-2xl font-black uppercase tracking-normal md:text-4xl">
                Paul's Experimental Lab
              </h1>
              <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-5 text-sm font-medium leading-7 text-neutral-700 dark:text-white/75 md:mt-10 md:gap-7 md:text-base md:leading-8">
                <p>
                  Paul's Experimental Lab is the creative sanctuary of designer PO-YU YANG. Beyond a traditional portfolio, it is a dynamic testing ground for his explorations in product, service, and visual design. Through a collection of demos and beta concepts, Paul invites you to join a journey of raw discovery: to dare the attempt, to embrace the failure, and to experience the profound essence of life through design.
                </p>
                <p className="text-xs leading-6 text-neutral-600 dark:text-white/65 md:text-sm md:leading-7">
                  Paul's Experimental Lab 是設計師楊博宇的個人作品網站兼實驗平台，展示產品、服務、視覺設計及各式 Demo 與 Beta 版本。讓我們一起體驗嘗試、失敗與設計人生，水喔。
                </p>
                <p className="text-xs leading-6 text-neutral-600 dark:text-white/65 md:text-sm md:leading-7">
                  Pauls Experimental Lab ist der kreative Rückzugsort des Designers Paul Yang. Mehr als ein traditionelles Portfolio dient es als dynamisches Testfeld für seine Erkundungen in den Bereichen Produkt-, Service- und visuelles Design.
                </p>
              </div>
              <div className="group relative mx-auto mt-10 w-fit md:mt-12">
                <div className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-[calc(100%+0.75rem)] whitespace-nowrap rounded-full border-2 border-light-ink bg-white px-6 py-2 font-mono text-lg font-black uppercase text-light-ink opacity-0 shadow-[8px_8px_0_rgba(43,43,43,0.22)] transition group-hover:opacity-100 dark:border-white dark:bg-[#111111] dark:text-white">
                  {text.linkGarage}
                </div>
                <button
                  onClick={() => navigateToPage('garage')}
                  aria-label="Go to Garage"
                  className="grid h-12 w-12 place-items-center border-2 border-light-ink bg-white text-light-ink shadow-[5px_5px_0_rgba(43,43,43,0.22)] transition hover:-translate-y-1 hover:text-light-coral dark:border-white dark:bg-[#111111] dark:text-white md:h-14 md:w-14"
                >
                  <ArrowDown className="h-6 w-6" />
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {activePage === 'garage' && (
        <section id="garage" className="relative min-h-screen overflow-hidden bg-white px-5 pb-24 pt-28 dark:bg-[#111111] md:px-12 md:pt-36">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 grayscale mix-blend-multiply dark:opacity-20 dark:mix-blend-screen"
            style={{ backgroundImage: "url('/garage-bg.jpg')" }}
          />
          <div className="pointer-events-none absolute inset-0 bg-white/72 dark:bg-[#111111]/82" aria-hidden="true" />

          <div className="relative z-10 mx-auto max-w-[1480px]">
            <header className="pb-10 pt-2 text-center md:pb-16">
              <h1 className="font-sans text-[18vw] font-normal uppercase leading-[0.82] tracking-normal text-light-ink dark:text-white sm:text-[16vw] md:text-[12vw] lg:text-[9rem]">
                {text.garage}
              </h1>
              <p className="mt-5 font-mono text-xs font-black uppercase tracking-[0.28em] text-light-ink/55 dark:text-white/55 md:mt-7">
                {text.garageSubtitle}
              </p>
            </header>

            <div className="flex flex-col gap-4 border-y border-light-ink bg-white/70 py-5 backdrop-blur-sm dark:border-white dark:bg-[#111111]/70 md:flex-row md:items-center md:justify-between">
              <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-light-ink dark:text-white">
                {text.categories}
              </p>
              <div className="flex flex-wrap gap-2 md:justify-end">
                {garageCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveGarageCategory(category)}
                    className={`rounded-full border-2 px-4 py-1.5 font-mono text-xs font-black uppercase leading-none transition hover:-translate-y-0.5 ${
                      activeGarageCategory === category
                        ? 'border-light-ink bg-light-ink text-white dark:border-white dark:bg-white dark:text-light-ink'
                        : 'border-light-ink bg-white/90 text-light-ink hover:text-light-coral dark:border-white dark:bg-[#111111]/90 dark:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 border-l border-t border-light-ink dark:border-white sm:grid-cols-2 lg:grid-cols-3">
              {SHOW_SKETCHBOOK && (activeGarageCategory === 'All' || activeGarageCategory === 'Sketch') && (
                <button
                  onClick={() => navigateToPage('sketchbook')}
                  className="group flex min-h-[560px] flex-col border-b border-r border-light-ink bg-white/90 p-7 text-left backdrop-blur-[1px] transition hover:bg-white dark:border-white dark:bg-[#111111]/90 dark:hover:bg-[#111111] md:min-h-[620px] md:p-9"
                >
                  <div className="mb-6 flex items-center justify-between gap-4 font-mono text-xs font-medium text-light-ink/70 dark:text-white/70">
                    <span>Sketch 01</span>
                    <span className="rounded-full border border-light-ink px-3 py-1 text-[10px] font-black uppercase text-light-ink dark:border-white dark:text-white">
                      {text.sketchCategory}
                    </span>
                  </div>

                  <div className="aspect-[1.35] w-full overflow-hidden bg-light-gray">
                    <img
                      src={SKETCHBOOK_PAGES[0].image}
                      alt={text.sketchTitle}
                      className="h-full w-full object-cover object-center mix-blend-multiply transition duration-700 group-hover:scale-[1.04] dark:mix-blend-normal"
                      loading="eager"
                      decoding="async"
                    />
                  </div>

                  <div className="flex flex-1 flex-col pt-7">
                    <h2 className="font-sans text-2xl font-semibold leading-tight tracking-normal text-light-ink dark:text-white md:text-3xl">
                      {text.sketchTitle}
                    </h2>
                    <p className="mt-4 line-clamp-3 text-sm font-medium leading-7 text-light-ink/70 dark:text-white/65">
                      {text.sketchDescription}
                    </p>
                    <span className="mt-auto pt-8 font-mono text-xs font-black uppercase underline decoration-light-ink underline-offset-4 transition group-hover:text-light-coral group-hover:decoration-light-coral dark:decoration-white">
                      {text.readMore}
                    </span>
                  </div>
                </button>
              )}
              {filteredGaragePosts.map((post, index) => (
                <button
                  key={post.id}
                  onClick={() => openGaragePost(post)}
                  className="group flex min-h-[560px] flex-col border-b border-r border-light-ink bg-white/90 p-7 text-left backdrop-blur-[1px] transition hover:bg-white dark:border-white dark:bg-[#111111]/90 dark:hover:bg-[#111111] md:min-h-[620px] md:p-9"
                >
                  <div className="mb-6 flex items-center justify-between gap-4 font-mono text-xs font-medium text-light-ink/70 dark:text-white/70">
                    <span>{post.date}</span>
                    <span className="rounded-full border border-light-ink px-3 py-1 text-[10px] font-black uppercase text-light-ink dark:border-white dark:text-white">
                      {post.category || 'Project'}
                    </span>
                  </div>

                  <div className="aspect-[1.35] w-full overflow-hidden bg-light-gray">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.04]"
                      loading={index < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </div>

                  <div className="flex flex-1 flex-col pt-7">
                    <h2 className="font-sans text-2xl font-semibold leading-tight tracking-normal text-light-ink dark:text-white md:text-3xl">
                      {post.title}
                    </h2>
                    <p className="mt-4 line-clamp-3 text-sm font-medium leading-7 text-light-ink/70 dark:text-white/65">
                      {post.description || post.caption}
                    </p>
                    <span className="mt-auto pt-8 font-mono text-xs font-black uppercase underline decoration-light-ink underline-offset-4 transition group-hover:text-light-coral group-hover:decoration-light-coral dark:decoration-white">
                      {text.readMore}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {activePage === 'about' && (
        <section id="about" className="min-h-screen bg-white pt-20 transition-colors dark:bg-[#111111] md:pt-0">
          <POPage theme={theme} />
        </section>
      )}

      {SHOW_SKETCHBOOK && activePage === 'sketchbook' && (
        <div id="sketchbook" className="min-h-screen bg-white pt-20 md:pt-24">
          <SketchbookSection />
        </div>
      )}
      {/* Post Modal */}
      <AnimatePresence>
        {selectedGaragePost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-white dark:bg-[#050505] transition-all duration-300"
            onClick={() => setSelectedGaragePost(null)}
          >
            {/* Sidebar Controls (Behance Style) */}
            <div className="fixed right-2 md:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 md:gap-6 z-[230] items-center scale-75 md:scale-100 origin-right">
              <button 
                className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-white hover:text-light-coral transition-all hover:scale-110 shadow-lg"
                onClick={() => setSelectedGaragePost(null)}
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex flex-col gap-4 bg-neutral-100/80 dark:bg-neutral-800/80 backdrop-blur-md p-4 rounded-full shadow-xl border border-neutral-200 dark:border-neutral-700">
                <button 
                  className="p-3 rounded-full hover:bg-white dark:hover:bg-neutral-700 text-neutral-800 dark:text-white hover:text-light-coral transition-all group relative"
                  onClick={(e) => { e.stopPropagation(); handleGarageShare(selectedGaragePost); }}
                >
                  <Share2 className="w-5 h-5" />
                  <span className="absolute right-full mr-4 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">Share</span>
                </button>
                <button 
                  className={`p-3 rounded-full hover:bg-white dark:hover:bg-neutral-700 transition-all group relative ${isProjectLiked ? 'text-light-coral' : 'text-neutral-800 dark:text-white hover:text-light-coral'}`}
                  onClick={(e) => { e.stopPropagation(); handleLikeProject(); }}
                >
                  <Heart className="w-5 h-5" fill={isProjectLiked ? "currentColor" : "none"} />
                  <span className="absolute right-full mr-4 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                    {isProjectLiked ? 'Unlike' : 'Like'} ({projectLikes})
                  </span>
                </button>
              </div>
            </div>

            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full h-full flex flex-col gap-0 overflow-y-auto overscroll-none hide-scrollbar relative bg-white dark:bg-[#050505] transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gallery Section - Full Width (Moved to top) */}
              {selectedGaragePost.gallery && (
                <div className="w-full flex flex-col gap-0">
                  {/* Main Gallery Images */}
                  {selectedGaragePost.gallery.filter((img: string) => !img.includes('/pics/')).map((img: string, idx: number) => (
                    <LazyImage 
                      key={idx} 
                      src={img} 
                      alt={`${selectedGaragePost.title} image ${idx + 1}`} 
                      className="w-full h-auto block"
                      priority={idx < 2}
                    />
                  ))}
                  
                  {/* Small Pics Grid (3x2 for TINI or general grid) */}
                  {(selectedGaragePost.smallPics || selectedGaragePost.gallery.filter((img: string) => img.includes('/pics/'))).length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0">
                      {(selectedGaragePost.smallPics || selectedGaragePost.gallery.filter((img: string) => img.includes('/pics/'))).map((img: string, idx: number) => (
                        <LazyImage 
                          key={`small-${idx}`} 
                          src={img} 
                          alt={`${selectedGaragePost.title} detail ${idx + 1}`} 
                          className="w-full aspect-square object-cover block"
                        />
                      ))}
                    </div>
                  )}

                  {/* Bottom Gallery Images */}
                  {selectedGaragePost.galleryBottom && selectedGaragePost.galleryBottom.map((img: string, idx: number) => (
                    <LazyImage 
                      key={`bottom-${idx}`} 
                      src={img} 
                      alt={`${selectedGaragePost.title} bottom image ${idx + 1}`} 
                      className="w-full h-auto block"
                    />
                  ))}
                </div>
              )}
              
              {/* Project Content */}
              <div className="w-full bg-white dark:bg-[#050505] relative z-30">
                <div className="max-w-6xl mx-auto p-6 md:p-24">
                  <div className="prose dark:prose-invert max-w-none mb-12">
                    <div className="flex flex-col gap-12">
                      {/* Description Section */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        <div className="lg:col-span-2">
                          <p className="text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 leading-relaxed font-light">
                            {selectedGaragePost.description}
                          </p>
                        </div>
                        <div className="space-y-8 p-8 bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl border border-neutral-100 dark:border-neutral-800">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 mb-4">Project Info</h4>
                            <div className="space-y-4">
                              <div>
                                <span className="text-[10px] uppercase tracking-widest text-neutral-400">Date</span>
                                <p className="text-sm font-bold">
                                  {selectedGaragePost.date} {selectedGaragePost.location && `| ${selectedGaragePost.location}`}
                                </p>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase tracking-widest text-neutral-400">Category</span>
                                <p className="text-sm font-bold">{selectedGaragePost.category}</p>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase tracking-widest text-neutral-400">Author</span>
                                <p className="text-sm font-bold">{selectedGaragePost.author}</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 mb-4">Tools</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedGaragePost.tools?.map((tool: string) => (
                                <span key={tool} className="px-3 py-1 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-bold rounded-full border border-neutral-200 dark:border-neutral-700 uppercase tracking-widest">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
