export default function StarPicker({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Rating" className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          className="star-btn"
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
        >
          {n <= value ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}