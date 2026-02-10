'use client';

import { useEffect, useRef, useState } from "react";
import { useBoardStore } from "@/store/boardStore";
import CardItem from "./CardItem";

export default function BoardList({
  listId,
  onOpenCard,
}: {
  listId: string;
  onOpenCard: (cardId: string) => void;
}) {
  const list = useBoardStore((s) => s.listsById[listId]);
  const cardsById = useBoardStore((s) => s.cardsById);
  const updateListTitle = useBoardStore((s) => s.updateListTitle);
  const removeList = useBoardStore((s) => s.removeList);
  const addCard = useBoardStore((s) => s.addCard);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(list?.title ?? "");
  const [newCardTitle, setNewCardTitle] = useState("");
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isEditingTitle && list) setTitleDraft(list.title);
  }, [isEditingTitle, list]);

  useEffect(() => {
    if (isEditingTitle) titleInputRef.current?.focus();
  }, [isEditingTitle]);

  if (!list) return null;

  const commitTitle = () => {
    const next = titleDraft.trim();
    if (next && next !== list.title) updateListTitle(listId, next);
    setIsEditingTitle(false);
    setTitleDraft(list.title);
  };

  const onAddCard = () => {
    const next = newCardTitle.trim();
    if (!next) return;
    addCard(listId, next);
    setNewCardTitle("");
  };

  return (
    <section
      aria-label={`List ${list.title}`}
      style={{
        minWidth: 280,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 8,
        padding: 12,
      }}
    >
      <header style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {!isEditingTitle ? (
          <button
            type="button"
            onClick={() => setIsEditingTitle(true)}
            aria-label={`Edit list title ${list.title}`}
            style={{
              background: "transparent",
              border: "none",
              color: "inherit",
              padding: 0,
              cursor: "pointer",
              flex: 1,
              textAlign: "left",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 16 }}>{list.title}</h2>
          </button>
        ) : (
          <input
            aria-label={`List title ${listId}`}
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitTitle();
              if (e.key === "Escape") {
                setIsEditingTitle(false);
                setTitleDraft(list.title);
              }
            }}
            ref={titleInputRef}
            style={{ flex: 1 }}
          />
        )}

        <button
          type="button"
          aria-label={`Delete list ${list.title}`}
          onClick={() => removeList(listId)}
        >
          Delete
        </button>
      </header>

      <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
        {list.cardIds.map((cardId) => {
          const card = cardsById[cardId];
          if (!card) return null;
          return (
            <CardItem
              key={cardId}
              cardId={cardId}
              onOpen={() => onOpenCard(cardId)}
            />
          );
        })}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <input
          aria-label={`New card title ${listId}`}
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onAddCard();
          }}
          placeholder="Add a card"
          style={{ flex: 1 }}
        />
        <button type="button" onClick={onAddCard} aria-label="Add card">
          Add
        </button>
      </div>
    </section>
  );
}

