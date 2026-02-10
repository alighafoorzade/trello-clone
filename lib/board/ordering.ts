/**
 * Return a new array with the item at `from` moved to `to`.
 */
export function reorderArray<T>(items: T[], from: number, to: number): T[] {
  if (
    from === to ||
    from < 0 ||
    to < 0 ||
    from >= items.length ||
    to >= items.length
  ) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

/**
 * Move a specific item within an array by id.
 */
export function moveItemWithinArray<T extends { id: string }>(
  items: T[],
  id: string,
  toIndex: number
): T[] {
  const fromIndex = items.findIndex((item) => item.id === id);
  if (fromIndex === -1) return items;
  return reorderArray(items, fromIndex, toIndex);
}

/**
 * Move an item from one array to another by index.
 */
export function moveItemBetweenArrays<T>(
  source: T[],
  destination: T[],
  fromIndex: number,
  toIndex: number
): { source: T[]; destination: T[] } {
  if (
    fromIndex < 0 ||
    fromIndex >= source.length ||
    toIndex < 0 ||
    toIndex > destination.length
  ) {
    return { source, destination };
  }

  const sourceCopy = [...source];
  const destCopy = [...destination];

  const [moved] = sourceCopy.splice(fromIndex, 1);
  destCopy.splice(toIndex, 0, moved);

  return { source: sourceCopy, destination: destCopy };
}

