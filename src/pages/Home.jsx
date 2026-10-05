import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEateries, getRecentReviews } from "../lib/api";
import EateryCard from "../components/EateryCard";
import SearchBar from "../components/SearchBar";
import StarRating from "../components/StarRating";
import Meta from "../components/Meta";
import { formatDate } from "../lib/format";
import { SUGGEST_URL } from "../lib/config";

const label = (e) => (e.branch ? `${e.name} ${e.branch}` : e.name);

export default function Home() {
  const [eateries, setEateries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getEateries().then(setEateries);
    getRecentReviews(5).then(setReviews);
  }, []);

  const byId = Object.fromEntries(eateries.map((e) => [e.id, e]));
  const filtered = eateries.filter((e) =>
    `${e.name} ${e.branch ?? ""} ${e.area} ${e.category}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <main>
      <Meta />
      <section className="hero">
        <h1>Find where to eat around UPLB.</h1>
        <p>Honest, anonymous reviews from students.</p>
        <SearchBar value={query} onChange={setQuery} />
      </section>

      {query ? (
        <>
          <div className="section-head"><h2>Results</h2></div>
          <div className="grid">
            {filtered.map((e) => <EateryCard key={e.id} eatery={e} />)}
          </div>
        </>
      ) : (
        <>
          <div className="section-head" id="reviews">
            <h2>Recent reviews</h2>
          </div>
          <div className="row6">
            {reviews.map((r) => {
              const e = byId[r.eatery_id];
              return e && (
                <Link key={r.id} to={`/eatery/${e.slug}`} className="mini">
                  <div className="tile">{e.name[0]}</div>
                  <strong>{label(e)}</strong>
                  <StarRating value={r.rating} />
                  <small className="muted">{r.nickname} · {formatDate(r.created_at)}</small>
                </Link>
              );
            })}
          </div>

          <a className="banner" href={SUGGEST_URL} target="_blank" rel="noreferrer">
            Know a place we're missing? <b>Suggest an eatery →</b>
          </a>

          <div className="section-head"><h2>Popular eateries</h2></div>
          <div className="row6">
            {eateries.slice(0, 5).map((e) => (
              <Link key={e.id} to={`/eatery/${e.slug}`} className="mini">
                <div className="tile">{e.name[0]}</div>
                <strong>{label(e)}</strong>
                <small className="muted">{e.area}</small>
              </Link>
            ))}
          </div>

          <div className="section-head"><h2>Popular reviews</h2></div>
          <div className="two-col">
            {reviews.slice(0, 5).map((r) => {
              const e = byId[r.eatery_id];
              return e && (
                <article key={r.id} className="review">
                  <div className="review-head">
                    <div>
                      <strong>{label(e)}</strong>
                      <p className="muted">by {r.nickname}</p>
                    </div>
                    <StarRating value={r.rating} />
                  </div>
                  <p>{r.body}</p>
                </article>
              );
            })}
          </div>

          <div className="section-head" id="lists"><h2>Popular lists</h2></div>
          <div className="banner">Curated lists like "Best budget meals near Gate 2" are coming soon.</div>
        </>
      )}
    </main>
  );
}