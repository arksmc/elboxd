import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEateryBySlug, getReviewsByEateryId } from "../lib/api";
import ReviewList from "../components/ReviewList";
import StarRating from "../components/StarRating";
import { getAverage } from "../lib/ratings";
import ReviewForm from "../components/ReviewForm";

export default function EateryPage() {
  const { slug } = useParams();
  const [eatery, setEatery] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getEateryBySlug(slug).then((data) => {
      setEatery(data);
      if (data) {
        getReviewsByEateryId(data.id).then(setReviews);
      } else {
        setReviews([]);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!eatery) return <p>Eatery not found. <Link to="/">Back home</Link></p>;

  const title = eatery.branch ? `${eatery.name} ${eatery.branch}` : eatery.name;
  const average = getAverage(reviews);

  function handleAddReview({ rating, body }) {
  const newReview = {
    id: Date.now(),
    eatery_id: eatery.id,
    nickname: "you",
    rating,
    body,
    created_at: new Date().toISOString().slice(0, 10),
  };
  setReviews([newReview, ...reviews]);
}

  return (
    <main>
      <Link to="/">← All eateries</Link>
      <h1>{title}</h1>
      <p>{eatery.area} · {eatery.category}</p>
      {eatery.status !== "open" && <p>This place is currently closed.</p>}

      <section>
        <h2>Reviews</h2>
        {average && (
          <p>
            <StarRating value={average} /> {average} ({reviews.length})
          </p>
        )}
        <ReviewForm onSubmit={handleAddReview} />
        <ReviewList reviews={reviews} />
      </section>
    </main>
  );
}