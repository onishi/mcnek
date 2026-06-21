import { fireEvent, render, screen } from "@testing-library/react";
import { VisitToggle } from "../../src/components/VisitToggle";

test("未訪問の場合は「行った」ボタンを表示する", () => {
  render(<VisitToggle visited={false} onToggle={() => {}} />);
  const button = screen.getByRole("button", { name: "行った" });
  expect(button).toHaveAttribute("aria-pressed", "false");
});

test("訪問済みの場合は「行った済み」ボタンを表示する", () => {
  render(<VisitToggle visited={true} onToggle={() => {}} />);
  const button = screen.getByRole("button", { name: "行った済み" });
  expect(button).toHaveAttribute("aria-pressed", "true");
});

test("クリックすると onToggle が呼ばれる", () => {
  const onToggle = jest.fn();
  render(<VisitToggle visited={false} onToggle={onToggle} />);
  fireEvent.click(screen.getByRole("button"));
  expect(onToggle).toHaveBeenCalledTimes(1);
});
