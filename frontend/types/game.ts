import { ICoverImage } from "./coverImage";
import { IGenre } from "./genres";
import { Platform } from "./platform";
import { IScreenshot } from "./screenshot";

export interface IGame {
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
  // team: Team
  platforms: Platform[];
  // tags: Tag[];
  genres: IGenre[];
  coverImage: ICoverImage;
  screenshots: IScreenshot[];
}
