import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useUser from "../lib/useUser";
import {
  checkIsAdmin, getOpenSuggestions, getOpenReports, getEateries,
  addEatery, setSuggestionStatus, setReportStatus, hideReview,
} from "../lib/api";
import Meta from "../components/Meta";

const label = (e) => (e.branch ? `${e.name} ${e.branch}` : e.name);
const slugify = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function SuggestionRow({ s, onDone }) {
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const [f, setF] = useState({
    name: s.name, branch: "", area: s.area ?? "", category: s.category ?? "", tags: "",
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const slug = slugify(`${f.name} ${f.branch}`);

  async function add(e) {
    e.preventDefault();
    try {
      const tags = f.tags.split(",").map((t) => t.trim()).filter(Boolean);
      await addEatery({
        slug,
        name: f.name.trim(),
        branch: f.branch.trim() || null,
        chain: f.branch.trim() ? f.name.trim() : null,
        area: f.area.trim(),
        category: f.category.trim(),
        tags: tags.length ? tags : null,
        status: "open",
      });
      await setSuggestionStatus(s.id, "added");
      onDone();
    } catch (error) {
      console.error(error);
      setErr(error.code === "23505" ? "That slug already exists." : "Couldn't add it.");
    }
  }

  return (
    <li className="review">
      <strong>{s.name}</strong>
      <p className="muted">{s.area} · {s.category || "no type"}</p>
      {s.note && <p>{s.note}</p>}
      {open ? (
        <form className="form" onSubmit={add}>
          <input value={f.name} onChange={set("name")} placeholder="Name" required />
          <input value={f.branch} onChange={set("branch")} placeholder="Branch (blank if none)" />
          <input value={f.area} onChange={set("area")} placeholder="Area" required />
          <input value={f.category} onChange={set("category")} placeholder="Type (Cafe, Restaurant...)" required />
          <input value={f.tags} onChange={set("tags")} placeholder="Tags, comma separated" />
          <small className="muted">Slug: {slug}</small>
          {err && <p className="error">{err}</p>}
          <div className="form-actions">
            <button className="btn" type="submit">Confirm add</button>
            <button className="link-btn" type="button" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="form-actions">
          <button className="btn" onClick={() => setOpen(true)}>Add</button>
          <button className="link-btn" onClick={async () => { await setSuggestionStatus(s.id, "rejected"); onDone(); }}>
            Reject
          </button>
        </div>
      )}
    </li>
  );
}

function ReportRow({ r, byId, onDone }) {
  const rv = r.reviews;
  const e = rv && byId[rv.eatery_id];
  return (
    <li className="review">
      <strong>{r.reason}</strong>
      {r.note && <p className="muted">"{r.note}"</p>}
      {rv ? (
        <>
          <p className="muted">On {e ? label(e) : "an eatery"} · {rv.rating}★{rv.hidden ? " · already hidden" : ""}</p>
          <p>{rv.body || <em>(no text)</em>}</p>
        </>
      ) : (
        <p className="muted">Review no longer exists.</p>
      )}
      <div className="form-actions">
        {rv && !rv.hidden && (
          <button className="btn" onClick={async () => { await hideReview(rv.id); onDone(); }}>
            Hide review
          </button>
        )}
        <button className="link-btn" onClick={async () => { await setReportStatus(r.id, "dismissed"); onDone(); }}>
          Dismiss
        </button>
      </div>
    </li>
  );
}

export default function Admin() {
  const { user, loading } = useUser();
  const [ok, setOk] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [reports, setReports] = useState([]);
  const [eateries, setEateries] = useState([]);

  async function load() {
    try {
      const [s, r, e] = await Promise.all([getOpenSuggestions(), getOpenReports(), getEateries()]);
      setSuggestions(s); setReports(r); setEateries(e);
    } catch (err) { console.error(err); }
  }

  useEffect(() => {
    if (loading) return;
    if (!user) { setOk(false); return; }
    checkIsAdmin().then(setOk);
  }, [user, loading]);

  useEffect(() => { if (ok) load(); }, [ok]);

  if (ok === null) return <p className="muted">Loading...</p>;
  if (!ok) return <p>Nothing here. <Link to="/" className="back">Back home</Link></p>;

  const byId = Object.fromEntries(eateries.map((e) => [e.id, e]));

  return (
    <main>
      <Meta title="Admin" />
      <h1>Admin</h1>

      <div className="section-head"><h2>Suggestions ({suggestions.length})</h2></div>
      {suggestions.length === 0 ? <p className="banner">No open suggestions.</p> : (
        <ul className="review-list">
          {suggestions.map((s) => <SuggestionRow key={s.id} s={s} onDone={load} />)}
        </ul>
      )}

      <div className="section-head"><h2>Reports ({reports.length})</h2></div>
      {reports.length === 0 ? <p className="banner">No open reports.</p> : (
        <ul className="review-list">
          {reports.map((r) => <ReportRow key={r.id} r={r} byId={byId} onDone={load} />)}
        </ul>
      )}
    </main>
  );
}