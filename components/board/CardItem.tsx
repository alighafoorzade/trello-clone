'use client';

import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { useBoardStore } from "@/store/boardStore";

export default function CardItem({
  cardId,
  onOpen,
  sortableRef,
  sortableProps,
  sortableStyle,
}: {
  cardId: string;
  onOpen: () => void;
  sortableRef?: (node: HTMLButtonElement | null) => void;
  sortableProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  sortableStyle?: CSSProperties;
}) {
  const card = useBoardStore((s) => s.cardsById[cardId]);
  const updateCardTitle = useBoardStore((s) => s.updateCardTitle);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(card?.title ?? "");
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isEditing && card) setDraft(card.title);
  }, [isEditing, card]);

  useEffect(() => {
    if (isEditing) titleInputRef.current?.focus();
  }, [isEditing]);

  if (!card) return null;

  const commit = () => {
    const next = draft.trim();
    if (next && next !== card.title) updateCardTitle(cardId, next);
    setIsEditing(false);
    setDraft(card.title);
  };

  return (
    <button
      type="button"
      ref={sortableRef}
      {...sortableProps}
      onClick={() => {
        if (!isEditing) onOpen();
      }}
      onDoubleClick={() => {
        if (!isEditing) setIsEditing(true);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !isEditing) onOpen();
      }}
      style={{
        padding: 10,
        borderRadius: 8,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        cursor: "pointer",
        display: "block",
        width: "100%",
        textAlign: "left",
        color: "inherit",
        ...(sortableStyle ?? {}),
      }}
    >
      {!isEditing ? (
        <span>{card.title}</span>
      ) : (
        <input
          aria-label={`Card title ${cardId}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setIsEditing(false);
              setDraft(card.title);
            }
          }}
          ref={titleInputRef}
          style={{ width: "100%" }}
        />
      )}
    </button>
  );
}

