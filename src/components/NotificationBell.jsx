import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getUnreadCount, getMyNotifications, markAllNotificationsRead } from "../lib/api";
import { formatDate } from "../lib/format";

export default function NotificationBell({ userId }) {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  // One tiny count request on load and when you come back to the tab
  useEffect(() => {
    const refresh = () => getUnreadCount().then(setCount).catch(console.error);
    refresh();
    const onVisible = () => document.visibilityState === "visible" && refresh();
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [userId]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function toggle() {
    if (open) { setOpen(false); return; }
    setOpen(true);
    setLoading(true);
    try {
      const list = await getMyNotifications();
      setItems(list);                // keeps unread highlighting while open
      if (count > 0) {
        await markAllNotificationsRead();
        setCount(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bell-wrap" ref={ref}>
      <button className="bell-btn" onClick={toggle} aria-label="Notifications" aria-expanded={open}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
        {count > 0 && <span className="bell-dot">{count > 9 ? "9+" : count}</span>}
      </button>

      {open && (
        <div className="notif-menu">
          <p className="menu-name">Notifications</p>
          {loading ? (
            <p className="muted notif-empty">Loading...</p>
          ) : items.length === 0 ? (
            <p className="muted notif-empty">Nothing yet.</p>
          ) : (
            items.map((n) => {
              const body = (
                <>
                  <span>{n.message}</span>
                  <small className="muted">{formatDate(n.created_at)}</small>
                </>
              );
              return n.link ? (
                <Link key={n.id} to={n.link} className={"notif" + (n.read ? "" : " unread")} onClick={() => setOpen(false)}>
                  {body}
                </Link>
              ) : (
                <div key={n.id} className={"notif" + (n.read ? "" : " unread")}>{body}</div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}