/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useTransform, useMotionValue, useSpring, AnimatePresence, useScroll } from 'framer-motion';
import { useRef, useEffect, useState, useMemo } from 'react';
import { Github, Instagram, Linkedin, Mail, Twitter, ExternalLink, ChevronRight, X, Share2, Menu, ArrowUpRight, Heart } from 'lucide-react';

const BehanceIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M8.228 15.01h-2.228v-2.01h2.228c.552 0 1 .448 1 1s-.448 1-1 1zm0-4.02h-2.228v-2.01h2.228c.552 0 1 .448 1 1s-.448 1-1 1zm4.772-1.99h3v1h-3v-1zm1.5 2.5c1.104 0 2 .896 2 2h-4c0-1.104.896-2 2-2zm-8.5-5.5h4.5c1.933 0 3.5 1.567 3.5 3.5 0 1.134-.54 2.14-1.378 2.806.99.585 1.658 1.653 1.658 2.874 0 1.933-1.567 3.5-3.5 3.5h-4.78v-12.68zm10.5 7.5h-4.96c.153 1.411 1.343 2.5 2.78 2.5 1.258 0 2.316-.838 2.66-2h1.42c-.42 1.93-2.12 3.5-4.08 3.5-2.209 0-4-1.791-4-4s1.791-4 4-4c2.209 0 4 1.791 4 4z" />
  </svg>
);
import PlasterModelViewer from './components/PlasterModel';
import { useGLTF } from '@react-three/drei';

// Preload the model to prevent disappearing on remount
useGLTF.preload('/head02.glb');

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

// 3D Sphere Component removed as it is unused

// Removed Project interface, ProjectModal, and WorkCard

