import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getPublicProfile, getReviewsByNickname, getEateries, getMyProfile, updateNickname,
  getFavoritesByNickname, setFavorite, removeFavorite,
} from "../lib/api";
import useUser from "../lib/useUser";
import StarRating from "../components/StarRating";
import Meta from "../components/Meta";
import { formatDate } from "../lib/format";


const label = (e) => (e.branch ? `${e.name} ${e.branch}` : e.name);

export default function Profile() {
  const { nickname } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [eateries, setEateries] = useState([]);
  const [myNickname, setMyNickname] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
  setLoading(true);

  Promise.all([
    getPublicProfile(nickname),
    getReviewsByNickname(nickname),
    getEateries(),
    getFavoritesByNickname(nickname),
  ])
    .then(([p, r, e, f]) => {
      setProfile(p);
      setReviews(r);
      setEateries(e);
      setFavorites(f);
    })
        .catch(console.error)
    .finally(() => {
      setLoading(false);
    });
}, [nickname]);

    useEffect(() => {
  if (!user) { setMyNickname(null); return; }
  getMyProfile(user.id)
    .then((p) => setMyNickname(p?.nickname ?? null))
    .catch(console.error);
}, [user, nickname]);

  async function handleRename(e) {
    e.preventDefault();
    const clean = newName.trim();
    if (clean.length < 3 || clean.length > 20) {
      setError("Nickname must be 3-20 characters.");
      return;
    }
    try {
      await updateNickname(user.id, clean);
      setEditing(false);
      setError("");
      navigate(`/u/${encodeURIComponent(clean)}`, { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err.code === "23505" ? "That nickname is taken."
        : err.message?.includes("30 days") ? "You can only change your nickname once every 30 days."
        : "Couldn't update. Try again."
      );
    }
  }

  if (loading) return <p className="muted">Loading...</p>;
  if (!profile)
    return <p>No one goes by that nickname. <Link to="/eateries" className="back">Browse eateries</Link></p>;

  const byId = Object.fromEntries(eateries.map((e) => [e.id, e]));
  const isMine = user && myNickname === nickname;
  const joined = new Date(profile.created_at).toLocaleDateString("en-PH", { month: "long", year: "numeric" });
  const favBySlot = Object.fromEntries(favorites.map((f) => [f.position, byId[f.eatery_id]]));

async function handleFavorite(position, value) {
  try {
    if (value) await setFavorite(user.id, position, Number(value));
    else await removeFavorite(user.id, position);
    setFavorites(await getFavoritesByNickname(nickname));
  } catch (err) {
    console.error(err);
    alert(err.code === "23505" ? "That place is already in your top 4." : "Couldn't save. Try again.");
  }
}

  return (
    <main>
      <Meta title={profile.nickname} description={`Reviews by ${profile.nickname}`} />
      <div className="profile-head">
        <div className="tile avatar">{profile.nickname[0].toUpperCase()}</div>
        <div>
          <h1>{profile.nickname}</h1>
          <p className="muted">
  Joined {joined} · {profile.review_count} reviews
  {profile.avg_rating ? ` · avg ${profile.avg_rating}★` : ""}
  {` · ♥ ${profile.total_likes}`}
</p>
          {isMine && !editing && (
            <button className="link-btn danger-free" onClick={() => { setEditing(true); setNewName(nickname); }}>
              Edit nickname
            </button>
          )}
        </div>
      </div>

      {isMine && editing && (
        <form className="form" onSubmit={handleRename}>
          <p className="muted">You can change your nickname once every 30 days.</p>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={20} />
          {error && <p className="error">{error}</p>}
          <div className="form-actions">
            <button className="btn" type="submit">Save</button>
            <button className="link-btn" type="button" onClick={() => { setEditing(false); setError(""); }}>Cancel</button>
          </div>
        </form>
      )}

      {(isMine || favorites.length > 0) && (
  <>
    <div className="section-head"><h2>Top 4</h2></div>
    <div className="top4">
      {[1, 2, 3, 4].map((pos) => {
        const e = favBySlot[pos];
        if (!e && !isMine) return null;
        return (
          <div key={pos} className="top4-slot">
            {e ? (
              <Link to={`/eatery/${e.slug}`} className="mini">
                <div className="tile">{e.name[0]}</div>
                <strong>{label(e)}</strong>
              </Link>
            ) : (
              <div className="tile tile-empty">+</div>
            )}
            {isMine && (
              <select value={e?.id ?? ""} onChange={(ev) => handleFavorite(pos, ev.target.value)}>
                <option value="">None</option>
                {eateries.map((x) => (
                  <option key={x.id} value={x.id}>{label(x)}</option>
                ))}
              </select>
            )}
          </div>
        );
      })}
    </div>
  </>
)}

      <div className="section-head"><h2>Reviews</h2></div>
      {reviews.length === 0 ? (
        <p className="banner">No reviews yet.</p>
      ) : (
        <ul className="review-list">
          {reviews.map((r) => {
            const e = byId[r.eatery_id];
            return (
              <li key={r.id} className="review">
                <div className="review-head">
                  {e ? <Link to={`/eatery/${e.slug}`}><strong>{label(e)}</strong></Link> : <strong>Eatery</strong>}
                  <StarRating value={r.rating} />
                </div>
                <p>{r.body}</p>
               <small className="muted">
  {formatDate(r.created_at)} · ♥ {r.like_count}
</small>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}