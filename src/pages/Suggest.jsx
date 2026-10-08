import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEateries, createSuggestion } from "../lib/api";
import useUser from "../lib/useUser";
import LoginForm from "../components/LoginForm";
import Meta from "../components/Meta";

const label = (e) => (e.branch ? `${e.name} ${e.branch}` : e.name);
const unique = (arr) => [...new Set(arr.filter(Boolean))].sort();

export default function Suggest() {
  const { user, loading } = useUser();
  const [eateries, setEateries] = useState([]);
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("idle");
  const [otherArea, setOtherArea] = useState("");

  useEffect(() => {
    getEateries().then(setEateries).catch(console.error);
  }, []);

  const q = name.trim().toLowerCase();
  const matches =
    q.length >= 2
      ? eateries.filter((e) => label(e).toLowerCase().includes(q)).slice(0, 5)
      : [];

  async function handleSubmit(e) {
  e.preventDefault();
  if (status === "sending") return;
  setStatus("sending");

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), 10000)
  );

  try {
    await Promise.race([
      createSuggestion({
        userId: user.id,
        name: name.trim(),
        area: area === "Other" ? otherArea.trim() : area,
        category,
        note: note.trim(),
      }),
      timeout,
    ]);
    setStatus("done");
  } catch (err) {
    console.error(err);
    setStatus(
      err.message === "timeout" ? "timeout"
      : err.message?.includes("limit") ? "limit"
      : "error"
    );
  }
}

  if (loading) return <p className="muted">Loading...</p>;

  if (status === "done")
    return (
      <main>
        <Meta title="Suggest an eatery" />
        <h1>Thanks!</h1>
        <p className="banner">We'll review your suggestion and add it soon.</p>
        <Link to="/eateries" className="back">← Back to eateries</Link>
      </main>
    );

  return (
    <main>
      <Meta title="Suggest an eatery" />
      <h1>Suggest an eatery</h1>
      <p className="muted">Can't find a place? Tell us, and we'll review and add it.</p>

      {!user ? (
        <LoginForm />
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <input
            placeholder="Eatery name (include the branch if it has one)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            required
          />

          {matches.length > 0 && (
            <div className="suggest-matches">
              <small className="muted">Already listed? Check these first:</small>
              {matches.map((m) => (
                <Link key={m.id} to={`/eatery/${m.slug}`}>{label(m)} · {m.area}</Link>
              ))}
            </div>
          )}

          <select value={area} onChange={(e) => setArea(e.target.value)} required>
            <option value="">Area</option>
            {unique(eateries.map((e) => e.area)).map((a) => <option key={a}>{a}</option>)}
            <option>Other</option>
          </select>
          {area === "Other" && (
  <input
    placeholder="Which area? (e.g. Paliparan)"
    value={otherArea}
    onChange={(e) => setOtherArea(e.target.value)}
    maxLength={40}
    required
  />
)}
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Type (optional)</option>
            {unique(eateries.map((e) => e.category)).map((c) => <option key={c}>{c}</option>)}
          </select>
          <textarea
            placeholder="Anything else? Landmarks, what they serve... (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
          />

          {status === "error" && <p className="error">Couldn't send. Try again.</p>}
          {status === "limit" && <p className="error">You've hit today's limit of 5 suggestions.</p>}
          {status === "timeout" && (
  <p className="error">
    This is taking too long. It may not have gone through, so refresh the page and try again.
  </p>
)}
          <button className="btn" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Submit suggestion"}
          </button>
        </form>
      )}
    </main>
  );
}