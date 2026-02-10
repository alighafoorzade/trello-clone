'use client';

import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { useBoardStore } from "@/store/boardStore";
import CardModal from "./CardModal";
import SortableBoardList from "./SortableBoardList";
import { handleBoardDragEnd, type DragEndEventLike } from "@/lib/board/dnd";

export default function BoardPage() {
  const boardTitle = useBoardStore((s) => s.board.title);
  const listOrder = useBoardStore((s) => s.board.listOrder);
  const renameBoard = useBoardStore((s) => s.renameBoard);
  const addList = useBoardStore((s) => s.addList);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(boardTitle);
  const [newListTitle, setNewListTitle] = useState("");
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // Keep draft in sync when store title changes (e.g. from another tab).
  useEffect(() => {
    if (!isEditingTitle) setTitleDraft(boardTitle);
  }, [boardTitle, isEditingTitle]);

  useEffect(() => {
    if (isEditingTitle) titleInputRef.current?.focus();
  }, [isEditingTitle]);

  const commitTitle = () => {
    const next = titleDraft.trim();
    if (next && next !== boardTitle) renameBoard(next);
    setIsEditingTitle(false);
    setTitleDraft(boardTitle);
  };

  const onAddList = () => {
    const next = newListTitle.trim();
    if (!next) return;
    addList(next);
    setNewListTitle("");
  };

  return (
    <main className="board-root">
      <header className="board-header">
        {!isEditingTitle ? (
          <button
            type="button"
            onClick={() => setIsEditingTitle(true)}
            aria-label="Edit board title"
            style={{
              background: "transparent",
              border: "none",
              color: "inherit",
              padding: 0,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <h1 className="board-header__title">{boardTitle}</h1>
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              aria-label="Board title"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitTitle();
                if (e.key === "Escape") {
                  setIsEditingTitle(false);
                  setTitleDraft(boardTitle);
                }
              }}
              ref={titleInputRef}
            />
            <button type="button" onClick={commitTitle}>
              Save
            </button>
          </div>
        )}
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) =>
          handleBoardDragEnd({
            event: event as DragEndEventLike,
            state: {
              listOrder,
              listsById: useBoardStore.getState().listsById,
            },
            actions: {
              reorderLists: (from, to) =>
                useBoardStore.getState().reorderLists(from, to),
              moveCard: (cardId, fromListId, toListId, toIndex) =>
                useBoardStore
                  .getState()
                  .moveCard(cardId as string, fromListId as string, toListId as string, toIndex),
            },
          })
        }
      >
        <section
          aria-label="Lists"
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            overflowX: "auto",
            paddingBottom: 8,
          }}
        >
          <SortableContext
            items={listOrder}
            strategy={horizontalListSortingStrategy}
          >
            {listOrder.map((listId) => (
              <SortableBoardList
                key={listId}
                listId={listId}
                onOpenCard={(cardId: string) => setOpenCardId(cardId)}
              />
            ))}
          </SortableContext>

          <div
            style={{
              minWidth: 280,
              padding: 12,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Add list</h2>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                aria-label="New list title"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onAddList();
                }}
                placeholder="List title"
              />
              <button type="button" onClick={onAddList} aria-label="Add list">
                Add
              </button>
            </div>
          </div>
        </section>
      </DndContext>

      {openCardId ? (
        <CardModal cardId={openCardId} onClose={() => setOpenCardId(null)} />
      ) : null}
    </main>
  );
}

