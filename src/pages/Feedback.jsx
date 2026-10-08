import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useUser from "../lib/useUser";
import { createFeedback, getMyFeedback } from "../lib/api";
import LoginForm from "../components/LoginForm";
import Meta from "../components/Meta";
import { formatDate } from "../lib/format";

const CATEGORIES = [
  ["feature", "Feature idea"],
  ["bug", "Something's broken"],
  ["eatery", "Eatery info is wrong"],
  ["other", "Other"],
];
const STATUS = { open: "Received", planned: "Planned", done: "Done", declined: "Not planned" };

export default function Feedback() {
  const { user, loading } = useUser();
  const [category, setCategory] = useState("feature");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState("");
  const [status, setStatus] = useState("idle");
  const [mine, setMine] = useState([]);

  function refresh() {
    getMyFeedback().then(setMine).catch(console.error);
  }
  useEffect(() => { if (user) refresh(); }, [user?.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 10000));
    try {
      await Promise.race([
        createFeedback({ userId: user.id, category, message: message.trim(), page: page.trim() }),
        timeout,
      ]);
      setStatus("done");
      refresh();
    } catch (err) {
      console.error(err);
      setStatus(err.message === "timeout" ? "timeout" : err.message?.includes("limit") ? "limit" : "error");
    }
  }

  function closePopup() {
    setMessage(""); setPage(""); setCategory("feature"); setStatus("idle");
  }

  if (loading) return <p className="muted">Loading...</p>;

  return (
    <main>
      <Meta title="Feedback" description="Tell us how to improve VOUCH." />
      <h1>Feedback</h1>
      <p className="banner">
        I read every message, but I can't promise every idea gets built. Similar requests get
        grouped, and the more people ask for something, the higher it moves. I'll reply here
        when I can, so check back on this page.
      </p>

      {!user ? (
        <LoginForm />
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </select>
          <textarea
            placeholder="What would make VOUCH better?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            minLength={5}
            maxLength={1000}
            required
          />
          <input
            placeholder="Which page? (optional)"
            value={page}
            onChange={(e) => setPage(e.target.value)}
            maxLength={100}
          />
          {status === "error" && <p className="error">Couldn't send. Try again.</p>}
          {status === "limit" && <p className="error">You've hit today's limit of 5 messages.</p>}
          {status === "timeout" && (
            <p className="error">Taking too long. It may not have gone through, so refresh and try again.</p>
          )}
          <button className="btn" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send feedback"}
          </button>
        </form>
      )}

      {mine.length > 0 && (
        <>
          <div className="section-head"><h2>Your feedback</h2></div>
          <ul className="review-list">
            {mine.map((f) => (
              <li key={f.id} className="review">
                <div className="review-head">
                  <small className="muted">{formatDate(f.created_at)}</small>
                  <span className="tag">{STATUS[f.status]}</span>
                </div>
                <p>{f.message}</p>
                {f.reply && <p className="reply"><b>Reply:</b> {f.reply}</p>}
              </li>
            ))}
          </ul>
        </>
      )}

      {status === "done" && (
        <div className="popup-backdrop" role="dialog" aria-modal="true">
          <div className="popup">
            <div className="popup-icon">✓</div>
            <h2>Feedback received</h2>
            <p className="muted">Thank you! Check this page later for a reply.</p>
            <div className="form-actions">
              <button className="btn" type="button" onClick={closePopup}>Done</button>
              <Link to="/" className="link-btn">Back home</Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}