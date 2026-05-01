export type NewsItem = {
  id: number;
  slug: string;
  title: string;
  title_en?: string;
  category: string;
  category_en?: string;
  date: string;
  excerpt: string;
  excerpt_en?: string;
  content: string[];
  content_en?: string[];
  imageUrl?: string;
};
