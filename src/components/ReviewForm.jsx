import { useState } from "react";
import StarPicker from "./StarPicker";

export default function ReviewForm({ initial, onSubmit, onDelete }) {
  const [rating, setRating] = useState(Number(initial?.rating ?? 0));
  const [body, setBody] = useState(initial?.body ?? "");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const editing = Boolean(initial);

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please pick a star rating.");
      return;
    }
    setError("");
    setSaved(false);
    await onSubmit({ rating, body: body.trim() });
    setSaved(true);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>{editing ? "Edit your review" : "Write a review"}</h3>
      <StarPicker value={rating} onChange={setRating} />
      <textarea
        placeholder="What did you think? (optional)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={1000}
      />
      {error && <p className="error">{error}</p>}
      {saved && <p className="muted">Saved.</p>}
      <div className="form-actions">
        <button className="btn" type="submit">
          {editing ? "Update review" : "Post review"}
        </button>
        {editing && (
          <button className="link-btn danger" type="button" onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </form>
  );
}