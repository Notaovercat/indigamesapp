export type STATUS =
  | "InDevelopment"
  | "EarlyAccess"
  | "Released"
  | "NonProvided";

export interface IGame {
  id: string;
  title: string;
  description: string;
  status: STATUS;
  rating: number;
  views_count: number;
  isFeatured: boolean;
  isVisible: boolean;
  team: ITeam | null;
  platforms: IPlatform[];
  tags: ITag[];
  genres: IGenre[];
  coverImage: IImage | null;
  screenshots: IImage[];
  createdAt: Date;
  updatedAt: Date;
  _count: {
    rated: number;
  };
}

export interface ITeam {
  id: string;
  author: IAuthor | null;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface ITag {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGenre {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IImage {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
