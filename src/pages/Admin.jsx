import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useUser from "../lib/useUser";
import {
  checkIsAdmin, getOpenSuggestions, getOpenReports, getEateries,
  addEatery, setSuggestionStatus, setReportStatus, hideReview, getAllFeedback, getTopics, createTopic, assignFeedback, updateTopic,
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
function FeedbackAdmin() {
  const [items, setItems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [drafts, setDrafts] = useState({});

  async function load() {
    try {
      const [f, t] = await Promise.all([getAllFeedback(), getTopics()]);
      setItems(f); setTopics(t);
    } catch (err) { console.error(err); }
  }
  useEffect(() => { load(); }, []);

  const loose = items.filter((i) => !i.topic_id);
  const countFor = (id) => items.filter((i) => i.topic_id === id).length;
  const draft = (t) => drafts[t.id] ?? { status: t.status, reply: t.reply ?? "" };
  const setDraft = (t, patch) => setDrafts({ ...drafts, [t.id]: { ...draft(t), ...patch } });

  async function newTopic(item) {
    const title = window.prompt("Topic title:", item.message.slice(0, 60));
    if (!title) return;
    const t = await createTopic(title.trim());
    await assignFeedback(item.id, t.id);
    load();
  }

  return (
    <>
      <div className="section-head"><h2>Feedback topics ({topics.length})</h2></div>
      {topics.length === 0 ? <p className="banner">No topics yet.</p> : (
        <ul className="review-list">
          {topics
            .slice()
            .sort((a, b) => countFor(b.id) - countFor(a.id))
            .map((t) => (
              <li key={t.id} className="review">
                <strong>{t.title}</strong>
                <p className="muted">{countFor(t.id)} request{countFor(t.id) === 1 ? "" : "s"}</p>
                {items.filter((i) => i.topic_id === t.id).map((i) => (
                  <p key={i.id} className="muted">· [{i.category}] {i.message}</p>
                ))}
                <div className="form">
                  <select value={draft(t).status} onChange={(e) => setDraft(t, { status: e.target.value })}>
                    <option value="open">Received</option>
                    <option value="planned">Planned</option>
                    <option value="done">Done</option>
                    <option value="declined">Not planned</option>
                  </select>
                  <textarea
                    placeholder="Reply (everyone in this topic sees it)"
                    value={draft(t).reply}
                    onChange={(e) => setDraft(t, { reply: e.target.value })}
                    maxLength={1000}
                  />
                  <button
                    className="btn"
                    onClick={async () => { await updateTopic(t.id, draft(t)); load(); }}
                  >
                    Save
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}

      <div className="section-head"><h2>New feedback ({loose.length})</h2></div>
      {loose.length === 0 ? <p className="banner">Nothing new.</p> : (
        <ul className="review-list">
          {loose.map((i) => (
            <li key={i.id} className="review">
              <p className="muted">{i.category}{i.page ? ` · ${i.page}` : ""}</p>
              <p>{i.message}</p>
              <div className="form-actions">
                <select
                  defaultValue=""
                  onChange={async (e) => {
                    if (!e.target.value) return;
                    await assignFeedback(i.id, Number(e.target.value));
                    load();
                  }}
                >
                  <option value="">Add to topic...</option>
                  {topics.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
                <button className="link-btn" onClick={() => newTopic(i)}>New topic</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
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

      <FeedbackAdmin />
    </main>
  );
}