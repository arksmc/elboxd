import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEateryBySlug, getReviewsByEateryId } from "../lib/api";
import ReviewList from "../components/ReviewList";
import StarRating from "../components/StarRating";
import { getAverage } from "../lib/ratings";
import ReviewForm from "../components/ReviewForm";
import useUser from "../lib/useUser";
import LoginForm from "../components/LoginForm";
import Meta from "../components/Meta";
import useUser from "../lib/useUser";
import { signOut } from "../lib/api";

const { user } = useUser();

{user && <button onClick={signOut}>Sign out</button>}

export default function EateryPage() {
  const { slug } = useParams();
  const [eatery, setEatery] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      try {
        const eateryData = await getEateryBySlug(slug);
        if (!isMounted) return;

        setEatery(eateryData);

        if (eateryData) {
          const reviewsData = await getReviewsByEateryId(eateryData.id);
          if (isMounted) setReviews(reviewsData);
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

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!eatery) return <p>Eatery not found. <Link to="/">Back home</Link></p>;

  const title = eatery.branch ? `${eatery.name} ${eatery.branch}` : eatery.name;
  const average = getAverage(reviews);

  function handleAddReview({ rating, body }) {
    const newReview = {
      id: Date.now(),
      eatery_id: eatery.id,
      nickname: user?.nickname || "you",
      rating,
      body,
      created_at: new Date().toISOString().slice(0, 10),
    };
    
    // Optimistic UI update
    setReviews((prev) => [newReview, ...prev]);

    // TODO: Send backend request here (e.g., await createReview(newReview))
  }

  return (
    <main>
      <Meta title={title} description={`Reviews of ${title}`} />
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
        {user ? <ReviewForm onSubmit={handleAddReview} /> : <LoginForm />}
        <ReviewList reviews={reviews} />
      </section>
    </main>
  );
}