import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useUser from "../lib/useUser";
import { signOut, getMyProfile, checkIsAdmin} from "../lib/api";

export default function Layout({ children }) {
  const { user, loading } = useUser();
  const [nick, setNick] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
  if (!user) {
    setNick(null);
    setIsAdmin(false);
    return;
  }
  getMyProfile(user.id).then((p) => setNick(p?.nickname ?? null)).catch(console.error);
  checkIsAdmin().then(setIsAdmin);
}, [user]);

function handleSignOut() {
  if (!confirming) {
    setConfirming(true);
    setTimeout(() => setConfirming(false), 3000);
    return;
  }
  signOut();
  setConfirming(false);
}

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand"><img src="/logo.svg" alt="" className="logo-img" />
<span>VOUCH</span></Link>
          <nav className="nav">
            <NavLink to="/eateries">Eateries</NavLink>
            <NavLink to="/people">People</NavLink>
            <NavLink to="/reviews">Reviews</NavLink>
            <a href="/#lists">Lists</a>
          </nav>
          {!loading && (user ? (
  <>
    {nick && (
      <Link to={`/u/${encodeURIComponent(nick)}`} className="link-btn">
        My profile
      </Link>
    )}
    {isAdmin && <Link to="/admin" className="link-btn">Admin</Link>}
    <button
      className={"link-btn" + (confirming ? " confirm" : "")}
      onClick={handleSignOut}
    >
      {confirming ? "Tap again to sign out" : "Sign out"}
    </button>
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
            <Link to="/privacy">Privacy</Link> · <Link to="/terms">Terms</Link>
          </span>
        </div>
      </footer>
      <Link to="/eateries" className="fab" aria-label="Write a review">+</Link>
    </>
  );
}