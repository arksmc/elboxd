import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getEateries, getEateryStats } from "../lib/api";
import EateryCard from "../components/EateryCard";
import SearchBar from "../components/SearchBar";
import Meta from "../components/Meta";
import { SUGGEST_URL } from "../lib/config";

const unique = (arr) => [...new Set(arr.filter(Boolean))].sort();

export default function Eateries() {
  const [params, setParams] = useSearchParams();
  const [eateries, setEateries] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const q = params.get("q") ?? "";
  const area = params.get("area") ?? "";
  const type = params.get("type") ?? "";
  const tag = params.get("tag") ?? "";
  const sort = params.get("sort") ?? "name";
  const showClosed = params.get("closed") === "1";

  useEffect(() => {
    Promise.all([getEateries(), getEateryStats()])
      .then(([e, s]) => { setEateries(e); setStats(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function setParam(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  // Weighted score so one 5-star review doesn't beat fifty 4.5s
  const score = (e) => {
    const s = stats[e.id];
    if (!s) return 0;
    return (s.review_count * s.avg_rating + 3 * 3.5) / (s.review_count + 3);
  };

  const filtered = eateries
    .filter((e) => showClosed || e.status === "open")
    .filter((e) => !area || e.area === area)
    .filter((e) => !type || e.category === type)
    .filter((e) => !tag || e.tags?.includes(tag))
    .filter((e) =>
      `${e.name} ${e.branch ?? ""} ${e.area} ${e.category} ${(e.tags ?? []).join(" ")}`
        .toLowerCase()
        .includes(q.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "rating") return score(b) - score(a);
      if (sort === "reviews")
        return (stats[b.id]?.review_count ?? 0) - (stats[a.id]?.review_count ?? 0);
      return a.name.localeCompare(b.name) || (a.branch ?? "").localeCompare(b.branch ?? "");
    });

  const hasFilters = q || area || type || tag || showClosed || sort !== "name";

  return (
    <main>
      <Meta title="Eateries" description="Browse every eatery in and around UPLB." />
      <h1>Eateries</h1>

      <a className="banner" href={SUGGEST_URL} target="_blank" rel="noreferrer">
        Can't find your eatery? <b>Suggest an eatery</b>
      </a>

      <SearchBar value={q} onChange={(v) => setParam("q", v)} />

      <div className="filters">
        <select value={area} onChange={(e) => setParam("area", e.target.value)}>
          <option value="">All areas</option>
          {unique(eateries.map((e) => e.area)).map((a) => <option key={a}>{a}</option>)}
        </select>
        <select value={type} onChange={(e) => setParam("type", e.target.value)}>
          <option value="">All types</option>
          {unique(eateries.map((e) => e.category)).map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={tag} onChange={(e) => setParam("tag", e.target.value)}>
          <option value="">All foods</option>
          {unique(eateries.flatMap((e) => e.tags ?? [])).map((t) => <option key={t}>{t}</option>)}
        </select>
        <select value={sort} onChange={(e) => setParam("sort", e.target.value === "name" ? "" : e.target.value)}>
          <option value="name">Sort: A-Z</option>
          <option value="rating">Sort: Top rated</option>
          <option value="reviews">Sort: Most reviewed</option>
        </select>
        <label className="check">
          <input type="checkbox" checked={showClosed} onChange={(e) => setParam("closed", e.target.checked ? "1" : "")} />
          Show closed
        </label>
        {hasFilters && (
          <button className="link-btn" onClick={() => setParams({}, { replace: true })}>
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : (
        <>
          <p className="muted">Showing {filtered.length} of {eateries.length}</p>
          {filtered.length ? (
            <div className="grid">
              {filtered.map((e) => (
                <EateryCard key={e.id} eatery={e} stats={stats[e.id] ?? null} />
              ))}
            </div>
          ) : (
            <p className="banner">
              No eateries match. Try clearing a filter, or{" "}
              <a href={SUGGEST_URL} target="_blank" rel="noreferrer"><b>suggest one</b></a>.
            </p>
          )}
        </>
      )}
    </main>
  );
}