export enum STATUS {
  InDevelopment = "InDevelopment",
  EarlyAccess = "EarlyAccess",
  Released = "Released",
  NonProvided = "NonProvided",
}

export interface IGame {
  id: string;
  title: string;
  description: string;
  status: STATUS;
  rating: number;
  views_count: number;
  isFeatured: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  team: ITeam;
  platforms: IPlatform[];
  tags: ITag[];
  genres: IGenre[];
  coverImage: IImage;
  screenshots: IImage[];
  _count: Count;
}

export interface Count {
  rated: number;
}

export interface ITeam {
  id: string;
  author: IAuthor;
  team_members: ITeamMember[];
}

export interface IAuthor {
  id: string;
  email: string;
  username: string;
}

export interface ITeamMember {
  id: string;
  user: IUser;
  role: string;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
}

export interface IPlatform {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITag {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGenre {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IImage {
  id: string;
  name: string;
}
