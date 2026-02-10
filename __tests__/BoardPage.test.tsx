import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BoardPage from "@/components/board/BoardPage";
import { useBoardStore } from "@/store/boardStore";

const resetStoreForTest = () => {
  useBoardStore.setState(
    (state) => ({
      ...state,
      board: { id: "b1", title: "Demo Board", listOrder: ["l1"] },
      listsById: {
        l1: { id: "l1", title: "To Do", cardIds: ["c1"] },
      },
      cardsById: {
        c1: {
          id: "c1",
          title: "First card",
          description: "",
          commentIds: ["cm1"],
        },
      },
      commentsById: {
        cm1: {
          id: "cm1",
          cardId: "c1",
          text: "Existing comment",
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      },
    }),
    false
  );
  window.localStorage.clear();
};

describe("BoardPage", () => {
  beforeEach(() => {
    resetStoreForTest();
  });

  it("renders board title, lists, and cards from the store", () => {
    render(<BoardPage />);
    expect(screen.getByText(/demo board/i)).toBeInTheDocument();
    expect(screen.getByText(/to do/i)).toBeInTheDocument();
    expect(screen.getByText(/first card/i)).toBeInTheDocument();
  });

  it("allows editing the board title", async () => {
    const user = userEvent.setup();
    render(<BoardPage />);

    await user.click(screen.getByRole("button", { name: /edit board title/i }));
    const input = screen.getByRole("textbox", { name: /board title/i });

    await user.clear(input);
    await user.type(input, "My Board{enter}");

    expect(screen.getByText(/my board/i)).toBeInTheDocument();
  });

  it("allows adding a list and a card via UI", async () => {
    const user = userEvent.setup();
    render(<BoardPage />);

    await user.type(
      screen.getByRole("textbox", { name: /new list title/i }),
      "New List"
    );
    await user.click(screen.getByRole("button", { name: /add list/i }));

    expect(screen.getByText(/new list/i)).toBeInTheDocument();

    // Add a card to the new list (it will be the last list).
    const listTitle = screen.getByText(/new list/i);
    const listContainer = listTitle.closest("div");
    expect(listContainer).toBeTruthy();

    const cardTitleInput = screen.getAllByRole("textbox", {
      name: /new card title/i,
    })[1];

    await user.type(cardTitleInput, "New Card");
    await user.click(screen.getAllByRole("button", { name: /add card/i })[1]);

    expect(screen.getByText(/new card/i)).toBeInTheDocument();
  });

  it("opens card modal, shows comments, adds a comment, and closes", async () => {
    const user = userEvent.setup();
    render(<BoardPage />);

    await user.click(screen.getByRole("button", { name: /first card/i }));

    expect(screen.getByRole("dialog", { name: /card modal/i })).toBeInTheDocument();
    expect(screen.getByText(/existing comment/i)).toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: /new comment/i }), "Hello!");
    await user.click(screen.getByRole("button", { name: /add comment/i }));

    expect(screen.getByText(/hello!/i)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /^close card modal$/i })
    );
    expect(
      screen.queryByRole("dialog", { name: /card modal/i })
    ).not.toBeInTheDocument();
  });
});

