export interface IGamePreview {
  id: string;
  title: string;
  description: string;
  status: string;
  rating: number;
  views_count: number;
  isFeatured: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  coverImage: CoverImage;
  genres: Genre[];
}

interface CoverImage {
  id: string;
  name: string;
}

interface Genre {
  id: string;
  name: string;
}
