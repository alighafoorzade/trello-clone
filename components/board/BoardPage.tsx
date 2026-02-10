'use client';

import { useEffect, useRef, useState } from "react";
import { useBoardStore } from "@/store/boardStore";
import BoardList from "./BoardList";
import CardModal from "./CardModal";

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
    <main style={{ padding: 16 }}>
      <header style={{ marginBottom: 16 }}>
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
            <h1 style={{ margin: 0 }}>{boardTitle}</h1>
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
        {listOrder.map((listId) => (
          <BoardList
            key={listId}
            listId={listId}
            onOpenCard={(cardId: string) => setOpenCardId(cardId)}
          />
        ))}

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

      {openCardId ? (
        <CardModal cardId={openCardId} onClose={() => setOpenCardId(null)} />
      ) : null}
    </main>
  );
}

