import "./SearchFilter.css";

type Props = {
  query: string;
  onQueryChange: (query: string) => void;
};

export function SearchFilter({ query, onQueryChange }: Props) {
  return (
    <div className="search-filter">
      <input
        type="search"
        className="search-filter-query"
        placeholder="駅名で検索"
        aria-label="駅名で検索"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
    </div>
  );
}
