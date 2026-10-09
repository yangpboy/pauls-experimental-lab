export type PortfolioLanguage = 'zh' | 'en';

export interface AboutCapability {
  title: string;
  description: string;
  tags: string[];
}

export interface AboutLocaleContent {
  role: string;
  headline: string;
  basedInLabel: string;
  basedIn: string;
  educationLabel: string;
  education: string;
  focusAreasLabel: string;
  focusAreas: string[];
  bio: string[];
  resume: string;
  whatIDo: [string, string];
  capabilities: [AboutCapability, AboutCapability, AboutCapability];
  worksTitle: string;
  timelineLabel: string;
  timelineHint: string;
  openProject: string;
}

export type AboutContent = Record<PortfolioLanguage, AboutLocaleContent>;

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  en: {
    role: 'Industrial Designer & Researcher',
    headline: 'Bridging the gap between *engineering precision* and *artistic expression*.',
    basedInLabel: 'Based In',
    basedIn: 'Taiwan & UK',
    educationLabel: 'Education',
    education: 'Imperial College London, Royal College of Art',
    focusAreasLabel: 'Focus Areas',
    focusAreas: ['Industrial Design', 'User Research', 'UI/UX', 'Prototyping'],
    bio: [
      'With a background shaped by both engineering and art, I bring a unique perspective that balances craftsmanship, creativity, and human-centred experiences.',
      'My journey from Taiwan to the UK has broadened my view of how products, users, and environments connect across cultures. I believe that design is not just about problem-solving; it is about enriching life by offering more possibilities and choices.',
    ],
    resume: 'View Resume',
    whatIDo: ['WHAT', 'I DO'],
    capabilities: [
      {
        title: 'DESIGN',
        description: 'Crafting intuitive user interfaces and engaging user experiences with a focus on aesthetics.',
        tags: ['UI/UX', 'Figma', 'Interaction', '3D Modelling'],
      },
      {
        title: 'RESEARCH',
        description: 'Conducting in-depth user research and usability testing to uncover insights that drive meaningful design decisions.',
        tags: ['User Research', 'Usability Testing', 'Data Analysis', 'Field Study'],
      },
      {
        title: 'EXERCISE',
        description: 'Exercising every day supports both physical and mental health.',
        tags: ['Basketball', 'Table Tennis', 'Badminton', 'Cycling', 'Jogging', 'Mountain Climbing', 'Swimming'],
      },
    ],
    worksTitle: 'My Works',
    timelineLabel: 'Project timeline. Drag or swipe horizontally to explore all projects.',
    timelineHint: 'Drag or swipe to explore',
    openProject: 'Open',
  },
  zh: {
    role: '工業設計師暨研究者',
    headline: '在 *工程的精準* 與 *藝術的表達* 之間搭起橋樑。',
    basedInLabel: '所在地',
    basedIn: '台灣與英國',
    educationLabel: '學歷',
    education: '倫敦帝國學院、皇家藝術學院',
    focusAreasLabel: '專注領域',
    focusAreas: ['工業設計', '使用者研究', 'UI/UX', '原型製作'],
    bio: [
      '我的背景橫跨工程與藝術，因此能以不同角度思考設計，並在工藝、創意與以人為本的體驗之間取得平衡。',
      '從台灣到英國的學習與生活經驗，拓展了我對產品、使用者與環境如何跨文化連結的理解。我相信設計不只是解決問題，更是透過提供更多可能與選擇，讓生活變得更豐富。',
    ],
    resume: '查看履歷',
    whatIDo: ['我在', '做什麼'],
    capabilities: [
      {
        title: '設計',
        description: '以美感與易用性為核心，打造直覺的介面與有吸引力的使用體驗。',
        tags: ['UI/UX', 'Figma', '互動設計', '3D 建模'],
      },
      {
        title: '研究',
        description: '透過深入的使用者研究與易用性測試，找出能支持設計決策的關鍵洞察。',
        tags: ['使用者研究', '易用性測試', '資料分析', '田野研究'],
      },
      {
        title: '運動',
        description: '透過日常運動維持身心健康，也讓思考與創作保持活力。',
        tags: ['籃球', '桌球', '羽球', '單車', '慢跑', '登山', '游泳'],
      },
    ],
    worksTitle: '我的作品',
    timelineLabel: '作品時間軸。可左右拖曳或滑動，瀏覽所有作品。',
    timelineHint: '左右拖曳或滑動瀏覽',
    openProject: '開啟',
  },
};
