import StarRating from "./StarRating";
import ReportButton from "./ReportButton";
import LikeButton from "./LikeButton";
import { formatDate } from "../lib/format";

export default function ReviewList({ reviews, canReport = false, likedIds }) {
  if (!reviews.length)
    return <p className="banner">No reviews yet. Be the first to review!</p>;

  return (
    <ul className="review-list">
      {reviews.map((r) => (
        <li key={r.id} className="review">
          <div className="review-head">
            <strong>{r.nickname}</strong>
            <StarRating value={r.rating} />
          </div>
          <p>{r.body}</p>
          <div className="review-foot">
            <span className="foot-left">
              <LikeButton
                reviewId={r.id}
                count={r.like_count}
                liked={likedIds?.has(r.id)}
              />
              <small className="muted">{formatDate(r.created_at)}</small>
            </span>
            {canReport && <ReportButton reviewId={r.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
}