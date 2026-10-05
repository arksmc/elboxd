import StarRating from "./StarRating";
import ReportButton from "./ReportButton";
import { formatDate } from "../lib/format";
import { Link } from "react-router-dom";

export default function ReviewList({ reviews, canReport = false }) {
  if (!reviews.length)
    return <p className="banner">No reviews yet. Be the first to review!</p>;
  return (
    <ul className="review-list">
      {reviews.map((r) => (
        <li key={r.id} className="review">
          <div className="review-head">
            <strong>
  {r.nickname === "Anonymous" ? r.nickname : <Link to={`/u/${encodeURIComponent(r.nickname)}`}>{r.nickname}</Link>}
</strong>
            <StarRating value={r.rating} />
          </div>
          <p>{r.body}</p>
          <div className="review-foot">
            <small className="muted">{formatDate(r.created_at)}</small>
            {canReport && <ReportButton reviewId={r.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
}