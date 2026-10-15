export interface EraStats {
  appearances: number;
  goals: number;
  assists: number;
  trophies: number;
}

export interface EraKeyStat {
  label: string;
  value: string | number;
  suffix?: string;
}

export interface EraIconicMoment {
  title: string;
  description: string;
  image: string;
  badge: string;
  youtubeId?: string;
  quote?: string;
  opponent?: string;
  minute?: string;
  competition?: string;
  year?: string;
}

export interface EraColors {
  primary: string;
  accent: string;
  bg: string;
  text: string;
  cardBg: string;
  borderColor: string;
}

export interface Era {
  id: string;
  slug: string;
  order: number;
  club: string;
  shortName: string;
  abbreviation: string; // SPT, MUN, RMA, JUV, MUN2, NAS, POR
  period: string;
  startYear: number;
  endYear: number;
  kitNumber: string;
  tagline: string;
  narrative: string;
  heroImage?: string;
  heroImages?: string[];
  colors: EraColors;
  stats: EraStats;
  keyStats: EraKeyStat[]; // 3 core stats for the panel layout
  trophiesList: string[];
  iconicMoment: EraIconicMoment;
  quote: {
    text: string;
    context: string;
  };
  highlights: string[];
}
