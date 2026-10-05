import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useUser from "../lib/useUser";
import { signOut, getMyProfile } from "../lib/api";

export default function Layout({ children }) {
  const { user, loading } = useUser();
  const [nick, setNick] = useState(null);

  useEffect(() => {
    if (!user) {
      setNick(null);
      return;
    }
    getMyProfile(user.id)
      .then((p) => setNick(p?.nickname ?? null))
      .catch(console.error);
  }, [user]);

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand"><span className="logo">T</span>TAMIS</Link>
          <nav className="nav">
            <NavLink to="/eateries">Eateries</NavLink>
            <a href="/#reviews">Reviews</a>
            <a href="/#lists">Lists</a>
          </nav>
          {!loading && (user ? (
            <>
              {nick && (
                <Link to={`/u/${encodeURIComponent(nick)}`} className="link-btn">
                  My profile
                </Link>
              )}
              <button className="link-btn" onClick={signOut}>Sign out</button>
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
          <span>© TAMIS</span>
          <span className="muted">
            Student-made · Not affiliated with UPLB
            <br />
            <Link to="/privacy">Privacy</Link> · <Link to="/terms">Terms</Link>
          </span>
        </div>
      </footer>
    </>
  );
}