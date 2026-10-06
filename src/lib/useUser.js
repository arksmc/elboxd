import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Keep the same object if it's the same person, so effects don't refire
    const update = (next) =>
      setUser((prev) => (prev?.id === (next?.id ?? undefined) ? prev : next ?? null));

    supabase.auth.getSession().then(({ data }) => {
      update(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => update(session?.user ?? null)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return { user, loading };
}