import "./VisitToggle.css";

type Props = {
  visited: boolean;
  onToggle: () => void;
};

export function VisitToggle({ visited, onToggle }: Props) {
  return (
    <button
      type="button"
      className="visit-toggle"
      aria-pressed={visited}
      onClick={onToggle}
    >
      {visited ? "行った済み" : "行った"}
    </button>
  );
}
