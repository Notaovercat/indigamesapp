export interface IComment {
  id: string;
  content: string;
  gameId: string;
  createdAt: Date;
  isDeleted: boolean;
  isRedacted: boolean;
  user: ICommentAuthor;
}

export interface ICommentAuthor {
  id: string;
  username: string;
}
