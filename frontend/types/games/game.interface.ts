import { ICoverImage } from "./coverImage.interface";
import { IGenre } from "./genres.interface";
import { Platform } from "./platform.interface";
import { IScreenshot } from "./screenshot.interface";

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
