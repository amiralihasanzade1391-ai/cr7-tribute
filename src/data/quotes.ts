export interface QuoteItem {
  id: string;
  quote: string;
  context: string;
  year?: string;
  category: "mindset" | "dedication" | "legacy" | "resilience";
}

export const RONALDO_QUOTES: QuoteItem[] = [
  {
    id: "q-1",
    quote: "Talent without working hard is nothing.",
    context: "On supreme discipline and training ethic",
    year: "2015",
    category: "dedication",
  },
  {
    id: "q-2",
    quote: "Your love makes me strong. Your hate makes me unstoppable.",
    context: "Response to rival hostility and pressure",
    year: "2011",
    category: "resilience",
  },
  {
    id: "q-3",
    quote: "If you don't believe you are the best, then you will never achieve all that you are capable of.",
    context: "Ballon d'Or acceptance address",
    year: "2014",
    category: "mindset",
  },
  {
    id: "q-4",
    quote: "I'm living a dream I never want to wake up from.",
    context: "Unveiling at Santiago Bernabéu before 80,000 fans",
    year: "2009",
    category: "legacy",
  },
  {
    id: "q-5",
    quote: "I don't have to show anything to anyone. There is nothing to prove. My numbers speak for themselves.",
    context: "Post-match UEFA Champions League masterclass",
    year: "2017",
    category: "legacy",
  },
  {
    id: "q-6",
    quote: "Dreams are not what you see in your sleep, dreams are things which do not let you sleep.",
    context: "Reflecting on his childhood in Madeira",
    year: "2016",
    category: "mindset",
  },
  {
    id: "q-7",
    quote: "I see football as art and all players are artists. If you are a top artist, the last thing you would do is paint a picture somebody else has already painted.",
    context: "On reinventing the knuckleball free-kick",
    year: "2013",
    category: "mindset",
  },
  {
    id: "q-8",
    quote: "I never hide. When the pressure is maximum, that is when I feel most alive.",
    context: "Ahead of Euro 2016 Final & Turin Comeback",
    year: "2018",
    category: "resilience",
  },
];
