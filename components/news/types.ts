export type NewsItem = {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string[];
  imageUrl?: string;
};
