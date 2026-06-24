import { act, render, screen } from "@testing-library/react";
import { PwaStatusBanner } from "../../src/components/PwaStatusBanner";

function setOnline(value: boolean) {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    value,
  });
}

afterEach(() => {
  setOnline(true);
});

test("オンライン時は何も表示しない", () => {
  setOnline(true);
  render(<PwaStatusBanner />);
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

test("オフライン時はオフラインである旨を表示する", () => {
  setOnline(false);
  render(<PwaStatusBanner />);
  expect(
    screen.getByText("オフラインです。表示中のデータは最新でない可能性があります。"),
  ).toBeInTheDocument();
});

test("offlineイベントを受けてオフライン表示に切り替わる", () => {
  setOnline(true);
  render(<PwaStatusBanner />);
  expect(screen.queryByRole("status")).not.toBeInTheDocument();

  act(() => {
    setOnline(false);
    window.dispatchEvent(new Event("offline"));
  });

  expect(
    screen.getByText("オフラインです。表示中のデータは最新でない可能性があります。"),
  ).toBeInTheDocument();
});
