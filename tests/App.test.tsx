import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";

test("トップページに見出しが表示される", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole("heading", { name: "道の駅一覧" }),
  ).toBeInTheDocument();
});
