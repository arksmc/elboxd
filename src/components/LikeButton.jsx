import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../lib/useUser";
import { likeReview, unlikeReview } from "../lib/api";

export default function LikeButton({ reviewId, count = 0, liked: likedProp = false }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(likedProp);
  const [n, setN] = useState(count);

  useEffect(() => { setLiked(likedProp); setN(count); }, [likedProp, count]);

  async function toggle() {
    if (!user) return navigate("/login");
    const next = !liked;
    setLiked(next);
    setN((c) => c + (next ? 1 : -1));
    try {
      if (next) await likeReview(reviewId, user.id);
      else await unlikeReview(reviewId, user.id);
    } catch (err) {
      console.error(err);
      setLiked(!next);
      setN((c) => c + (next ? -1 : 1));
      if (err.code === "42501") alert("You can't like your own review.");
    }
  }

  return (
    <button type="button" className={"like-btn" + (liked ? " on" : "")} onClick={toggle}>
      {liked ? "♥" : "♡"} {n}
    </button>
  );
}