import { useState } from "react";
import { signInWithEmail } from "../lib/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await signInWithEmail(email);
      setStatus("sent");
    } catch (err) {
        console.error(err);
        setStatus("error");
    }
  }

  if (status === "sent") return <p className="error">Check your email for the sign-in link.</p>;

  return (
  <form className="form login" onSubmit={handleSubmit}>
    <h3>Sign in to write a review</h3>
    <p className="muted">
      Enter your email and we'll send you a one-tap sign-in link. No password needed.
    </p>
    <div className="login-row">
      <input
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send magic link"}
      </button>
    </div>
    {status === "error" && <p className="error">Something went wrong. Try again.</p>}
  </form>
);
}