interface GaragePost {
  id: number;
  image: string;
  title: string;
  caption: string;
  date: string;
  location?: string;
  category?: string;
  likes?: string;
  comments?: string;
  views?: string;
  shares?: string;
  author?: string;
  tools?: string[];
  description?: string;
  gallery?: string[];
  smallPics?: string[];
  galleryBottom?: string[];
}

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

  return (
    <div className={`w-full min-h-screen relative z-10 ${theme === 'dark' ? 'text-white' : 'text-[#333333]'}`}>
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
                  className="text-5xl md:text-8xl font-black text-white tracking-tighter relative z-20"
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
            <div className="w-full md:w-1/2 min-h-screen flex flex-col justify-end relative z-20">
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
                    <span className="text-sm font-bold tracking-widest uppercase">View Résumé</span>
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
          <div className="w-full py-24 px-8 md:px-24">
            <div className="relative z-10 w-full pb-24">
              <FadeIn>
                <h2 className={`text-4xl md:text-8xl font-black tracking-tighter mb-12 md:mb-16 ${theme === 'light' ? 'font-display text-light-orange' : ''}`}>
                  WHAT<br/>I DO
                </h2>
              </FadeIn>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                <FadeIn delay={0.2}>
                  <div className={`border p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] transition-all group h-full ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5 hover:border-pink-500/50' : 'glass hover:border-light-yellow'}`}>
                    <h3 className={`text-2xl md:text-3xl font-bold mb-4 md:mb-6 transition-colors ${theme === 'dark' ? 'group-hover:text-pink-400' : 'font-display text-light-ink group-hover:text-light-yellow'}`}>DESIGN</h3>
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
                  <div className={`border p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] transition-all group h-full ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5 hover:border-purple-500/50' : 'glass hover:border-light-orange'}`}>
                    <h3 className={`text-2xl md:text-3xl font-bold mb-4 md:mb-6 transition-colors ${theme === 'dark' ? 'group-hover:text-purple-400' : 'font-display text-light-ink group-hover:text-light-orange'}`}>RESEARCH</h3>
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
                  <div className={`border p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] transition-all group h-full ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5 hover:border-orange-500/50' : 'glass hover:border-light-orange'}`}>
                    <h3 className={`text-2xl md:text-3xl font-bold mb-4 md:mb-6 transition-colors ${theme === 'dark' ? 'group-hover:text-orange-400' : 'font-display text-light-ink group-hover:text-light-orange'}`}>EXERCISE</h3>
                    <p className={`mb-6 md:mb-8 leading-relaxed text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-light-ink/70'}`}>
                      Exercising every day is good for your physical and mental health.👍
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
                <h2 className={`text-4xl md:text-7xl font-black tracking-tighter mb-12 md:mb-16 ${theme === 'light' ? 'font-display text-light-orange' : ''}`}>My Works</h2>
              </FadeIn>
              
              <div className="relative w-screen left-1/2 -translate-x-1/2 mt-12 md:mt-24">
                {/* Background Layer (shorter than content to create breakout effect) */}
                <div className={`absolute top-16 bottom-16 md:top-48 md:bottom-48 left-0 right-0 ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#f5f5f5]'}`}
                     style={{ backgroundImage: theme === 'dark' ? 'radial-gradient(#333 1px, transparent 1px)' : 'radial-gradient(#ccc 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                <div 
                  ref={scrollContainerRef}
                  className="relative overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing"
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
                    
                    {GARAGE_POSTS.slice().sort((a, b) => parseDate(a.date) - parseDate(b.date)).map((post, i) => {
                      const isEven = i % 2 === 0;
                      
                      return (
                        <div key={post.id} className="relative w-[280px] md:w-[350px] h-full flex-shrink-0 group">
                          
                          {/* Tech Node */}
                          <div className="absolute top-1/2 left-1/2 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 z-10">
                            <div className={`w-3 h-3 md:w-4 md:h-4 rotate-45 border-2 transition-all duration-300 group-hover:scale-150 group-hover:bg-orange-500 ${theme === 'dark' ? 'bg-[#0a0a0a] border-orange-500' : 'bg-[#f5f5f5] border-orange-500'}`} />
                          </div>

                          {/* Date & Location */}
                          <div className={`absolute left-0 w-full flex flex-col items-center z-10 transition-transform duration-500 ${isEven ? 'bottom-[calc(50%+2rem)] group-hover:-translate-y-2' : 'top-[calc(50%+2rem)] group-hover:translate-y-2'}`}>
                            <FadeIn delay={i * 0.1}>
                              <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border ${theme === 'dark' ? 'bg-black/50 border-white/10' : 'bg-white/50 border-black/10'} backdrop-blur-sm`}>
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
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
                                  <h3 className={`text-xl md:text-2xl font-black mb-2 uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{post.title}</h3>
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

const GARAGE_CATEGORIES = ['All', 'Product Design', 'Spatial Design', 'UI/UX', 'Portfolio'];

const GARAGE_POSTS = [
  { 
    id: 8, 
    image: '/works/portfolio/2025portfolio (1).jpg', 
    title: '2025 INDUSTRIAL DESIGN PORTFOLIO', 
    caption: 'A comprehensive collection of my industrial design works and explorations.', 
    date: '02.2025', 
    location: 'Taiwan',
    category: 'Portfolio', 
    likes: '2.1k', 
    comments: '45', 
    views: '15.2k', 
    shares: '120',
    author: 'Po-Yu Yang',
    tools: ['Industrial Design', 'Portfolio'],
    description: 'This portfolio showcases a curated selection of my industrial design projects, highlighting my journey, skills, and design philosophy.',
    gallery: Array.from({ length: 37 }, (_, i) => `/works/portfolio/2025portfolio (${i + 1}).jpg`),
    smallPics: [],
    galleryBottom: []
  },
  { 
    id: 7, 
    image: '/works/invisible/invisible (1).jpg', 
    title: 'Invisible Senses', 
    caption: 'Exploring the subtle and often overlooked sensory experiences in our daily lives.', 
    date: '09.2023~12.2023', 
    location: 'Taiwan',
    category: 'Product Design', 
    likes: '1.2k', 
    comments: '24', 
    views: '8.5k', 
    shares: '56',
    author: 'Po-Yu Yang',
    tools: ['Industrial Design', 'User Research'],
    description: 'Invisible Senses is a project that delves into the intangible aspects of human perception. By focusing on the senses that are often ignored, it aims to create a more profound connection between the user and their environment.',
    gallery: [
      '/works/invisible/invisible (1).jpg',
      '/works/invisible/invisible (2).jpg',
      '/works/invisible/invisible (3).jpg',
      '/works/invisible/invisible (4).jpg',
      '/works/invisible/invisible (5).jpg',
      '/works/invisible/invisible (6).jpg',
      '/works/invisible/invisible (7).jpg',
      '/works/invisible/invisible (8).jpg',
      '/works/invisible/invisible (9).jpg',
      '/works/invisible/invisible (10).jpg',
      '/works/invisible/invisible (11).jpg'
    ]
  },
  { 
    id: 9, 
    image: '/works/explo.11/cover.png', 
    title: '探索十一號 Explo.11', 
    caption: 'A comprehensive exploration of automotive design and digital portfolio presentation.', 
    date: '10.2024~04.2025', 
    location: 'Taiwan',
    category: 'Portfolio', 
    likes: '1.8k', 
    comments: '42', 
    views: '12.5k', 
    shares: '95',
    author: 'Po-Yu Yang, Chih-Huang Chou, Hsiao-Kuang Hsu',
    tools: ['Industrial Design', '3D Modeling', 'Visual Design'],
    description: 'Explo.11 is a deep dive into automotive aesthetics and the art of digital storytelling. This project showcases a series of car design studies, focusing on fluid forms, aerodynamic efficiency, and the integration of advanced materials.',
    gallery: [
      ...Array.from({ length: 15 }, (_, i) => `/works/explo.11/car portfolio (${i + 1}).jpg`)
    ]
  },
  { 
    id: 10, 
    image: '/works/tube/tube (1).jpg', 
    title: 'Tube Radio', 
    caption: 'Design Styling Practice', 
    date: '11.2023', 
    location: 'Taiwan',
    category: 'Product Design', 
    likes: '850', 
    comments: '12', 
    views: '5.2k', 
    shares: '34',
    author: 'Po-Yu Yang',
    tools: ['Industrial Design', '3D Modeling'],
    description: 'TUBE is a design project that reimagines the classic vacuum tube radio for a modern audience, blending vintage aesthetics with contemporary manufacturing techniques.',
    gallery: [
      '/works/tube/tube (1).jpg',
      '/works/tube/tube (2).jpg',
      '/works/tube/tube (3).jpg',
      '/works/tube/tube (4).jpg',
      '/works/tube/tube (5).jpg',
      '/works/tube/tube (6).jpg'
    ]
  },
  { 
    id: 4, 
    image: '/works/tini/cover.png', 
    title: 'DARK SIDE OF THE TINI', 
    caption: 'Treating stone (Tini) as the soulful protagonist of design.', 
    date: '10.2025~11.2025', 
    location: 'Deutschland',
    category: 'Product Design', 
    likes: '3.4k', 
    comments: '156', 
    views: '32.1k', 
    shares: '420',
    author: 'Po-Yu Yang and Nick Düchs',
    tools: ['Grasshopper', 'Computational Design', 'Prototyping'],
    description: 'DARK SIDE OF THE TINI, a collaborative project by Po-Yu Yang and Nick Düchs, centers on the vision of treating stone (Tini) as the soulful protagonist of design. Drawing inspiration from the Hizz rocking chair by Mentalla Said and Jumana Taha, the project emphasizes architectural geometry and material honesty. By simplifying all visual elements, the designers evoke an imagery of stones "floating" in space and emitting a celestial glow—a concept rooted in the moon, Jun\'ichirō Tanizaki’s In Praise of Shadows, and the interplay of light and shadow in early photography. Technically, the work demonstrates an advanced workflow integrating computational design with physical materiality. Utilizing Grasshopper, the designers precisely calculated the centroid of each stone and generated support nodes based on their unique silhouettes. Through iterative prototyping (from 01 to 04), they resolved stability issues, ultimately developing a dual-layer base that echoes the stone’s texture while balancing the structure.',
    gallery: [
      '/works/tini/tini main (1).png',
      '/works/tini/tini main (2).png'
    ],
    smallPics: [
      ...Array.from({ length: 6 }, (_, i) => `/works/tini/tini small pics (${i + 1}).png`)
    ],
    galleryBottom: [
      ...Array.from({ length: 19 }, (_, i) => `/works/tini/tini (${i + 1}).jpg`)
    ]
  }
];

const LazyImage: React.FC<{ src: string, alt: string, className?: string, priority?: boolean }> = ({ src, alt, className, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '1500px' } // Increased rootMargin significantly to load earlier
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center ${className} ${!isLoaded ? 'min-h-[300px] md:min-h-[500px]' : ''}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="w-8 h-8 border-4 border-neutral-300 dark:border-neutral-700 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto transition-all duration-700 ease-out relative z-10 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
          onLoad={() => setIsLoaded(true)}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
        />
      )}
    </div>
  );
};

const parseDate = (dateStr: string) => {
  if (!dateStr) return 0;
  const firstPart = dateStr.split(/[-~]/)[0].trim();
  if (firstPart.includes('/') || firstPart.includes('.')) {
    const parts = firstPart.split(/[./]/);
    if (parts.length === 2) {
      const month = parseInt(parts[0]);
      const year = parseInt(parts[1]);
      return new Date(year, month - 1).getTime();
    }
  }
  const d = new Date(firstPart);
  return isNaN(d.getTime()) ? 0 : d.getTime();
};

// Background Decorations Component
const BackgroundDecorations = ({ theme }: { theme: 'dark' | 'light' }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX1 = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY1 = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  const springX2 = useSpring(mouseX, { stiffness: 30, damping: 30 });
  const springY2 = useSpring(mouseY, { stiffness: 30, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Center the coordinates around the middle of the screen
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const glassClass = theme === 'dark' 
    ? 'backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]' 
    : 'backdrop-blur-xl bg-white/30 border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Center fixed glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-30 ${theme === 'dark' ? 'bg-orange-900' : 'bg-orange-200'}`} />
      
      {/* Interactive Glow 1 (Orange) */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[40vw] h-[40vw] -ml-[20vw] -mt-[20vw] rounded-full blur-[100px] opacity-50"
        style={{
          x: springX1,
          y: springY1,
          background: theme === 'dark' ? 'radial-gradient(circle, #ff8a00, transparent)' : 'radial-gradient(circle, #ffb347, transparent)'
        }}
      />

      {/* Interactive Glow 2 (Yellow/Orange) */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[30vw] h-[30vw] -ml-[15vw] -mt-[15vw] rounded-full blur-[80px] opacity-40"
        style={{
          x: springX2,
          y: springY2,
          background: theme === 'dark' ? 'radial-gradient(circle, #ffb347, transparent)' : 'radial-gradient(circle, #ffd000, transparent)'
        }}
      />

      {/* Frosted Glass Geometric Elements */}
      {/* Element 1: Floating Square */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 45, 90],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className={`absolute top-[15%] left-[15%] w-24 h-24 md:w-40 md:h-40 rounded-2xl ${glassClass}`}
      />

      {/* Element 2: Floating Circle */}
      <motion.div
        animate={{
          y: [0, 40, 0],
          x: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className={`absolute bottom-[20%] right-[10%] w-32 h-32 md:w-56 md:h-56 rounded-full ${glassClass}`}
      />

      {/* Element 3: Floating Pill */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [-15, 15, -15],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className={`absolute top-[40%] right-[20%] w-16 h-32 md:w-24 md:h-48 rounded-full ${glassClass}`}
      />
      
      {/* Element 4: Small Ring */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className={`absolute bottom-[30%] left-[20%] w-20 h-20 md:w-32 md:h-32 rounded-full border-[8px] md:border-[12px] ${theme === 'dark' ? 'border-white/10' : 'border-white/30'} backdrop-blur-md`}
      />
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'head' | 'po' | 'garage'>('head');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isContactActive, setIsContactActive] = useState(false);
  const [isContactZooming, setIsContactZooming] = useState(false);
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [isZooming, setIsZooming] = useState(false);
  const [isHoveringModel, setIsHoveringModel] = useState(false);
  const [aboutTextScale, setAboutTextScale] = useState(0.38);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Garage State
  const [garagePosts] = useState(GARAGE_POSTS);
  const [selectedGaragePost, setSelectedGaragePost] = useState<GaragePost | null>(null);
  const [activeGarageFilter, setActiveGarageFilter] = useState('All');
  const [garageSort, setGarageSort] = useState<'newest' | 'oldest'>('newest');
  const [projectLikes, setProjectLikes] = useState(0);
  const [isProjectLiked, setIsProjectLiked] = useState(false);

  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedGaragePost) {
      const storedData = localStorage.getItem(`garage_post_${selectedGaragePost.id}`);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProjectLikes(parsed.likes || 0);
        setIsProjectLiked(parsed.isLiked || false);
      } else {
        setProjectLikes(Math.floor(Math.random() * 100) + 20);
        setIsProjectLiked(false);
      }
    }
  }, [selectedGaragePost]);

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
      isLiked: newIsLiked
    }));
  };


  const filteredGaragePosts = useMemo(() => {
    const filtered = activeGarageFilter === 'All' ? garagePosts : garagePosts.filter(p => p.category === activeGarageFilter);
    return [...filtered].sort((a, b) => {
      const timeA = parseDate(a.date);
      const timeB = parseDate(b.date);
      return garageSort === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [garagePosts, activeGarageFilter, garageSort]);

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

  useEffect(() => {
    if (isIntroActive) {
      const zoomTimer = setTimeout(() => {
        setIsZooming(true);
      }, 2500);

      const endTimer = setTimeout(() => {
        setIsIntroActive(false);
        // Scroll to about section after intro
        setTimeout(() => {
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }, 4500);
      return () => {
        clearTimeout(zoomTimer);
        clearTimeout(endTimer);
      };
    }
  }, [isIntroActive]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const containerRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // const [currentSection, setCurrentSection] = useState<'hero' | 'about' | 'contact'>('hero');

  // useMotionValueEvent(scrollYProgress, "change", (latest) => {
  //   if (latest < 0.3) {
  //     setCurrentSection('hero');
  //   } else if (latest < 0.7) {
  //     setCurrentSection('about');
  //   } else {
  //     setCurrentSection('contact');
  //   }
  // });

  const contactScale = useTransform(scrollYProgress, [0.8, 1], [0.9, 1]);
  const contactOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
  const modelOpacity = 1;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  // Handle video playback when contact section becomes active
  useEffect(() => {
    let isMounted = true;
    if (videoRef.current) {
      if (isContactActive) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            if (e.name !== 'AbortError' && isMounted) {
              console.error("Video play failed:", e);
              setIsVideoEnded(true);
            }
          });
        }
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
    return () => {
      isMounted = false;
    };
  }, [isContactActive]);


  // Cursor tracking for 3D image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Custom Cursor
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
      
      cursorX.set(clientX - 16);
      cursorY.set(clientY - 16);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, cursorX, cursorY, activeTab]);

  return (
    <div ref={containerRef} className={`relative ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-light-bg text-light-ink'} min-h-screen font-sans selection:bg-purple-500/30 overflow-x-hidden transition-colors duration-700`}>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full bg-orange-500 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      />
      <AnimatePresence>
        {isIntroActive && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] bg-[#050505] overflow-hidden flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
            
            <svg className="w-full h-full absolute inset-0 pointer-events-none">
              <defs>
                <mask id="intro-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <motion.g
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: isZooming ? 60 : 1, 
                      opacity: 1 
                    }}
                    transition={{ 
                      scale: { duration: 2, ease: [0.7, 0, 0.3, 1] },
                      opacity: { duration: 1 }
                    }}
                    style={{ originX: "50%", originY: "50%" }}
                  >
                    <text
                      x="50%"
                      y="45%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="black"
                      className="text-[18vw] md:text-[8vw] font-black tracking-tighter"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      YANG
                    </text>
                    <text
                      x="50%"
                      y="55%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="black"
                      className="text-[18vw] md:text-[8vw] font-black tracking-tighter"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      PO-YU
                    </text>
                  </motion.g>
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="#050505" mask="url(#intro-mask)" />
            </svg>

            {!isZooming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-20 text-center"
              >
                <div className="h-[1px] w-20 bg-white/20 mx-auto mb-4" />
                <p className="text-white/40 text-[10px] tracking-[0.5em] uppercase font-bold">
                  Industrial Designer & Researcher
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {theme === 'light' && <div className="fixed inset-0 light-pattern pointer-events-none z-0"></div>}
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed inset-0 z-[130] flex flex-col items-center justify-center gap-8 ${theme === 'dark' ? 'bg-black/95 text-white' : 'bg-white/95 text-light-ink'}`}
          >
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-8 right-8 p-2"
            >
              <X size={32} />
            </button>
            <div className="flex flex-col items-center gap-8 text-2xl font-black tracking-tighter uppercase">
              {['head', 'po', 'garage'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab as 'head' | 'po' | 'garage');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`hover:text-purple-400 transition-colors ${
                    activeTab === tab ? 'text-purple-500' : ''
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="flex gap-6 mt-12">
              {[Github, Twitter, Linkedin, Instagram, Mail].map((Icon, i) => (
                <a key={i} href="#" className="hover:text-purple-400 transition-colors">
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[120] flex justify-between items-center p-4 md:p-8 pointer-events-none transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-light-ink'}`}>
        <button 
          onClick={() => {
            setActiveTab('head');
            containerRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`group flex items-center gap-3 md:gap-4 font-bold text-lg md:text-xl tracking-widest pointer-events-auto hover:text-purple-400 transition-colors cursor-pointer bg-transparent border-none p-0 ${theme === 'dark' ? 'text-white' : 'text-light-ink font-display'}`}
        >
          <img 
            src={theme === 'dark' ? "/icons/W_ logo.png" : "/icons/B_ logo.png"} 
            alt="Logo" 
            className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm" 
          />
          <span 
            className="hidden sm:block font-black tracking-tighter uppercase font-mono text-[20px] leading-[24px] not-italic no-underline"
            style={{ borderStyle: 'ridge' }}
          >
            Paul's Experimental Lab
          </span>
        </button>
        <div className="flex gap-4 md:gap-8 items-center pointer-events-auto">
          <div className="hidden md:flex gap-6 text-xs font-bold tracking-widest uppercase">
            <button 
              onClick={() => setActiveTab('head')}
              className={`hover:text-purple-400 transition-colors bg-transparent border-none p-0 cursor-pointer ${activeTab === 'head' ? (theme === 'dark' ? 'text-purple-400' : 'text-light-orange') : (theme === 'dark' ? 'text-white' : 'text-light-ink')}`}
            >
              Head
            </button>
            <button 
              onClick={() => setActiveTab('po')}
              className={`hover:text-purple-400 transition-colors bg-transparent border-none p-0 cursor-pointer ${activeTab === 'po' ? (theme === 'dark' ? 'text-purple-400' : 'text-light-orange') : (theme === 'dark' ? 'text-white' : 'text-light-ink')}`}
            >
              Po
            </button>
            <button 
              onClick={() => setActiveTab('garage')}
              className={`hover:text-purple-400 transition-colors bg-transparent border-none p-0 cursor-pointer ${activeTab === 'garage' ? (theme === 'dark' ? 'text-purple-400' : 'text-light-orange') : (theme === 'dark' ? 'text-white' : 'text-light-ink')}`}
            >
              Garage
            </button>
          </div>
          
          {/* Theme Toggle */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-all pointer-events-auto hover:scale-110`}
          >
            <img 
              src={theme === 'dark' ? "/icons/W_ light.png" : "/icons/B_ dark.png"} 
              alt="Toggle Theme" 
              className="w-6 h-6 object-contain" 
            />
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className={`md:hidden w-8 h-8 flex items-center justify-center ${theme === 'dark' ? 'text-white' : 'text-light-ink'}`}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Fixed Social Sidebar */}
      <div className={`fixed left-8 top-1/2 -translate-y-1/2 z-[120] flex flex-col gap-6 pointer-events-none hidden md:flex`}>
        {[
          { name: 'Instagram', iconLight: '/icons/B_ ig.png', iconDark: '/icons/W_ ig.png', href: 'https://www.instagram.com/yangpboy?igsh=MTh0ZXpmaXN3dzF1Mw%3D%3D&utm_source=qr' },
          { name: 'LinkedIn', iconLight: '/icons/B_ linkedln.png', iconDark: '/icons/W_ linkedln.png', href: 'https://www.linkedin.com/in/paul-yang-b2755329a' },
          { name: 'Behance', iconLight: '/icons/B_ behance.png', iconDark: '/icons/W_ behance.png', href: 'https://www.behance.net/paulyang10' },
          { name: 'Email', iconLight: '/icons/B_ mail.png', iconDark: '/icons/W_ mail.png', href: 'mailto:yangpboy02@gmail.com' }
        ].map((social, i) => (
          <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className={`group relative pointer-events-auto hover:scale-110 transition-all flex items-center`}>
            <img src={theme === 'dark' ? social.iconDark : social.iconLight} alt={social.name} className="w-7 h-7 object-contain" />
            <span className={`absolute left-full ml-4 px-3 py-1.5 text-xs font-bold tracking-widest uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}>
              {social.name}
            </span>
          </a>
        ))}
      </div>

      {/* Fixed Resume Button */}
      <div className={`fixed right-4 bottom-4 md:right-8 md:bottom-8 z-50 ${theme === 'dark' ? 'mix-blend-difference' : 'text-light-ink'} pointer-events-none`}>
        <a href="https://drive.google.com/file/d/1YCm8B_nR_XCcjIx8Nl5gYHuGUAXYI5Mx/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className={`pointer-events-auto text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-colors ${theme === 'dark' ? 'hover:text-purple-400' : 'hover:text-light-orange'}`}>
          Resume <ExternalLink size={14} />
        </a>
      </div>
      {/* Fixed Background for all pages */}
      <div className={`fixed inset-0 w-full overflow-hidden z-0 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#FAFAFA]'}`}>
        <BackgroundDecorations theme={theme} />
        {theme === 'dark' ? (
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
          </div>
        ) : (
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
          </div>
        )}
      </div>

      <motion.div 
        className="flex w-[300vw] h-screen relative z-10"
        animate={{ x: activeTab === 'head' ? '0vw' : activeTab === 'po' ? '-100vw' : '-200vw' }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      >
        {/* Head Page */}
        <div className="w-screen h-screen overflow-y-auto overflow-x-hidden relative" style={{ transform: 'translateZ(0)' }} ref={containerRef}>
          <div className="relative min-h-screen w-full overflow-x-hidden">
            {/* HERO PERSISTENT BACKGROUND */}
            <div className="absolute inset-0 w-full overflow-hidden bg-transparent">
              {/* Sticky Background Layer */}
              <section className="absolute inset-0 flex items-center justify-center overflow-hidden z-0">
                
                {/* 3D Model Container */}
                <motion.div 
                  style={{ opacity: modelOpacity }}
                  className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                >
                  <div className="absolute inset-0 pointer-events-auto">
                    <PlasterModelViewer 
                      theme={theme} 
                      onModelEnter={() => setIsHoveringModel(true)}
                      onModelLeave={() => setIsHoveringModel(false)}
                      onModelClick={() => setActiveTab('po')}
                    />
                  </div>

                  {/* Hover & Click Area: Reduced to 60% (Visual & Interaction Logic) */}
                  <div 
                    className="w-[60vw] h-[60vh] pointer-events-none relative flex items-center justify-center"
                  >
                    {/* Tooltip on Hover using custom images */}
                    <AnimatePresence>
                      {isHoveringModel && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5, x: 20, y: 20 }}
                          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                          exit={{ opacity: 0, scale: 0.5, x: 10, y: 10 }}
                          transition={{ type: "spring", damping: 20, stiffness: 300 }}
                          className="absolute bottom-[10%] right-[10%] z-50 pointer-events-none"
                        >
                          <img 
                            src={theme === 'dark' ? '/3d head hover/ABOUT ME_w.png' : '/3d head hover/ABOUT ME_b.png'} 
                            alt="About Me"
                            className="w-48 md:w-64 h-auto drop-shadow-2xl"
                            referrerPolicy="no-referrer"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </section>

              {/* Triggers for About and Work */}
              <div className="fixed inset-0 pointer-events-none z-20">
                {/* Right Arrow for Works */}
                <motion.button 
                  onClick={() => setActiveTab('po')}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ x: 5, scale: 1.1 }}
                  className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 pointer-events-auto flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <span className={`text-[12px] font-bold tracking-[0.5em] uppercase transition-colors rotate-90 mb-10 ${theme === 'dark' ? 'text-white/60 group-hover:text-purple-400' : 'text-light-ink/60 group-hover:text-light-orange'}`}>PO</span>
                  <div className={`p-4 rounded-full border-2 transition-all ${theme === 'dark' ? 'border-white/20 bg-white/10 text-white group-hover:border-purple-500/80' : 'border-light-ink/20 bg-light-ink/10 text-light-ink group-hover:border-light-orange'}`}>
                    <ChevronRight size={32} strokeWidth={2.5} />
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Spacer to push About section down since Hero is fixed */}
            <div className="h-screen w-full pointer-events-none"></div>

            {/* About Section in Scroll Flow */}
            <div 
              id="about" 
              ref={aboutRef}
              className={`relative w-full min-h-screen z-10 flex flex-col items-center justify-center p-4 pb-32 md:p-12 md:pb-40 ${theme === 'dark' ? 'bg-[#050505]/95' : 'bg-white/95'} backdrop-blur-xl`}
            >
              {/* Bottom Controls */}
              <div className={`absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 p-3 backdrop-blur-md rounded-full border ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">A-</span>
                <div className="w-32 md:w-48 relative h-4 flex items-center justify-center">
                  <input 
                    type="range" 
                    min="0.2" 
                    max="1" 
                    step="0.01" 
                    value={aboutTextScale}
                    onChange={(e) => setAboutTextScale(parseFloat(e.target.value))}
                    className="w-full h-1 absolute bg-neutral-200 dark:bg-neutral-800 rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">A+</span>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                style={{ scale: aboutTextScale, transformOrigin: 'center center' }}
                className={`w-full mx-auto max-w-4xl px-4 md:pl-12 md:pr-0 relative transition-all duration-200 text-center`}
              >
                <h2 className={`text-[24px] md:text-[32px] lg:text-[48px] font-black tracking-tighter mb-12 uppercase font-mono ${theme === 'dark' ? 'text-white' : 'text-light-ink font-display'}`}>
                  Paul’s Experimental Lab
                </h2>
                
                <div className="flex flex-col gap-8 max-w-3xl mx-auto">
                  <p className={`text-[16px] md:text-[20px] font-medium leading-[1.6] tracking-tight ${theme === 'dark' ? 'text-gray-200' : 'text-light-ink/80'}`}>
                    Paul’s Experimental Lab is the creative sanctuary of designer PO-YU YANG. Beyond a traditional portfolio, it is a dynamic testing ground for his explorations in product, service, and visual design. Through a collection of demos and beta concepts, Paul invites you to join a journey of raw discovery: to dare the attempt, to embrace the failure, and to experience the profound essence of life through design.
                  </p>
                  
                  <p className={`text-[14px] md:text-[16px] font-normal leading-[1.8] ${theme === 'dark' ? 'text-gray-400' : 'text-light-ink/60'}`}>
                    Paul’s Experimental Lab 是設計師楊博宇的個人作品網站兼實驗平台，展示產品、服務、視覺設計及各式 Demo 與 Beta 版本。讓我們一起體驗嘗試、失敗與設計人生，水喔。
                  </p>

                  <p className={`text-[14px] md:text-[16px] font-normal leading-[1.8] ${theme === 'dark' ? 'text-gray-400' : 'text-light-ink/60'}`}>
                    Pauls Experimental Lab ist der kreative Rückzugsort des Designers Paul Yang. Mehr als ein traditionelles Portfolio dient es als dynamisches Testfeld für seine Erkundungen in den Bereichen Produkt-, Service- und visuelles Design. Anhand einer Sammlung von Demos und Beta-Konzepten lädt Paul Sie zu einer Reise der ungeschliffenen Entdeckung ein: den Mut zum Experimentieren, das Akzeptieren von Fehlern und die tiefgründige Essenz des Lebens durch Design zu erfahren.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Contact Section inside Home Tab */}
            <motion.footer 
              id="contact" 
              ref={contactRef} 
              style={{ opacity: contactOpacity, scale: contactScale }}
              className={`relative w-full py-16 md:py-24 px-6 md:px-24 overflow-hidden min-h-screen flex items-center justify-center z-20 transition-all duration-700 ${!isContactActive ? 'grayscale' : 'grayscale-0'} ${theme === 'dark' ? 'bg-black/40' : 'bg-light-ink/5'}`}
            >
              {/* Background Video */}
              <video
                ref={videoRef}
                src="/contact.mp4"
                muted
                playsInline
                preload="auto"
                onEnded={() => setIsVideoEnded(true)}
                className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${!isContactActive ? 'opacity-0' : isVideoEnded ? 'opacity-30' : 'opacity-80'} ${theme === 'dark' ? 'mix-blend-screen' : 'mix-blend-multiply'}`}
              />
              
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 blur-[100px] rounded-full pointer-events-none ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-light-orange/10'}`}></div>
              
              {!isContactActive && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center">
                  <div 
                    className={`transition-all duration-1000 ease-in-out cursor-pointer relative group ${!isContactZooming && 'hover:scale-105 hover:-translate-y-2'}`}
                    style={{ 
                      transform: isContactZooming ? 'scale(30)' : 'scale(1)',
                      transformOrigin: '80% 45%',
                      opacity: isContactZooming ? 0 : 1
                    }}
                    onClick={() => {
                      setIsContactZooming(true);
                      setTimeout(() => {
                        setIsContactActive(true);
                      }, 900);
                    }}
                  >
                    <img 
                      src={theme === 'dark' ? '/icons/W_ contact.png' : '/icons/B_ contact.png'} 
                      alt="Contact" 
                      className="w-[20rem] md:w-[32rem] h-auto drop-shadow-2xl"
                    />
                    
                    {/* Hover Tooltip */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform group-hover:-translate-y-2">
                      <div className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap shadow-xl ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                        Contact me
                        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] ${theme === 'dark' ? 'border-t-white' : 'border-t-black'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {isContactActive && isVideoEnded && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center w-full"
                  >
                    <h2 className={`text-2xl md:text-5xl font-black tracking-tighter mb-6 ${theme === 'light' ? 'font-display text-light-ink' : ''}`}>
                      Let's build<br/>something <span className={`text-transparent bg-clip-text ${theme === 'dark' ? 'bg-gradient-to-r from-purple-400 to-pink-600' : 'bg-gradient-to-r from-light-orange to-light-yellow'}`}>great.</span>
                    </h2>
                    
                    <a 
                      href="mailto:yangpboy02@gmail.com" 
                      className={`group relative inline-flex items-center justify-center px-6 md:px-8 py-2 md:py-3 font-bold transition-all duration-300 rounded-full overflow-hidden border-2 text-xs md:text-sm ${theme === 'dark' ? 'text-white bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105 hover:border-purple-500/50' : 'text-white bg-light-ink border-light-ink hover:scale-110 shadow-lg'}`}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Mail size={14} className="group-hover:animate-bounce" /> Drop me a line
                      </span>
                      {theme === 'dark' && <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-purple-500/20"></div>}
                    </a>

                    <div className={`mt-12 md:mt-16 w-full flex flex-col md:flex-row items-center justify-between gap-6 border-t pt-6 text-[10px] md:text-xs font-medium tracking-widest uppercase ${theme === 'dark' ? 'border-white/10 text-gray-500' : 'border-light-ink/10 text-light-ink/60'}`}>
                      <div className="flex gap-6">
                        {[
                          { icon: Instagram, href: 'https://www.instagram.com/yangpboy?igsh=MTh0ZXpmaXN3dzF1Mw%3D%3D&utm_source=qr' },
                          { icon: Linkedin, href: 'https://www.linkedin.com/in/paul-yang-b2755329a' },
                          { icon: BehanceIcon, href: 'https://www.behance.net/paulyang10' },
                          { icon: Mail, href: 'mailto:yangpboy02@gmail.com' }
                        ].map((social, i) => (
                          <a 
                            key={i} 
                            href={social.href}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`transition-all duration-300 hover:-translate-y-1 ${theme === 'dark' ? 'hover:text-purple-400' : 'hover:text-light-orange'}`}
                          >
                            <social.icon size={16} />
                          </a>
                        ))}
                      </div>
                      <p>© {new Date().getFullYear()} PAUL YANG. ALL RIGHTS RESERVED.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.footer>
          </div>
        </div>

        {/* PO Page */}
        <div className="w-screen h-screen overflow-y-auto overflow-x-hidden relative" style={{ transform: 'translateZ(0)' }}>
          <POPage 
            theme={theme} 
          />
        </div>

        {/* Garage Page */}
        <div className="w-screen h-screen overflow-y-auto overflow-x-hidden relative" style={{ transform: 'translateZ(0)' }}>
          <div className={`min-h-full relative overflow-clip ${theme === 'dark' ? 'bg-[#050505]' : 'bg-white'} pt-32 pb-12`}>
            {/* Ambient Background Glows */}
            {theme === 'dark' && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15], x: [0, 50, 0], y: [0, 30, 0] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none z-0"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1], x: [0, -40, 0], y: [0, -50, 0] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none z-0"
                />
              </>
            )}

            {/* Top Navigation (Browser Tab Style) - Wrapped in a sticky container to hide cards scrolling up */}
            <div className={`sticky top-0 z-[110] w-full transition-colors duration-300 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-white'}`}>
              <motion.header 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`w-full max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-end px-4 md:px-16 lg:px-24 border-b border-neutral-200 dark:border-neutral-800 pt-[80px] md:pt-[100px] mb-0 pb-0 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-white'}`}
              >
                <nav className="flex flex-wrap gap-1 md:gap-2 text-xs md:text-sm font-semibold tracking-widest uppercase">
                  {GARAGE_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveGarageFilter(cat)}
                      className={`hover-trigger px-4 md:px-6 py-3 transition-all rounded-t-lg border-t border-x ${
                        activeGarageFilter === cat 
                          ? (theme === 'dark' ? 'bg-[#050505] text-orange-500 border-neutral-800 relative translate-y-[1px]' : 'bg-white text-orange-500 border-neutral-200 relative translate-y-[1px]')
                          : (theme === 'dark' ? 'bg-neutral-900 text-neutral-500 border-transparent hover:bg-neutral-800 hover:text-neutral-300' : 'bg-neutral-100 text-neutral-400 border-transparent hover:bg-neutral-200 hover:text-neutral-600')
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </nav>
                
                {/* Sort Filter */}
                <div className="flex items-center gap-3 mt-4 md:mt-0 mb-2 md:mb-0">
                  <span className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>Sort by</span>
                  <select
                    value={garageSort}
                    onChange={(e) => setGarageSort(e.target.value as 'newest' | 'oldest')}
                    className={`text-sm font-bold uppercase tracking-widest bg-transparent border-b pb-1 outline-none cursor-pointer ${theme === 'dark' ? 'text-white border-white/20' : 'text-black border-black/20'}`}
                  >
                    <option value="newest" className="bg-neutral-900 text-white">Newest First</option>
                    <option value="oldest" className="bg-neutral-900 text-white">Oldest First</option>
                  </select>
                </div>
              </motion.header>
            </div>

            <div className="h-8 w-full" /> {/* Spacer after header */}

            {/* Work Section - IG Style Grid */}
            <section className="w-full max-w-[1800px] mx-auto px-4 md:px-16 lg:px-24 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[300px] md:auto-rows-[400px] gap-4 md:gap-6">
                {filteredGaragePosts.map((post: typeof GARAGE_POSTS[0], i: number) => {
                  const pattern = [
                    "md:col-span-2 md:row-span-2", // Large
                    "md:col-span-2 md:row-span-1", // Wide top right
                    "md:col-span-1 md:row-span-1", // Square bottom right
                    "md:col-span-1 md:row-span-1", // Square bottom right
                    "md:col-span-4 md:row-span-1", // Full width
                    "md:col-span-1 md:row-span-1", // Square
                    "md:col-span-1 md:row-span-1", // Square
                    "md:col-span-2 md:row-span-1", // Wide
                  ];
                  const spanClass = pattern[i % pattern.length];

                  return (
                  <div 
                    key={post.id} 
                    className={`relative group bg-neutral-100 dark:bg-neutral-900 overflow-hidden hover-trigger cursor-pointer transition-all duration-500 hover:z-20 rounded-2xl ${spanClass}`}
                    onClick={() => { setSelectedGaragePost(post); }}
                  >
                    <div className="relative w-full h-full">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        loading={i < 4 ? "eager" : "lazy"}
                        decoding="async"
                      />
                      
                      {/* Persistent Gradient for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 z-0" />

                      {/* Top Stats Bar */}
                      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-end items-start z-10">
                        {/* Induce Share */}
                        <motion.button 
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                          className="flex items-center gap-1.5 bg-white/10 text-white/80 group-hover:bg-orange-500 group-hover:text-white px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] pointer-events-auto backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGarageShare(post);
                          }}
                        >
                          <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span>Share</span>
                        </motion.button>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end z-10 pointer-events-none transform transition-transform duration-500">
                        <p className="text-xs md:text-sm text-white/80 font-bold mb-1.5 uppercase tracking-widest drop-shadow-md">{post.category}</p>
                        <h3 className="font-black tracking-tighter text-xl md:text-3xl text-white leading-tight drop-shadow-lg group-hover:scale-[1.02] transition-transform duration-500 origin-left uppercase line-clamp-3">{post.title}</h3>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </section>
          </div>
        </div>
      </motion.div>

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
                className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-white hover:text-orange-500 transition-all hover:scale-110 shadow-lg"
                onClick={() => setSelectedGaragePost(null)}
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex flex-col gap-4 bg-neutral-100/80 dark:bg-neutral-800/80 backdrop-blur-md p-4 rounded-full shadow-xl border border-neutral-200 dark:border-neutral-700">
                <button 
                  className="p-3 rounded-full hover:bg-white dark:hover:bg-neutral-700 text-neutral-800 dark:text-white hover:text-orange-500 transition-all group relative"
                  onClick={(e) => { e.stopPropagation(); handleGarageShare(selectedGaragePost); }}
                >
                  <Share2 className="w-5 h-5" />
                  <span className="absolute right-full mr-4 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">Share</span>
                </button>
                <button 
                  className={`p-3 rounded-full hover:bg-white dark:hover:bg-neutral-700 transition-all group relative ${isProjectLiked ? 'text-red-500' : 'text-neutral-800 dark:text-white hover:text-red-500'}`}
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
              <div ref={toolsRef} className="w-full bg-white dark:bg-[#050505] relative z-30">
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
