export interface Post {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  categories: string[];
  slug: string;
  views: number;
  featured: boolean;
  content: string;
}

export type NewPost = Omit<Post, "id" | "date" | "views">;
