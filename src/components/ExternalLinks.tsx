import "./ExternalLinks.css";

type Props = {
  mlitSourceUrl: string;
  associationSourceUrl: string | null;
};

export function ExternalLinks({ mlitSourceUrl, associationSourceUrl }: Props) {
  return (
    <ul className="external-links">
      <li>
        <a href={mlitSourceUrl} target="_blank" rel="noopener noreferrer">
          国土交通省の一覧を見る
        </a>
      </li>
      <li>
        {associationSourceUrl ? (
          <a
            href={associationSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            全国「道の駅」連絡会の詳細を見る
          </a>
        ) : (
          <span className="external-links-unavailable">
            全国「道の駅」連絡会の詳細は未登録です
          </span>
        )}
      </li>
    </ul>
  );
}
