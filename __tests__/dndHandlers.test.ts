import {
  handleBoardDragEnd,
  type DragEndEventLike,
} from "@/lib/board/dnd";

describe("handleBoardDragEnd", () => {
  it("reorders lists when dragging lists", () => {
    const state = {
      listOrder: ["l1", "l2", "l3"],
      listsById: {
        l1: { id: "l1", cardIds: [] },
        l2: { id: "l2", cardIds: [] },
        l3: { id: "l3", cardIds: [] },
      },
    };

    const reorderLists = jest.fn();
    const moveCard = jest.fn();

    const event: DragEndEventLike = {
      active: { id: "l1", data: { current: { type: "list" } } },
      over: { id: "l3", data: { current: { type: "list" } } },
    };

    handleBoardDragEnd({
      event,
      state,
      actions: { reorderLists, moveCard },
    });

    expect(reorderLists).toHaveBeenCalledWith(0, 2);
    expect(moveCard).not.toHaveBeenCalled();
  });

  it("moves card within same list", () => {
    const state = {
      listOrder: ["l1"],
      listsById: {
        l1: { id: "l1", cardIds: ["c1", "c2", "c3"] },
      },
    };

    const reorderLists = jest.fn();
    const moveCard = jest.fn();

    const event: DragEndEventLike = {
      active: {
        id: "c1",
        data: { current: { type: "card", listId: "l1" } },
      },
      over: {
        id: "c3",
        data: { current: { type: "card", listId: "l1" } },
      },
    };

    handleBoardDragEnd({
      event,
      state,
      actions: { reorderLists, moveCard },
    });

    expect(moveCard).toHaveBeenCalledWith("c1", "l1", "l1", 2);
    expect(reorderLists).not.toHaveBeenCalled();
  });

  it("moves card between lists when dropped over another card", () => {
    const state = {
      listOrder: ["l1", "l2"],
      listsById: {
        l1: { id: "l1", cardIds: ["c1"] },
        l2: { id: "l2", cardIds: ["c2"] },
      },
    };

    const reorderLists = jest.fn();
    const moveCard = jest.fn();

    const event: DragEndEventLike = {
      active: {
        id: "c1",
        data: { current: { type: "card", listId: "l1" } },
      },
      over: {
        id: "c2",
        data: { current: { type: "card", listId: "l2" } },
      },
    };

    handleBoardDragEnd({
      event,
      state,
      actions: { reorderLists, moveCard },
    });

    expect(moveCard).toHaveBeenCalledWith("c1", "l1", "l2", 0);
  });

  it("moves card between lists when dropped over list container", () => {
    const state = {
      listOrder: ["l1", "l2"],
      listsById: {
        l1: { id: "l1", cardIds: ["c1"] },
        l2: { id: "l2", cardIds: ["c2"] },
      },
    };

    const reorderLists = jest.fn();
    const moveCard = jest.fn();

    const event: DragEndEventLike = {
      active: {
        id: "c1",
        data: { current: { type: "card", listId: "l1" } },
      },
      over: {
        id: "l2",
        data: { current: { type: "list" } },
      },
    };

    handleBoardDragEnd({
      event,
      state,
      actions: { reorderLists, moveCard },
    });

    expect(moveCard).toHaveBeenCalledWith("c1", "l1", "l2", 1);
  });
});

