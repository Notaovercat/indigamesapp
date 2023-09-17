export interface IUserTeams {
  id: string;
  role: string;
  team: Team;
}

interface Team {
  id: string;
  author: Author | null;
  game: Game | null;
}

interface Author {
  id: string;
  username: string;
}

interface Game {
  id: string;
  title: string;
  coverImage: CoverImage | null;
}

interface CoverImage {
  id: string;
  name: string;
}
