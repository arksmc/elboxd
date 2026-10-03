import { eateries } from "../data/eateries";
import { reviews } from "../data/reviews";
import { supabase } from "./supabase";

export async function getReviewsByEateryId(eateryId) {
  return reviews.filter((r) => r.eatery_id === eateryId);
}

export async function getRecentReviews(limit = 6) {
  return [...reviews]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, limit);
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

