export interface IUserTeams {
  id: string;
  role: string;
  team: Team;
}

interface Team {
  id: string;
  author: Author;
  game: Game;
}

interface Author {
  id: string;
  username: string;
}

interface Game {
  id: string;
  title: string;
  coverImage?: CoverImage;
}

interface CoverImage {
  id: string;
  name: string;
}
