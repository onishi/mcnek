import { hasCoordinates } from "../lib/coordinates";

type Props = {
  latitude: number | null;
  longitude: number | null;
};

export function StationCoordinates({ latitude, longitude }: Props) {
  return (
    <>
      <dt>位置情報</dt>
      <dd>
        {hasCoordinates({ latitude, longitude })
          ? `${latitude}, ${longitude}`
          : "未登録"}
      </dd>
    </>
  );
}
