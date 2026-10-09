import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useUser from "../lib/useUser";
import { signOut, getMyProfile, checkIsAdmin, getBadgesByNickname } from "../lib/api";
import NotificationBell from "./NotificationBell";

export default function Layout({ children }) {
  const { user, loading } = useUser();
  const [nick, setNick] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [badge, setBadge] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setNick(null);
      setIsAdmin(false);
      setBadge(null);
      return;
    }
    getMyProfile(user.id)
      .then((p) => {
        const n = p?.nickname ?? null;
        setNick(n);
        if (n) getBadgesByNickname(n).then((b) => setBadge(b[0]?.code ?? null)).catch(console.error);
      })
      .catch(console.error);
    checkIsAdmin().then(setIsAdmin);
  }, [user?.id]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) close();
    };
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    setConfirming(false);
  }

  function handleSignOut() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    close();
    signOut();
  }

  const initial = (nick ?? user?.email ?? "?")[0].toUpperCase();

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          {/* KEEP YOUR OWN BRAND LINE HERE, e.g. <Link to="/" className="brand">...</Link> */}
          <Link to="/" className="brand"><img src="/logo.svg" alt="" className="logo-img" />
<span>VOUCH</span></Link>

          <nav className="nav">
            <NavLink to="/eateries">Eateries</NavLink>
            <NavLink to="/reviews">Reviews</NavLink>
            <NavLink to="/people">People</NavLink>
          </nav>

          {!loading && (user ? (
  <>
    <NotificationBell userId={user.id} />
    <div className="user-menu" ref={menuRef}>
      <button
        className={"avatar-btn" + (badge ? ` avatar-btn-${badge}` : "")}
        onClick={() => (open ? close() : setOpen(true))}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        {initial}
      </button>
      {open && (
        <div className="menu" role="menu">
          {nick && <p className="menu-name">{nick}</p>}
          {nick && (
            <Link role="menuitem" to={`/u/${encodeURIComponent(nick)}`} onClick={close}>
              My profile
            </Link>
          )}
          {isAdmin && (
            <Link role="menuitem" to="/admin" onClick={close}>Admin</Link>
          )}
          <Link role="menuitem" to="/feedback" onClick={close}>Send feedback</Link>
          <button
            role="menuitem"
            className={confirming ? "danger" : ""}
            onClick={handleSignOut}
          >
            {confirming ? "Tap again to sign out" : "Sign out"}
          </button>
        </div>
      )}
    </div>
  </>
) : (
  <Link to="/login" className="link-btn">Sign in</Link>
))}

          <Link to="/eateries" className="pill">+ REVIEW</Link>
        </div>
      </header>

      <div className="container">{children}</div>

      <footer className="site-footer">
        <div className="footer-inner">
          <span>© VOUCH</span>
          <span className="muted">
            Student-made · Not affiliated with UPLB
            <br />
            <a href="/privacy.html">Privacy</a> · <a href="/terms.html">Terms</a> · <Link to="/feedback">Feedback</Link>
          </span>
        </div>
      </footer>

      <Link to="/eateries" className="fab" aria-label="Write a review">+</Link>
    </>
  );
}