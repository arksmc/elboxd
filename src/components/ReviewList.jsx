import StarRating from "./StarRating";

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
        <small className="muted">{r.created_at}</small>
      </li>
    ))}
  </ul>
  );
}