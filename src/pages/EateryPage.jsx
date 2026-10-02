import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEateryBySlug } from "../lib/api";

export default function EateryPage() {
  const { slug } = useParams();
  const [eatery, setEatery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getEateryBySlug(slug).then((data) => {
      setEatery(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!eatery) return <p>Eatery not found. <Link to="/">Back home</Link></p>;

  const title = eatery.branch ? `${eatery.name} ${eatery.branch}` : eatery.name;

  return (
    <main>
      <Link to="/">← All eateries</Link>
      <h1>{title}</h1>
      <p>{eatery.area} · {eatery.category}</p>
      {eatery.status !== "open" && <p>This place is currently closed.</p>}

      <section>
        <h2>Reviews</h2>
        <p>No reviews yet.</p>
      </section>
    </main>
  );
}