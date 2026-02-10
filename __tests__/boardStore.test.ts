import { act } from "react";
import { useBoardStore } from "@/store/boardStore";

const getSnapshot = () => {
  const state = useBoardStore.getState();
  return {
    board: state.board,
    listsById: state.listsById,
    cardsById: state.cardsById,
    commentsById: state.commentsById,
  };
};

describe("board store", () => {
  let initialSnapshot = getSnapshot();

  beforeAll(() => {
    initialSnapshot = getSnapshot();
  });

  beforeEach(() => {
    // Reset store to initial demo state between tests.
    useBoardStore.setState((state) => ({ ...state, ...initialSnapshot }), true);
  });

  it("has an initial board shape", () => {
    const state = useBoardStore.getState();
    expect(state.board.title).toBeTruthy();
    expect(state.board.listOrder.length).toBeGreaterThan(0);
  });

  it("can rename board", () => {
    act(() => {
      useBoardStore.getState().renameBoard("New Title");
    });

    expect(useBoardStore.getState().board.title).toBe("New Title");
  });

  it("can add and remove lists", () => {
    const before = useBoardStore.getState().board.listOrder.length;

    let newListId = "";
    act(() => {
      useBoardStore.getState().addList("New List");
      const state = useBoardStore.getState();
      newListId = state.board.listOrder[state.board.listOrder.length - 1];
    });

    const afterAdd = useBoardStore.getState().board.listOrder.length;
    expect(afterAdd).toBe(before + 1);

    act(() => {
      useBoardStore.getState().removeList(newListId);
    });

    const afterRemove = useBoardStore.getState().board.listOrder.length;
    expect(afterRemove).toBe(before);
  });

  it("can add and update a card", () => {
    const state = useBoardStore.getState();
    const listId = state.board.listOrder[0];

    let cardId = "";
    act(() => {
      useBoardStore.getState().addCard(listId, "New Card");
      const next = useBoardStore.getState();
      const list = next.listsById[listId];
      cardId = list.cardIds[list.cardIds.length - 1];
    });

    act(() => {
      useBoardStore.getState().updateCardTitle(cardId, "Updated Title");
    });

    expect(useBoardStore.getState().cardsById[cardId].title).toBe(
      "Updated Title"
    );
  });

  it("can move a card between lists", () => {
    const initial = useBoardStore.getState();
    const [firstListId, secondListId] = initial.board.listOrder;
    const firstList = initial.listsById[firstListId];
    const cardId = firstList.cardIds[0];

    act(() => {
      useBoardStore
        .getState()
        .moveCard(cardId, firstListId, secondListId, 0);
    });

    const next = useBoardStore.getState();
    expect(next.listsById[firstListId].cardIds).not.toContain(cardId);
    expect(next.listsById[secondListId].cardIds[0]).toBe(cardId);
  });

  it("can add a comment to a card", () => {
    const initial = useBoardStore.getState();
    const firstListId = initial.board.listOrder[0];
    const firstCardId = initial.listsById[firstListId].cardIds[0];

    act(() => {
      useBoardStore.getState().addComment(firstCardId, "Hello world");
    });

    const next = useBoardStore.getState();
    const card = next.cardsById[firstCardId];
    expect(card.commentIds.length).toBeGreaterThan(0);

    const commentId = card.commentIds[0];
    expect(next.commentsById[commentId].text).toBe("Hello world");
  });
});

