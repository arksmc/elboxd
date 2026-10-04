import { Navigate } from "react-router-dom";
import useUser from "../lib/useUser";
import LoginForm from "../components/LoginForm";
import Meta from "../components/Meta";

export default function Login() {
  const { user, loading } = useUser();
  if (loading) return <p className="muted">Loading...</p>;
  if (user) return <Navigate to="/" replace />;
  return (
    <main>
      <Meta title="Sign in" />
      <h1>Sign in</h1>
      <LoginForm />
    </main>
  );
}