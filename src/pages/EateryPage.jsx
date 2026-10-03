import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEateries, getEateryBySlug, getReviewsByEateryId } from "../lib/api";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import LoginForm from "../components/LoginForm";
import StarRating from "../components/StarRating";
import Meta from "../components/Meta";
import useUser from "../lib/useUser";
import { getAverage, getDistribution } from "../lib/ratings";
import NicknameForm from "../components/NicknameForm";
import { getMyProfile } from "../lib/api";

const label = (e) => (e.branch ? `${e.name} ${e.branch}` : e.name);

export default function EateryPage() {
  const { slug } = useParams();
  const { user } = useUser();
  const [nickname, setNickname] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setNickname(null);
      setProfileLoaded(true);
      return;
    }
    setProfileLoaded(false);
    getMyProfile(user.id).then((p) => {
      setNickname(p?.nickname ?? null);
      setProfileLoaded(true);
    });
  }, [user]);

  const [eatery, setEatery] = useState(null);
  const [all, setAll] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [eateryData, allData] = await Promise.all([
          getEateryBySlug(slug),
          getEateries(),
        ]);
        if (!isMounted) return;
        setEatery(eateryData);
        setAll(allData);
        if (eateryData) {
          const r = await getReviewsByEateryId(eateryData.id);
          if (isMounted) setReviews(r);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Failed to load eatery details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!eatery) return <p>Eatery not found. <Link to="/" className="back">Back home</Link></p>;

  const title = label(eatery);
  const average = getAverage(reviews);
  const dist = getDistribution(reviews);
  const max = Math.max(1, ...Object.values(dist));

  const others = all.filter((e) => e.id !== eatery.id);
  const branches = others.filter((e) => e.chain && e.chain === eatery.chain);
  const nearby = others
    .filter((e) => e.area === eatery.area && !branches.includes(e))
    .slice(0, 6);

  function handleAddReview({ rating, body }) {
    const newReview = {
      id: Date.now(),
      eatery_id: eatery.id,
      nickname: nickname,
      rating,
      body,
      created_at: new Date().toISOString().slice(0, 10),
    };
    setReviews((prev) => [newReview, ...prev]);
  }

  const MiniRow = ({ items }) => (
    <div className="row6">
      {items.map((e) => (
        <Link key={e.id} to={`/eatery/${e.slug}`} className="mini">
          <div className="tile">{e.name[0]}</div>
          <strong>{label(e)}</strong>
          <small className="muted">{e.area}</small>
        </Link>
      ))}
    </div>
  );

  return (
    <main>
      <Meta title={title} description={`Reviews of ${title}`} />
      <div className="banner-hero" />

      <div className="detail">
        <aside className="detail-side">
          <div className="tile tile-lg">{eatery.name[0]}</div>
          <div className="stats">
            <span><b>{average ?? "–"}</b> avg</span>
            <span><b>{reviews.length}</b> reviews</span>
          </div>
          <div className="side-box">
            <p className="muted">{eatery.area} · {eatery.category}</p>
            {eatery.status !== "open" && <p className="notice">Currently closed</p>}
            <a href="#write" className="pill block">Write a review</a>
            <button className="btn-disabled" disabled>Want to try (soon)</button>
          </div>
        </aside>

        <div className="detail-main">
          <Link to="/" className="back">← All eateries</Link>
          <h1>{title}</h1>
          <div className="pills">
            <span className="tag">{eatery.area}</span>
            <span className="tag">{eatery.category}</span>
          </div>

          <div className="rating-panel">
            <div className="big-score">
              {average ?? "–"}
              {average && <StarRating value={average} />}
            </div>
            <div className="hist">
              {[5, 4, 3, 2, 1].map((n) => (
                <div key={n} className="hist-row">
                  <span>{n}★</span>
                  <div className="hist-bar">
                    <i style={{ width: `${(dist[n] / max) * 100}%` }} />
                  </div>
                  <span>{dist[n]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section-head" id="write"><h2>Your review</h2></div>
          {!user ? (
            <LoginForm />
          ) : !profileLoaded ? (
            <p className="muted">Loading...</p>
          ) : !nickname ? (
            <NicknameForm userId={user.id} onDone={setNickname} />
          ) : (
            <ReviewForm onSubmit={handleAddReview} />
          )}

          <div className="section-head"><h2>Recent reviews</h2></div>
          <ReviewList reviews={reviews} />

          {branches.length > 0 && (
            <>
              <div className="section-head"><h2>Other branches</h2></div>
              <MiniRow items={branches} />
            </>
          )}

          {nearby.length > 0 && (
            <>
              <div className="section-head"><h2>Also in {eatery.area}</h2></div>
              <MiniRow items={nearby} />
            </>
          )}

          <div className="section-head"><h2>Popular lists</h2></div>
          <div className="banner">Lists are coming soon.</div>
        </div>
      </div>
    </main>
  );
}