export default function Badge({ code, emoji, label, full = false }) {
  if (!code) return null;
  return (
    <span className={`badge badge-${code}`} title={label}>
      {emoji}{full && <> {label}</>}
    </span>
  );

  if (code === "lori" && !full) {
  return (
    <span className="badge badge-lori badge-swap" title={label}>
      <span className="swap-a">{emoji || "💜"}</span>
      <span className="swap-b">{label}</span>
    </span>
  );
}
}