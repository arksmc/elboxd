export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="search"
      type="search"
      placeholder="Search eateries..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}