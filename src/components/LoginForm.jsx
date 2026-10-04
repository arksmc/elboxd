import { signInWithGoogle } from "../lib/api";

export default function LoginForm() {
  return (
    <form className="form login" onSubmit={(e) => e.preventDefault()}>
      <h3>Sign in to write a review</h3>
      <p className="muted">
        Sign in with Google to post. Your reviews show under a nickname you pick, never your name or email.
      </p>
      <button className="btn" type="button" onClick={signInWithGoogle}>
        Continue with Google
      </button>
    </form>
  );
}