import Meta from "../components/Meta";
import "../styles/legal.css";

export default function Terms() {
  return (
    <main className="legal-page">
      <Meta title="Terms" />

      <h1>Terms of Use</h1>

      <h2>Your Reviews</h2>

      <p>
        Write only about your own experience. Be honest and keep your reviews
        focused on the food, service, and place.
      </p>

      <p>
        Not allowed: personal attacks, harassment, hate speech, spam,
        advertising, reviews written by owners or staff of the eatery, and
        fake, misleading, or paid reviews.
      </p>

      <h2>Moderation</h2>

      <p>
        We may hide or remove reviews and suspend or delete accounts that break
        these rules. You can report a review using the report button.
      </p>

      <h2>Removal Requests</h2>

      <p>
        If you own or work at an eatery and believe a review is false or
        abusive, contact <strong>markcascara70@gmail.com</strong> with the
        review and the reason for your request. We'll look into it.
      </p>

      <h2>Your Content</h2>

      <p>
        You keep ownership of your reviews. By posting a review, you give Vouch
        permission to display it on the site under the nickname you choose.
        You can edit or delete your own reviews at any time.
      </p>

      <h2>No Guarantees</h2>

      <p>
        Reviews are personal opinions of individual users and do not necessarily
        represent the views of Vouch. This is a student-made project provided
        as is, and we cannot guarantee the accuracy, completeness, or
        availability of eatery listings or user-submitted content.
      </p>

      <p className="muted">Last updated: October 2026</p>
    </main>
  );
}
