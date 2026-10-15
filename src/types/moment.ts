export type MomentCategoryType = "goal" | "celebration" | "trophy" | "personal";

export type FilterCategory = "all" | MomentCategoryType;

export interface IconicMoment {
  id: string;
  title: string;
  description: string;
  year: number | string;
  opponent?: string;
  competition: string;
  category: MomentCategoryType;
  image: string;
  videoId?: string;
  tags: string[];
  aspectRatio?: "tall" | "square" | "wide";
  likesCount: number;
}

export interface MomentCategoryMeta {
  id: FilterCategory;
  label: string;
  iconName: string;
}
