import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getPublicProfile, getReviewsByNickname, getEateries, getMyProfile, updateNickname,
  getFavoritesByNickname, setFavorite, removeFavorite, getBadgesByNickname, followUser, unfollowUser, removeFollower,
  getMyFollowing, getMyFollowers
} from "../lib/api";
import useUser from "../lib/useUser";
import StarRating from "../components/StarRating";
import Meta from "../components/Meta";
import { formatDate } from "../lib/format";
import Badge from "../components/Badge";


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
  const [badges, setBadges] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [panel, setPanel] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
  setLoading(true);

  Promise.all([
  getPublicProfile(nickname),
  getReviewsByNickname(nickname),
  getEateries(),
  getFavoritesByNickname(nickname),
  getBadgesByNickname(nickname),
])
  .then(([p, r, e, f, b]) => {
    setProfile(p); setReviews(r); setEateries(e); setFavorites(f); setBadges(b);
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

  useEffect(() => {
  if (!user) { setFollowing([]); setFollowers([]); return; }
  Promise.all([getMyFollowing(), getMyFollowers()])
    .then(([a, b]) => { setFollowing(a); setFollowers(b); })
    .catch(console.error);
}, [user?.id, nickname]);
  

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

const isFollowing = following.some((f) => f.nickname === nickname);

async function refreshFollows() {
  const [a, b, p] = await Promise.all([getMyFollowing(), getMyFollowers(), getPublicProfile(nickname)]);
  setFollowing(a); setFollowers(b); setProfile(p);
}

async function toggleFollow() {
  if (busy) return;
  setBusy(true);
  try {
    if (isFollowing) await unfollowUser(nickname);
    else await followUser(nickname);
    await refreshFollows();
  } catch (err) {
    console.error(err);
    alert(
      err.message?.includes("limit") ? "You've reached the follow limit (200)."
      : err.message?.includes("nickname") ? "Pick a nickname first."
      : "Couldn't update. Try again."
    );
  } finally {
    setBusy(false);
  }
}

async function act(fn, name) {
  try { await fn(name); await refreshFollows(); } catch (err) { console.error(err); }
}

  return (
    <main>
      <Meta title={profile.nickname} description={`Reviews by ${profile.nickname}`} />
      <div className={"profile-head" + (badges[0] ? ` profile-${badges[0].code}` : "")}>
        <div className="tile avatar">{profile.nickname[0].toUpperCase()}</div>
        <div>
          <h1>{profile.nickname}</h1>
<div>
  {badges.map((b) => (
    <Badge key={b.code} code={b.code} emoji={b.emoji} label={b.label} full />
  ))}
</div>
          <p className="muted">
  Joined {joined} · {profile.review_count} reviews
  {profile.avg_rating ? ` · avg ${profile.avg_rating}★` : ""}
  {` · ♥ ${profile.total_likes}`}
</p>

<p className="muted">
  {profile.follower_count} followers · {profile.following_count} following
</p>
{user && myNickname && !isMine && (
  <button className={isFollowing ? "btn btn-outline" : "btn"} onClick={toggleFollow} disabled={busy}>
    {isFollowing ? "Following" : "Follow"}
  </button>
)}
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

      {isMine && (
  <>
    <div className="tabs">
      <button className={panel === "followers" ? "tab on" : "tab"}
        onClick={() => setPanel(panel === "followers" ? null : "followers")}>
        Followers ({followers.length})
      </button>
      <button className={panel === "following" ? "tab on" : "tab"}
        onClick={() => setPanel(panel === "following" ? null : "following")}>
        Following ({following.length})
      </button>
    </div>
    {panel && (
      <ul className="review-list">
        {(panel === "followers" ? followers : following).length === 0 && (
          <li className="banner">
            {panel === "followers" ? "No followers yet." : <>You aren't following anyone. <Link to="/people"><b>Find people</b></Link></>}
          </li>
        )}
        {(panel === "followers" ? followers : following).map((f) => (
          <li key={f.nickname} className="review person-row">
            <Link to={`/u/${encodeURIComponent(f.nickname)}`}><strong>{f.nickname}</strong></Link>
            {panel === "followers" ? (
              <button className="link-btn"
                onClick={() => window.confirm(`Remove ${f.nickname} as a follower?`) && act(removeFollower, f.nickname)}>
                Remove
              </button>
            ) : (
              <button className="link-btn" onClick={() => act(unfollowUser, f.nickname)}>Unfollow</button>
            )}
          </li>
        ))}
      </ul>
    )}
  </>
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