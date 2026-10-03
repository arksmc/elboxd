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

  if (status === "sent") return <p>Check your email for the sign-in link.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <p>Sign in to write a review.</p>
      <input
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" disabled={status === "sending"}>
        Send magic link
      </button>
      {status === "error" && <p>Something went wrong. Try again.</p>}
    </form>
  );
}