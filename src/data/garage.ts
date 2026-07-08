export interface GaragePost {
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

export const GARAGE_POSTS: GaragePost[] = [
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
    galleryBottom: [],
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
      '/works/invisible/invisible (11).jpg',
    ],
  },
  {
    id: 9,
    image: '/works/explo.11/cover.png',
    title: 'Explo.11探索十一號',
    caption: 'A comprehensive exploration of automotive design and digital portfolio presentation.',
    date: '10.2024~04.2025',
    location: 'Taiwan',
    category: 'Product Design',
    likes: '1.8k',
    comments: '42',
    views: '12.5k',
    shares: '95',
    author: 'Po-Yu Yang, Chih-Huang Chou, Hsiao-Kuang Hsu',
    tools: ['Industrial Design', '3D Modeling', 'Visual Design'],
    description: 'Explo.11 is a deep dive into automotive aesthetics and the art of digital storytelling. This project showcases a series of car design studies, focusing on fluid forms, aerodynamic efficiency, and the integration of advanced materials.',
    gallery: Array.from({ length: 15 }, (_, i) => `/works/explo.11/car portfolio (${i + 1}).jpg`),
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
      '/works/tube/tube (6).jpg',
    ],
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
    description: 'DARK SIDE OF THE TINI, a collaborative project by Po-Yu Yang and Nick Düchs, centers on the vision of treating stone (Tini) as the soulful protagonist of design. Drawing inspiration from the Hizz rocking chair by Mentalla Said and Jumana Taha, the project emphasizes architectural geometry and material honesty. By simplifying all visual elements, the designers evoke an imagery of stones "floating" in space and emitting a celestial glow, a concept rooted in the moon, Junichiro Tanizaki\'s In Praise of Shadows, and the interplay of light and shadow in early photography. Technically, the work demonstrates an advanced workflow integrating computational design with physical materiality. Utilizing Grasshopper, the designers precisely calculated the centroid of each stone and generated support nodes based on their unique silhouettes. Through iterative prototyping (from 01 to 04), they resolved stability issues, ultimately developing a dual-layer base that echoes the stone\'s texture while balancing the structure.',
    gallery: [
      '/works/tini/tini main (1).png',
      '/works/tini/tini main (2).png',
    ],
    smallPics: Array.from({ length: 6 }, (_, i) => `/works/tini/tini small pics (${i + 1}).png`),
    galleryBottom: Array.from({ length: 19 }, (_, i) => `/works/tini/tini (${i + 1}).jpg`),
  },
];

export const parseGarageDate = (dateStr: string) => {
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

  const date = new Date(firstPart);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};
