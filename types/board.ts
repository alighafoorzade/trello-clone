export type ID = string;

export interface Comment {
  id: ID;
  cardId: ID;
  text: string;
  createdAt: string;
}

export interface Card {
  id: ID;
  title: string;
  description?: string;
  commentIds: ID[];
}

export interface List {
  id: ID;
  title: string;
  cardIds: ID[];
}

export interface Board {
  id: ID;
  title: string;
  listOrder: ID[];
}

export interface NormalizedBoardState {
  board: Board;
  listsById: Record<ID, List>;
  cardsById: Record<ID, Card>;
  commentsById: Record<ID, Comment>;
}

