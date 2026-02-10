

export type Blog = {
  id: string;
  title: string;
  metadata: string | null;
  slug: string;
  authorId: number;
  categoryId: number;
  tags: string[];
  mainImage: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    name: string;
    image: string;
    bio: string | null;
  };
};
