import { Link } from "react-router-dom";

export default function EateryCard({ eatery, stats }) {
  const title = eatery.branch ? `${eatery.name} ${eatery.branch}` : eatery.name;
  return (
    <Link to={`/eatery/${eatery.slug}`} className="card">
      <h3>{title}</h3>
      <p className="muted">{eatery.area}</p>
      <span className="tag">{eatery.category}</span>
      {stats !== undefined && (
        <p className="muted">
          {stats ? `★ ${stats.avg_rating} (${stats.review_count})` : "No reviews yet"}
        </p>
      )}
    </Link>
  );
}