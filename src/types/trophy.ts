"use client";

export interface Trophy {
  id: string;
  name: string;
  count: number;
  years: number[];
  icon: string;
  image?: string;
  tier: "gold" | "silver" | "bronze";
  category: "club" | "international" | "individual" | "records";
  description: string;
  firstWon: number;
  mostRecent: number;
}

export type TrophyCategory = "club" | "international" | "individual" | "records";
