export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="search"
      placeholder="Search eateries..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}