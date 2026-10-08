import Meta from "../components/Meta";
import "../styles/legal.css";

export default function Terms() {
  return (
    <main className="legal-page">
      <Meta title="Terms" />

      <h1>Terms of Use</h1>

      <h2>Your reviews</h2>

      <p>
        Write only about your own experience. Be honest and keep it about the
        food, service, and place.
      </p>

      <p>
        Not allowed: personal attacks, harassment, hate speech, spam,
        advertising, reviews written by owners or staff of the eatery, and fake
        or paid reviews.
      </p>

      <h2>Moderation</h2>

      <p>
        We may hide or remove reviews and suspend accounts that break these
        rules. You can report any review with the report button.
      </p>

      <h2>Removal requests</h2>

      <p>
        If you own or work at an eatery and believe a review is false or
        abusive, contact <strong>markcascara70@gmail.com</strong> with the review and the reason. We'll
        look into it.
      </p>

      <h2>Your content</h2>

      <p>
        You keep ownership of your reviews, and you let us display them on this
        site. You can edit or delete your own reviews anytime.
      </p>

      <h2>No guarantees</h2>

      <p>
        Reviews are personal opinions of individual users. This is a
        student-made project provided as is, and we can't guarantee the
        accuracy or availability of the listings.
      </p>

      <p className="muted">Last updated: October 2026</p>
    </main>
  );
}

