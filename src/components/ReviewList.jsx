import StarRating from "./StarRating";
import { formatDate } from "../lib/format";

export default function ReviewList({ reviews }) {
  if (!reviews.length) return <p className="banner">No reviews yet. Be the first to review!</p>;
  return (
      <ul className="review-list">
    {reviews.map((r) => (
      <li key={r.id} className="review">
        <div className="review-head">
          <strong>{r.nickname}</strong>
          <StarRating value={r.rating} />
        </div>
        <p>{r.body}</p>
        <small className="muted">{formatDate(r.created_at)}</small>
      </li>
    ))}
  </ul>
  );
}