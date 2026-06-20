import { render, screen } from "@testing-library/react";
import { StationCoordinates } from "../../src/components/StationCoordinates";

test("緯度経度がある場合は座標を表示する", () => {
  render(<StationCoordinates latitude={35.6895} longitude={139.6917} />);
  expect(screen.getByText("35.6895, 139.6917")).toBeInTheDocument();
});

test("緯度経度が未登録の場合は未登録と表示する", () => {
  render(<StationCoordinates latitude={null} longitude={null} />);
  expect(screen.getByText("未登録")).toBeInTheDocument();
});
