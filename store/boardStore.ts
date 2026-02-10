import { create } from "zustand";
import type {
  Board,
  Card,
  Comment,
  ID,
  List,
  NormalizedBoardState,
} from "@/types/board";
import { loadState, saveState } from "@/lib/storage/localStorage";
import { reorderArray } from "@/lib/board/ordering";

const STORAGE_KEY = "trello-clone-board-state";

type BoardSnapshot = NormalizedBoardState;

export interface BoardStoreState extends BoardSnapshot {
  renameBoard: (title: string) => void;
  addList: (title: string) => void;
  updateListTitle: (listId: ID, title: string) => void;
  removeList: (listId: ID) => void;
  reorderLists: (from: number, to: number) => void;
  addCard: (listId: ID, title: string) => void;
  updateCardTitle: (cardId: ID, title: string) => void;
  moveCard: (cardId: ID, fromListId: ID, toListId: ID, toIndex: number) => void;
  addComment: (cardId: ID, text: string) => void;
}

const createId = (() => {
  let counter = 0;
  return () => {
    counter += 1;
    return `id_${Date.now()}_${counter}`;
  };
})();

const createDemoState = (): BoardSnapshot => {
  const todoListId: ID = createId();
  const inProgressListId: ID = createId();
  const doneListId: ID = createId();

  const card1Id: ID = createId();
  const card2Id: ID = createId();
  const card3Id: ID = createId();

  const board: Board = {
    id: createId(),
    title: "Demo Board",
    listOrder: [todoListId, inProgressListId, doneListId],
  };

  const listsById: Record<ID, List> = {
    [todoListId]: {
      id: todoListId,
      title: "To Do",
      cardIds: [card1Id, card2Id],
    },
    [inProgressListId]: {
      id: inProgressListId,
      title: "In Progress",
      cardIds: [card3Id],
    },
    [doneListId]: {
      id: doneListId,
      title: "Done",
      cardIds: [],
    },
  };

  const cardsById: Record<ID, Card> = {
    [card1Id]: {
      id: card1Id,
      title: "Set up project",
      description: "Initialize Next.js and tooling",
      commentIds: [],
    },
    [card2Id]: {
      id: card2Id,
      title: "Design board state",
      description: "Define types and store",
      commentIds: [],
    },
    [card3Id]: {
      id: card3Id,
      title: "Implement basic UI",
      description: "Render lists and cards",
      commentIds: [],
    },
  };

  const commentsById: Record<ID, Comment> = {};

  return {
    board,
    listsById,
    cardsById,
    commentsById,
  };
};

const snapshotFromState = (state: BoardStoreState): BoardSnapshot => ({
  board: state.board,
  listsById: state.listsById,
  cardsById: state.cardsById,
  commentsById: state.commentsById,
});

export const useBoardStore = create<BoardStoreState>((set, get) => {
  const initialFromStorage =
    loadState<BoardSnapshot>(STORAGE_KEY) ?? createDemoState();

  return {
    ...initialFromStorage,

    renameBoard: (title: string) =>
      set((state) => ({
        board: { ...state.board, title },
      })),

    addList: (title: string) =>
      set((state) => {
        const id = createId();
        const list: List = { id, title, cardIds: [] };
        return {
          listsById: { ...state.listsById, [id]: list },
          board: {
            ...state.board,
            listOrder: [...state.board.listOrder, id],
          },
        };
      }),

    updateListTitle: (listId: ID, title: string) =>
      set((state) => {
        const list = state.listsById[listId];
        if (!list) return state;
        return {
          listsById: {
            ...state.listsById,
            [listId]: { ...list, title },
          },
        };
      }),

    removeList: (listId: ID) =>
      set((state) => {
        const { [listId]: removedList, ...restLists } = state.listsById;
        if (!removedList) return state;

        const nextCardsById = { ...state.cardsById };
        removedList.cardIds.forEach((cardId) => {
          delete nextCardsById[cardId];
        });

        return {
          listsById: restLists,
          cardsById: nextCardsById,
          board: {
            ...state.board,
            listOrder: state.board.listOrder.filter((id) => id !== listId),
          },
        };
      }),

    reorderLists: (from: number, to: number) =>
      set((state) => {
        const order = [...state.board.listOrder];
        if (
          from === to ||
          from < 0 ||
          to < 0 ||
          from >= order.length ||
          to >= order.length
        ) {
          return state;
        }

        const [moved] = order.splice(from, 1);
        order.splice(to, 0, moved);

        return {
          board: {
            ...state.board,
            listOrder: order,
          },
        };
      }),

    addCard: (listId: ID, title: string) =>
      set((state) => {
        const list = state.listsById[listId];
        if (!list) return state;

        const id = createId();
        const card: Card = {
          id,
          title,
          description: "",
          commentIds: [],
        };

        return {
          cardsById: {
            ...state.cardsById,
            [id]: card,
          },
          listsById: {
            ...state.listsById,
            [listId]: {
              ...list,
              cardIds: [...list.cardIds, id],
            },
          },
        };
      }),

    updateCardTitle: (cardId: ID, title: string) =>
      set((state) => {
        const card = state.cardsById[cardId];
        if (!card) return state;
        return {
          cardsById: {
            ...state.cardsById,
            [cardId]: { ...card, title },
          },
        };
      }),

    moveCard: (cardId: ID, fromListId: ID, toListId: ID, toIndex: number) =>
      set((state) => {
        const fromList = state.listsById[fromListId];
        const toList = state.listsById[toListId];
        if (!fromList || !toList) return state;

        const fromIndex = fromList.cardIds.indexOf(cardId);
        if (fromIndex === -1) return state;

        if (fromListId === toListId) {
          const nextIds = reorderArray(fromList.cardIds, fromIndex, toIndex);
          return {
            listsById: {
              ...state.listsById,
              [fromListId]: { ...fromList, cardIds: nextIds },
            },
          };
        }

        const nextFromIds = [...fromList.cardIds];
        nextFromIds.splice(fromIndex, 1);

        const nextToIds = [...toList.cardIds];
        const clampedIndex = Math.max(0, Math.min(toIndex, nextToIds.length));
        nextToIds.splice(clampedIndex, 0, cardId);

        return {
          listsById: {
            ...state.listsById,
            [fromListId]: { ...fromList, cardIds: nextFromIds },
            [toListId]: { ...toList, cardIds: nextToIds },
          },
        };
      }),

    addComment: (cardId: ID, text: string) =>
      set((state) => {
        const card = state.cardsById[cardId];
        if (!card || !text.trim()) return state;

        const id = createId();
        const comment: Comment = {
          id,
          cardId,
          text,
          createdAt: new Date().toISOString(),
        };

        return {
          commentsById: {
            ...state.commentsById,
            [id]: comment,
          },
          cardsById: {
            ...state.cardsById,
            [cardId]: {
              ...card,
              commentIds: [...card.commentIds, id],
            },
          },
        };
      }),
  };
});

// Client-side persistence wiring.
if (typeof window !== "undefined") {
  const persisted = loadState<BoardSnapshot>(STORAGE_KEY);
  if (persisted) {
    useBoardStore.setState((current) => ({
      ...current,
      ...persisted,
    }));
  }

  useBoardStore.subscribe((state) => {
    const snapshot = snapshotFromState(state);
    saveState(STORAGE_KEY, snapshot);
  });
}

