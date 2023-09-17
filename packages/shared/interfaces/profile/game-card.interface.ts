export interface IGameCard {
  id: string;
  title: string;
  description: string;
  coverImage: ICoverImage | null;
  views_count: number;
  rating: number;
  createdAt: string;
  _count: {
    comments: number;
  };
}

export interface ICoverImage {
  id: string;
  name: string;
}
