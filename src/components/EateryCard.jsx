import { Link } from "react-router-dom";

export default function EateryCard({ eatery }) {
  const title = eatery.branch ? `${eatery.name} ${eatery.branch}` : eatery.name;
  return (
    <Link to={`/eatery/${eatery.slug}`}>
      <h3>{title}</h3>
      <p>{eatery.area} · {eatery.category}</p>
    </Link>
  );
}