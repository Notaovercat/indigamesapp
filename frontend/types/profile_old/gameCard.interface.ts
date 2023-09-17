export interface IGameCard {
  id: string;
  title: string;
  description: string;
  coverImage?: ICoverImage;
  views_count: number;
  rating: number;
  createdAt: string;
  _count: Count;
}

export interface Count {
  comments: number;
}

export interface ICoverImage {
  id: string;
  name: string;
}
