export default function StarRating({ value }) {
  const full = Math.round(value);
  return (
    <span aria-label={`${value} out of 5`}>
      {"★".repeat(full)}
      {"☆".repeat(5 - full)}
    </span>
  );
}