export interface Goal {
  id: string;
  title: string;
  opponent: string;
  competition: string;
  year: number;
  minute: number;
  videoId: string;
  thumbnail: string;
  description: string;
}

export const GOALS_DATA: Goal[] = [
  {
    id: "turin-bicycle",
    title: "The Turin Bicycle Kick",
    opponent: "Juventus",
    competition: "UCL Quarter-Final",
    year: 2018,
    minute: 64,
    videoId: "vFjt-YWS6pc",
    thumbnail: "https://img.youtube.com/vi/vFjt-YWS6pc/hqdefault.jpg",
    description: "A 2.38-meter overhead kick that silenced the Juventus crowd and earned a standing ovation.",
  },
  {
    id: "portsmouth",
    title: "The Portsmouth Knuckleball",
    opponent: "Portsmouth",
    competition: "Premier League",
    year: 2008,
    minute: 12,
    videoId: "R6d5WZSrZeM",
    thumbnail: "https://img.youtube.com/vi/R6d5WZSrZeM/hqdefault.jpg",
    description: "A 40-yard free kick with zero spin that dipped at the last moment.",
  },
  {
    id: "sampdoria",
    title: "The 2.56m Leap",
    opponent: "Sampdoria",
    competition: "Serie A",
    year: 2019,
    minute: 45,
    videoId: "AunImole9HI",
    thumbnail: "https://img.youtube.com/vi/AunImole9HI/hqdefault.jpg",
    description: "A gravity-defying header at 2.56 meters — higher than the crossbar.",
  },
  {
    id: "spain-hattrick",
    title: "World Cup Hat-Trick vs Spain",
    opponent: "Spain",
    competition: "World Cup 2018",
    year: 2018,
    minute: 88,
    videoId: "YdPZ24meJ5w",
    thumbnail: "https://img.youtube.com/vi/YdPZ24meJ5w/hqdefault.jpg",
    description: "A last-minute free kick to complete a historic hat-trick against Spain.",
  },
  {
    id: "porto-missile",
    title: "The 40-Yard Missile",
    opponent: "FC Porto",
    competition: "UCL Quarter-Final",
    year: 2009,
    minute: 6,
    videoId: "M_D7pxKStDc",
    thumbnail: "https://img.youtube.com/vi/M_D7pxKStDc/hqdefault.jpg",
    description: "A 40-yard rocket that won the inaugural Puskás Award.",
  },
  {
    id: "atletico-comeback",
    title: "The Atletico Comeback",
    opponent: "Atletico Madrid",
    competition: "UCL Round of 16",
    year: 2019,
    minute: 86,
    videoId: "O0U86W6y7I4",
    thumbnail: "https://img.youtube.com/vi/O0U86W6y7I4/hqdefault.jpg",
    description: "A hat-trick to complete the impossible comeback against Atletico Madrid.",
  },
  {
    id: "arsenal-fk",
    title: "The Arsenal Free Kick",
    opponent: "Arsenal",
    competition: "UCL Semi-Final",
    year: 2009,
    minute: 40,
    videoId: "bF33L3gxcfs",
    thumbnail: "https://img.youtube.com/vi/bF33L3gxcfs/hqdefault.jpg",
    description: "A long-range free kick from 40 yards out that stunned the Emirates.",
  },
  {
    id: "campnou-calma",
    title: "The Calma at Camp Nou",
    opponent: "Barcelona",
    competition: "La Liga",
    year: 2012,
    minute: 73,
    videoId: "YtweT071jhM",
    thumbnail: "https://img.youtube.com/vi/YtweT071jhM/hqdefault.jpg",
    description: "The iconic winner at Camp Nou, followed by the legendary 'Calma' celebration.",
  },
];
