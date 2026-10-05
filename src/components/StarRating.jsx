export default function StarRating({ value }) {
  const v = Math.round(value * 2) / 2;
  return (
    <span className="stars-display" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={v >= n ? "s full" : v >= n - 0.5 ? "s half" : "s"}>★</span>
      ))}
    </span>
  );
}