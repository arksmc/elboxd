const SWAP = ["lori", "iesou"];

export default function Badge({ code, emoji, label, full = false }) {
  if (!code) return null;

  if (SWAP.includes(code) && !full) {
    return (
      <span className={`badge badge-${code} badge-swap`} title={label}>
        <span className="swap-a">{emoji}</span>
        <span className="swap-b">{label}</span>
      </span>
    );
  }

  return (
    <span className={`badge badge-${code}`} title={label}>
      {emoji}{full && <> {label}</>}
    </span>
  );
}