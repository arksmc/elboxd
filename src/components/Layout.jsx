import { Link, NavLink } from "react-router-dom";
import useUser from "../lib/useUser";
import { signOut } from "../lib/api";

export default function Layout({ children }) {
  const { user, loading } = useUser();
  
{!loading && (user
  ? <button className="link-btn" onClick={signOut}>Sign out</button>
  : <Link to="/login" className="link-btn">Sign in</Link>)}
  
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <div className="dots"><i /><i /><i /></div>
          <Link to="/" className="brand">Elboxd</Link>
          <nav className="nav">
            <NavLink to="/eateries">Eateries</NavLink>
            <a href="/#reviews">Reviews</a>
            <a href="/#lists">Lists</a>
          </nav>
          {user && <button className="link-btn" onClick={signOut}>Sign out</button>}
          <Link to="/eateries" className="pill">+ REVIEW</Link>
        </div>
      </header>
      <div className="container">{children}</div>
    <footer className="site-footer">
        <div className="footer-inner">
            <span>© Elboxd</span>
            <span className="muted">Student-made · Reviews are anonymous</span>
               <Link to="/privacy">Privacy</Link> · <Link to="/terms">Terms</Link>
        </div>
    </footer>
    </>
  );
}
