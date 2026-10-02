import StarRating from "./StarRating";

export default function ReviewList({ reviews }) {
  if (!reviews.length) return <p>No reviews yet.</p>;
  return (
    <ul>
      {reviews.map((r) => (
        <li key={r.id}>
          <strong>{r.nickname}</strong> <StarRating value={r.rating} />
          <p>{r.body}</p>
          <small>{r.created_at}</small>
        </li>
      ))}
    </ul>
  );
}