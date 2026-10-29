export interface RecordItem {
  id: string;
  metric: number;
  suffix?: string;
  title: string;
  competition: string;
  details: string;
  category: "all-time" | "ucl" | "international" | "longevity";
  isOngoing?: boolean;
}

export const CR7_RECORDS: RecordItem[] = [
  {
    id: "rec-1",
    metric: 981,
    suffix: "",
    title: "All-Time Leading Scorer in Football History",
    competition: "World Record",
    details: "Recognized by FIFA and IFFHS as the highest senior goalscorer in the history of association football.",
    category: "all-time",
    isOngoing: true,
  },
  {
    id: "rec-2",
    metric: 140,
    suffix: "",
    title: "All-Time UEFA Champions League Top Scorer",
    competition: "UEFA Champions League",
    details: "Scored across 18 consecutive Champions League tournaments with Man United, Real Madrid, and Juventus.",
    category: "ucl",
  },
  {
    id: "rec-3",
    metric: 133,
    suffix: "",
    title: "All-Time Men's International Top Scorer",
    competition: "Portugal National Team",
    details: "Surpassed Ali Daei's 109-goal record in 2021, leading Portugal to Euro 2016 and 2019 Nations League glory.",
    category: "international",
    isOngoing: true,
  },
  {
    id: "rec-4",
    metric: 5,
    suffix: "",
    title: "UEFA Champions League Titles",
    competition: "UEFA Champions League",
    details: "First player to win the modern Champions League five times (2008, 2014, 2016, 2017, 2018).",
    category: "ucl",
  },
  {
    id: "rec-5",
    metric: 17,
    suffix: "",
    title: "Most Goals in a Single UCL Season",
    competition: "UCL 2013-14",
    details: "Historic 17 goals in 11 matches during Real Madrid's triumphant 'La Décima' campaign.",
    category: "ucl",
  },
  {
    id: "rec-6",
    metric: 65,
    suffix: "",
    title: "Senior Career Hat-Tricks",
    competition: "World Record",
    details: "Over 65 hat-tricks for club and country, including 10 hat-tricks on the international stage.",
    category: "all-time",
    isOngoing: true,
  },
  {
    id: "rec-7",
    metric: 6,
    suffix: "",
    title: "European Championships Played",
    competition: "UEFA Euro (2004–2024)",
    details: "The only player in history to feature in six separate European Championship tournaments.",
    category: "international",
  },
  {
    id: "rec-8",
    metric: 850,
    suffix: "+",
    title: "Official Senior Career Match Victories",
    competition: "World Record",
    details: "First footballer in history to surpass 850 official competitive wins for club and country.",
    category: "longevity",
    isOngoing: true,
  },
];
