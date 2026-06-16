import { render, screen } from "@testing-library/react";
import App from "../src/App";

test("トップページに見出しが表示される", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: "道の駅一覧" }),
  ).toBeInTheDocument();
});
