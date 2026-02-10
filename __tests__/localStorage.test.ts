import { loadState, saveState } from "@/lib/storage/localStorage";

const STORAGE_KEY = "test-key";

describe("localStorage helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
  });

  it("returns undefined when nothing stored", () => {
    const result = loadState(STORAGE_KEY);
    expect(result).toBeUndefined();
  });

  it("saves and loads state round-trip", () => {
    const value = { foo: "bar", count: 3 };
    saveState(STORAGE_KEY, value);

    const loaded = loadState<typeof value>(STORAGE_KEY);
    expect(loaded).toEqual(value);
  });

  it("handles invalid JSON gracefully", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not-json");

    const loaded = loadState(STORAGE_KEY);
    expect(loaded).toBeUndefined();
  });
});

