export type DragItemType = "list" | "card";

export type DragData =
  | { type: "list" }
  | { type: "card"; listId?: string }
  | undefined;

export type DragEndEventLike = {
  active: { id: string; data?: { current?: DragData } };
  over?: { id: string; data?: { current?: DragData } } | null;
};

export type BoardDndStateLike = {
  listOrder: string[];
  listsById: Record<string, { id: string; cardIds: string[] }>;
};

export type BoardDndActionsLike = {
  reorderLists: (from: number, to: number) => void;
  moveCard: (
    cardId: string,
    fromListId: string,
    toListId: string,
    toIndex: number
  ) => void;
};

function findListIdForCard(
  listsById: BoardDndStateLike["listsById"],
  cardId: string
): string | undefined {
  for (const list of Object.values(listsById)) {
    if (list.cardIds.includes(cardId)) return list.id;
  }
  return undefined;
}

export function handleBoardDragEnd(args: {
  event: DragEndEventLike;
  state: BoardDndStateLike;
  actions: BoardDndActionsLike;
}): void {
  const { event, state, actions } = args;

  const { active, over } = event;
  if (!over) return;

  const activeData = active.data?.current;
  const overData = over.data?.current;

  if (activeData?.type === "list") {
    const from = state.listOrder.indexOf(active.id);
    const to = state.listOrder.indexOf(over.id);
    if (from === -1 || to === -1) return;
    if (from === to) return;
    actions.reorderLists(from, to);
    return;
  }

  if (activeData?.type === "card") {
    const fromListId =
      activeData.listId ?? findListIdForCard(state.listsById, active.id);
    if (!fromListId) return;

    const fromList = state.listsById[fromListId];
    const fromIndex = fromList.cardIds.indexOf(active.id);
    if (fromIndex === -1) return;

    // Dropped over another card.
    if (overData?.type === "card") {
      const toListId =
        overData.listId ?? findListIdForCard(state.listsById, over.id);
      if (!toListId) return;

      const toList = state.listsById[toListId];
      const toIndex = toList.cardIds.indexOf(over.id);
      if (toIndex === -1) return;

      if (fromListId === toListId && fromIndex === toIndex) return;
      actions.moveCard(active.id, fromListId, toListId, toIndex);
      return;
    }

    // Dropped over a list container (we use the list id as droppable id).
    const overId = over.id;
    const toListId =
      overData?.type === "list"
        ? overId
        : state.listsById[overId]
          ? overId
          : undefined;
    if (!toListId) return;

    const toIndex = state.listsById[toListId]?.cardIds.length ?? 0;
    actions.moveCard(active.id, fromListId, toListId, toIndex);
  }
}

export type DragItemType = "list" | "card";

export type DragData =
  | { type: "list" }
  | { type: "card"; listId?: string }
  | undefined;

export type DragEndEventLike = {
  active: { id: string; data?: { current?: DragData } };
  over?: { id: string; data?: { current?: DragData } } | null;
};

export type BoardDndStateLike = {
  listOrder: string[];
  listsById: Record<string, { id: string; cardIds: string[] }>;
};

export type BoardDndActionsLike = {
  reorderLists: (from: number, to: number) => void;
  moveCard: (
    cardId: string,
    fromListId: string,
    toListId: string,
    toIndex: number
  ) => void;
};

function findListIdForCard(
  listsById: BoardDndStateLike["listsById"],
  cardId: string
): string | undefined {
  for (const list of Object.values(listsById)) {
    if (list.cardIds.includes(cardId)) return list.id;
  }
  return undefined;
}

export function handleBoardDragEnd(args: {
  event: DragEndEventLike;
  state: BoardDndStateLike;
  actions: BoardDndActionsLike;
}): void {
  const { event, state, actions } = args;

  const { active, over } = event;
  if (!over) return;

  const activeData = active.data?.current;
  const overData = over.data?.current;

  if (activeData?.type === "list") {
    const from = state.listOrder.indexOf(active.id);
    const to = state.listOrder.indexOf(over.id);
    if (from === -1 || to === -1) return;
    if (from === to) return;
    actions.reorderLists(from, to);
    return;
  }

  if (activeData?.type === "card") {
    const fromListId =
      activeData.listId ?? findListIdForCard(state.listsById, active.id);
    if (!fromListId) return;

    const fromList = state.listsById[fromListId];
    const fromIndex = fromList.cardIds.indexOf(active.id);
    if (fromIndex === -1) return;

    // Dropped over another card.
    if (overData?.type === "card") {
      const toListId =
        overData.listId ?? findListIdForCard(state.listsById, over.id);
      if (!toListId) return;

      const toList = state.listsById[toListId];
      const toIndex = toList.cardIds.indexOf(over.id);
      if (toIndex === -1) return;

      if (fromListId === toListId && fromIndex === toIndex) return;
      actions.moveCard(active.id, fromListId, toListId, toIndex);
      return;
    }

    // Dropped over a list container (we use the list id as droppable id).
    const overId = over.id;
    const toListId =
      overData?.type === "list"
        ? overId
        : state.listsById[overId]
          ? overId
          : undefined;
    if (!toListId) return;

    const toIndex = state.listsById[toListId]?.cardIds.length ?? 0;
    actions.moveCard(active.id, fromListId, toListId, toIndex);
  }
}

