import Meta from "../components/Meta";

export default function Privacy() {
  return (
    <main>
      <Meta title="Privacy" />

      <h1>Privacy</h1>

      <p>
        When you sign in with Google, we receive your email address and name.
        They're stored securely for authentication and are never shown publicly.
      </p>

      <p>
        Your reviews are shown under the nickname you choose. Other users can't
        see who you are. The site admin can technically see which account wrote
        a review, which is used only for moderation and handling reports.
      </p>

      <p>
        Your account may also store your nickname, date joined, selected top 4,
        reviews, ratings, review dates, and likes. You can edit or delete your
        own reviews.
      </p>

      <p>
        Other users can see your nickname, reviews, ratings, review dates,
        likes received on your reviews, and selected top 4. They cannot see
        your Google name, email address, or which reviews you have liked.
      </p>

      <p>
        Vouch uses Supabase for its database and authentication, Google OAuth
        for sign-in, and Vercel for hosting. The site also uses local storage
        in your browser for site functionality.
      </p>

      <p>
        The site administrator may delete reviews or accounts when necessary
        for moderation. Account deletion is handled manually through the
        site's database.
      </p>

      <p>
        To delete your account and the information associated with it,
        including your reviews and likes, contact{" "}
        <strong>markcascara70@gmail.com</strong>.
      </p>

      <p>
        This Privacy Policy may be updated as Vouch changes or adds features.
      </p>
    </main>
  );
}