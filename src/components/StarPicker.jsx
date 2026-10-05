export default function StarPicker({ value, onChange }) {
  function pick(e, n) {
    const rect = e.currentTarget.getBoundingClientRect();
    // detail === 0 means keyboard activation, which counts as a full star
    const isHalf = e.detail !== 0 && e.clientX - rect.left < rect.width / 2;
    onChange(isHalf ? n - 0.5 : n);
  }
  return (
    <div>
      <div className="stars" role="group" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} stars`}
            onClick={(e) => pick(e, n)}
            className={"star-btn " + (value >= n ? "full" : value >= n - 0.5 ? "half" : "")}
          >★</button>
        ))}
      </div>
      <small className="muted">
        {value ? `${value} / 5` : "Tap the left half of a star for a half star"}
      </small>
    </div>
  );
}