import { ICoverImage } from "./coverImage";
import { IGenre } from "./genres";

export interface IGamePreview {
  id: string;
  title: string;
  description: string;
  status: string;
  coverImage: ICoverImage | null;
  genres: IGenre[];
  rating: number;
  views_count: number;
  isFeatured: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}
