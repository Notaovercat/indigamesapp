export interface IGamePreview {
  id: string;
  title: string;
  description: string;
  status: string;
  rating: number;
  views_count: number;
  isFeatured: boolean;
  isVisible: boolean;
  coverImage: CoverImage | null;
  genres: Genre[];
  createdAt: Date;
  updatedAt: Date;
}

interface CoverImage {
  id: string;
  name: string;
}

interface Genre {
  id: string;
  name: string;
}
