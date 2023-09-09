export interface ICreateGame {
  title: string;
  description: string;
  genres: string[];
  platforms: string[];
  tags: string[];
  team: CreateTeamMember[];
}

interface CreateTeamMember {
  userId: string;
  role: string;
}
