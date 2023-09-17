export interface IProfile {
  id: string;
  username: string;
  email: string;
  description: string | null;
  createdAt: Date;
}
