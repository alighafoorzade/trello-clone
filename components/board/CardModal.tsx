'use client';

import { useEffect, useId, useRef, useState } from "react";
import { useBoardStore } from "@/store/boardStore";

export default function CardModal({
  cardId,
  onClose,
}: {
  cardId: string;
  onClose: () => void;
}) {
  const card = useBoardStore((s) => s.cardsById[cardId]);
  const commentsById = useBoardStore((s) => s.commentsById);
  const updateCardTitle = useBoardStore((s) => s.updateCardTitle);
  const addComment = useBoardStore((s) => s.addComment);

  const [titleDraft, setTitleDraft] = useState(card?.title ?? "");
  const [commentDraft, setCommentDraft] = useState("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const titleInputId = useId();

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  useEffect(() => {
    if (card) setTitleDraft(card.title);
  }, [card]);

  if (!card) return null;

  const commitTitle = () => {
    const next = titleDraft.trim();
    if (next && next !== card.title) updateCardTitle(cardId, next);
    setTitleDraft(card.title);
  };

  const submitComment = () => {
    const next = commentDraft.trim();
    if (!next) return;
    addComment(cardId, next);
    setCommentDraft("");
  };

  const comments = card.commentIds
    .map((id) => commentsById[id])
    .filter(Boolean);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 50,
      }}
    >
      <button
        type="button"
        aria-label="Close card modal overlay"
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "transparent",
          border: "none",
          padding: 0,
          margin: 0,
          cursor: "default",
        }}
      />
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-label="Card modal"
        style={{
          position: "relative",
          width: "min(720px, 100%)",
          background: "#0f172a",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 12,
          padding: 16,
          outline: "none",
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        <header style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <label
              htmlFor={titleInputId}
              style={{ display: "block", fontSize: 12, opacity: 0.8 }}
            >
              Title
            </label>
            <input
              aria-label="Card modal title"
              id={titleInputId}
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitTitle();
              }}
              style={{ width: "100%" }}
            />
          </div>

          <button type="button" onClick={onClose} aria-label="Close card modal">
            Close
          </button>
        </header>

        <section style={{ marginTop: 16 }}>
          <h3 style={{ margin: "0 0 8px 0" }}>Comments</h3>

          {comments.length === 0 ? (
            <p style={{ margin: 0, opacity: 0.8 }}>No comments yet.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
              {comments.map((c) => (
                <li key={c.id}>
                  <div style={{ whiteSpace: "pre-wrap" }}>{c.text}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            <textarea
              aria-label="New comment"
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              rows={3}
              placeholder="Write a comment..."
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={submitComment}
                aria-label="Add comment"
              >
                Add comment
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

