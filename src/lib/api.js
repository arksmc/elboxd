import { eateries } from "../data/eateries";
import { supabase } from "./supabase";

export async function getReviewsByEateryId(eateryId) {
  const { data, error } = await supabase
    .from("public_reviews")
    .select("*")
    .eq("eatery_id", eateryId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getRecentReviews(limit = 6) {
  const { data, error } = await supabase
    .from("public_reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function upsertReview({ eateryId, userId, rating, body }) {
  const { error } = await supabase
    .from("reviews")
    .upsert(
      { eatery_id: eateryId, user_id: userId, rating, body },
      { onConflict: "eatery_id,user_id" }
    );
  if (error) throw error;
}

export async function getEateries() {
    return eateries;
}

export async function getEateryBySlug(slug) {
    return eateries.find((e) => e.slug === slug) ?? null;
}

export async function signInWithEmail(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin },
  });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getMyProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createProfile(userId, nickname) {
  const { error } = await supabase
    .from("profiles")
    .insert({ user_id: userId, nickname });
  if (error) throw error;
}

export async function getEateryStats() {
  const { data, error } = await supabase.from("eatery_stats").select("*");
  if (error) throw error;
  return Object.fromEntries(data.map((s) => [s.eatery_id, s]));
}

