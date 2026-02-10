'use client';

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardItem from "./CardItem";

export default function SortableCardItem({
  cardId,
  listId,
  onOpen,
}: {
  cardId: string;
  listId: string;
  onOpen: () => void;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: cardId,
    data: { type: "card" as const, listId },
  });

  return (
    <CardItem
      cardId={cardId}
      onOpen={onOpen}
      sortableRef={setNodeRef}
      sortableProps={{ ...attributes, ...listeners }}
      sortableStyle={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.85 : 1,
      }}
    />
  );
}

