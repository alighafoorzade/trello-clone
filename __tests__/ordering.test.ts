import {
  moveItemBetweenArrays,
  moveItemWithinArray,
  reorderArray,
} from "@/lib/board/ordering";

describe("ordering utilities", () => {
  it("reorders items within an array", () => {
    const input = ["a", "b", "c", "d"];
    const result = reorderArray(input, 1, 3);
    expect(result).toEqual(["a", "c", "d", "b"]);
  });

  it("returns original array when indices are invalid", () => {
    const input = ["a", "b", "c"];
    expect(reorderArray(input, -1, 2)).toBe(input);
    expect(reorderArray(input, 0, 10)).toBe(input);
  });

  it("moves an item within an array by id", () => {
    const items = [
      { id: "1", value: "a" },
      { id: "2", value: "b" },
      { id: "3", value: "c" },
    ];

    const result = moveItemWithinArray(items, "1", 2);
    expect(result.map((i) => i.id)).toEqual(["2", "3", "1"]);
  });

  it("returns original array when id not found", () => {
    const items = [
      { id: "1", value: "a" },
      { id: "2", value: "b" },
    ];

    expect(moveItemWithinArray(items, "missing", 1)).toBe(items);
  });

  it("moves item between arrays", () => {
    const source = ["a", "b", "c"];
    const destination = ["x", "y"];

    const { source: nextSource, destination: nextDestination } =
      moveItemBetweenArrays(source, destination, 1, 1);

    expect(nextSource).toEqual(["a", "c"]);
    expect(nextDestination).toEqual(["x", "b", "y"]);
  });

  it("returns originals when indices out of range", () => {
    const source = ["a", "b", "c"];
    const destination = ["x", "y"];

    const result = moveItemBetweenArrays(source, destination, -1, 0);
    expect(result.source).toBe(source);
    expect(result.destination).toBe(destination);
  });
});

