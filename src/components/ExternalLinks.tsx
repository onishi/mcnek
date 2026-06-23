import "./ExternalLinks.css";

type Props = {
  mlitSourceUrl: string;
  associationSourceUrls: string[];
};

export function ExternalLinks({
  mlitSourceUrl,
  associationSourceUrls,
}: Props) {
  return (
    <ul className="external-links">
      <li>
        <a href={mlitSourceUrl} target="_blank" rel="noopener noreferrer">
          国土交通省の一覧を見る
        </a>
      </li>
      {associationSourceUrls.length === 0 ? (
        <li>
          <span className="external-links-unavailable">
            全国「道の駅」連絡会の詳細は未登録です
          </span>
        </li>
      ) : (
        associationSourceUrls.map((url, index) => (
          <li key={url}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              全国「道の駅」連絡会の詳細を見る
              {associationSourceUrls.length > 1 ? `（${index + 1}）` : ""}
            </a>
          </li>
        ))
      )}
    </ul>
  );
}
