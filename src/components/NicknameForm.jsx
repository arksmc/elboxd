import { useState } from "react";
import { createProfile } from "../lib/api";

export default function NicknameForm({ userId, onDone }) {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const clean = nickname.trim();
    if (clean.length < 3 || clean.length > 20) {
      setError("Nickname must be 3-20 characters.");
      return;
    }
    try {
      await createProfile(userId, clean);
      onDone(clean);
    } catch (err) {
      console.error(err);
      setError(
        err.code === "23505"
          ? "That nickname is taken."
          : "Something went wrong. Try again."
      );
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p>Pick a nickname. It's shown on your reviews instead of your email.</p>
      <input
        placeholder="e.g. gate2silogguy"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        maxLength={20}
      />
      {error && <p className="error">{error}</p>}
      <button className="btn" type="submit">Save nickname</button>
    </form>
  );
}