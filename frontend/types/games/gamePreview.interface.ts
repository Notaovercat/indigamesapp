import { ICoverImage } from "./coverImage.interface";
import { IGenre } from "./genres.interface";

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
