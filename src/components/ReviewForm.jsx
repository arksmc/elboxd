import { useState } from "react";
import StarPicker from "./StarPicker";

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please pick a star rating.");
      return;
    }
    onSubmit({ rating, body: body.trim() });
    setRating(0);
    setBody("");
    setError("");
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>Write a review</h3>
      <StarPicker value={rating} onChange={setRating} />
      <textarea
        placeholder="What did you think? (optional)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={1000}
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn">
        Post review
      </button>
    </form>
  );
}