import { render, screen } from "@testing-library/react";
import BoardPage from "@/components/board/BoardPage";

describe("BoardPage", () => {
  it("renders Demo Board title", () => {
    render(<BoardPage />);
    expect(screen.getByText(/demo board/i)).toBeInTheDocument();
  });
});

