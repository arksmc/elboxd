import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReviewsPage, getEateries, getMyLikes } from "../lib/api";
import useUser from "../lib/useUser";
import StarRating from "../components/StarRating";
import LikeButton from "../components/LikeButton";
import ReportButton from "../components/ReportButton";
import Badge from "../components/Badge";
import Meta from "../components/Meta";
import { formatDate } from "../lib/format";

const PAGE = 20;
const label = (e) => (e.branch ? `${e.name} ${e.branch}` : e.name);

export default function Reviews() {
  const { user } = useUser();
  const [sort, setSort] = useState("recent");
  const [reviews, setReviews] = useState([]);
  const [eateries, setEateries] = useState([]);
  const [myLikes, setMyLikes] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    getEateries().then(setEateries).catch(console.error);
  }, []);

  useEffect(() => {
    if (!user) { setMyLikes(new Set()); return; }
    getMyLikes(user.id).then(setMyLikes).catch(console.error);
  }, [user]);

  // Reload from the start whenever the tab changes
  useEffect(() => {
    let live = true;
    setLoading(true);
    setReviews([]);
    setDone(false);
    getReviewsPage({ sort, offset: 0, limit: PAGE })
      .then((r) => {
        if (!live) return;
        setReviews(r);
        setDone(r.length < PAGE);
      })
      .catch(console.error)
      .finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [sort]);

  async function loadMore() {
    setMore(true);
    try {
      const r = await getReviewsPage({ sort, offset: reviews.length, limit: PAGE });
      setReviews((prev) => [...prev, ...r]);
      setDone(r.length < PAGE);
    } catch (err) {
      console.error(err);
    } finally {
      setMore(false);
    }
  }

  const byId = Object.fromEntries(eateries.map((e) => [e.id, e]));

  return (
    <main>
      <Meta title="Reviews" description="Latest reviews of UPLB eateries." />
      <h1>Reviews</h1>

      <div className="tabs">
        <button className={sort === "recent" ? "tab on" : "tab"} onClick={() => setSort("recent")}>
          Recent
        </button>
        <button className={sort === "liked" ? "tab on" : "tab"} onClick={() => setSort("liked")}>
          Most liked
        </button>
        {user && (
  <button className={sort === "following" ? "tab on" : "tab"} onClick={() => setSort("following")}>
    Following
  </button>
)}
      </div>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : reviews.length === 0 ? (
        <p className="banner">
  {sort === "following" ? (
    <>Follow people to see their reviews here. <Link to="/people"><b>Find people</b></Link></>
  ) : sort === "liked" ? "No liked reviews yet." : "No reviews yet."}
</p>
      ) : (
        <ul className="review-list">
          {reviews.map((r) => {
            const e = byId[r.eatery_id];
            return (
              <li key={r.id} className={"review" + (r.badge_key ? ` has-badge-${r.badge_key}` : "")}>
                <div className="review-head">
                  <div>
                    {e ? (
                      <Link to={`/eatery/${e.slug}`}><strong>{label(e)}</strong></Link>
                    ) : (
                      <strong>Eatery</strong>
                    )}
                    <p className="muted">
                      by{" "}
                      {r.nickname === "Anonymous" ? (
                        r.nickname
                      ) : (
                        <Link to={`/u/${encodeURIComponent(r.nickname)}`}>{r.nickname}</Link>
                      )}
                      <Badge code={r.badge_key} emoji={r.badge_emoji} label={r.badge_label} />
                    </p>
                  </div>
                  <StarRating value={r.rating} />
                </div>
                <p>{r.body}</p>
                <div className="review-foot">
                  <span className="foot-left">
                    <LikeButton reviewId={r.id} count={r.like_count} liked={myLikes.has(r.id)} />
                    <small className="muted">{formatDate(r.created_at)}</small>
                  </span>
                  {user && <ReportButton reviewId={r.id} />}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {!loading && reviews.length > 0 && !done && (
        <button className="btn load-more" onClick={loadMore} disabled={more}>
          {more ? "Loading..." : "Load more"}
        </button>
      )}
    </main>
  );
}