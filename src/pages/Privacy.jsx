import Meta from "../components/Meta";
import "../styles/legal.css";

export default function Privacy() {
  return (
    <main className="legal-page">
      <Meta title="Privacy" />

      <h1>Privacy</h1>

      <h2>What We Collect</h2>

      <p>
        When you sign in with Google, Vouch receives the basic account
        information provided by Google for sign-in, such as your name and email
        address. Vouch does not access your Gmail, Google Drive, or other Google
        services.
      </p>

      <p>
        Your email address and name are used to create and identify your Vouch
        account. They are not shown publicly and are not used as your public
        identity on the site.
      </p>

      <p>
        Your account may also store your nickname, date joined, selected Top 4,
        reviews, ratings, review dates, and likes. You can edit or delete your
        own reviews.
      </p>

      <h2>What Others Can See</h2>

      <p>
        Your reviews are shown under the nickname you choose. Other users
        cannot see your Google name or email address.
      </p>

      <p>
        Other users can see your nickname, reviews, ratings, review dates,
        likes received on your reviews, and selected Top 4. They cannot see
        your Google name, email address, or which reviews you have liked.
      </p>

      <h2>Why We Require Sign-In</h2>

      <p>
        You can browse Vouch and read reviews without an account.
      </p>

      <p>
        Google sign-in is required for actions that need an account, such as
        posting reviews and interacting with other users. This allows Vouch to
        associate reviews and other activity with an account while keeping your
        Google identity private from other users.
      </p>

      <h2>Moderation</h2>

      <p>
        The site administrator can technically see which account is associated
        with a review. This information is used for moderation and handling
        reports.
      </p>

      <p>
        The site administrator may hide or delete reviews when necessary for
        moderation. Accounts may also be deleted when necessary. Account
        deletion is handled manually through the site's database.
      </p>

      <h2>Services We Use</h2>

      <p>
        Vouch uses Supabase for its database and authentication, Google OAuth
        for sign-in, and Vercel for hosting. The site also uses local storage
        in your browser for site functionality.
      </p>

      <h2>Deleting Your Account</h2>

      <p>
        To delete your account and the information associated with it,
        including your reviews and likes, contact{" "}
        <strong>markcascara70@gmail.com</strong>.
      </p>

      <h2>Changes to This Policy</h2>

      <p>
        This Privacy Policy may be updated as Vouch changes or adds features.
      </p>

      <p className="muted">Last updated: October 2026</p>
    </main>
  );
}
