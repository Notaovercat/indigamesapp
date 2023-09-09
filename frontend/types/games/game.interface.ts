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
  team: Team;
  platforms: Platform[];
  tags: Tag[];
  genres: Genre[];
  coverImage: Image;
  screenshots: Image[];
}

interface Team {
  id: string;
  author: Author;
  team_members: TeamMember[];
}

interface Author {
  id: string;
  email: string;
  username: string;
}

interface TeamMember {
  id: string;
  user: User;
  role: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Platform {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Genre {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Image {
  id: string;
  name: string;
}
