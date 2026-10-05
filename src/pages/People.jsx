import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { searchProfiles } from "../lib/api";
import Meta from "../components/Meta";

export default function People() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const [text, setText] = useState(q);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Wait until typing pauses before updating the URL
  useEffect(() => {
    const t = setTimeout(() => {
      setParams(text.trim() ? { q: text.trim() } : {}, { replace: true });
    }, 300);
    return () => clearTimeout(t);
  }, [text]);

  useEffect(() => {
    setLoading(true);
    searchProfiles(q)
      .then(setResults)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <main>
      <Meta title="People" description="Find reviewers on TAMIS." />
      <h1>People</h1>
      <input
        className="search"
        type="search"
        placeholder="Search nicknames..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="section-head">
        <h2>{q ? `Results for "${q}"` : "Most active reviewers"}</h2>
      </div>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : results.length === 0 ? (
        <p className="banner">No one found with that nickname.</p>
      ) : (
        <div className="grid">
          {results.map((p) => (
            <Link
              key={p.nickname}
              to={`/u/${encodeURIComponent(p.nickname)}`}
              className="card person"
            >
              <div className="tile avatar-sm">{p.nickname[0].toUpperCase()}</div>
              <div>
                <h3>{p.nickname}</h3>
                <p className="muted">
                  {p.review_count} reviews
                  {p.avg_rating ? ` · avg ${p.avg_rating}★` : ""} · ♥ {p.total_likes}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}