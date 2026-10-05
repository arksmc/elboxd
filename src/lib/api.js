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
  const { data, error } = await supabase
    .from("eateries")
    .select("*")
    .order("name");
  if (error) throw error;
  return data;
}

export async function getEateryBySlug(slug) {
  const { data, error } = await supabase
    .from("eateries")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
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

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
}

export async function getMyReview(eateryId, userId) {
  const { data, error } = await supabase
    .from("reviews")
    .select("rating, body")
    .eq("eatery_id", eateryId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function deleteMyReview(eateryId, userId) {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("eatery_id", eateryId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function reportReview({ reviewId, reason, note }) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not signed in");
  const { error } = await supabase.from("reports").insert({
    review_id: reviewId,
    reporter_id: session.user.id,
    reason,
    note: note || null,
  });
  if (error) throw error;
}

export async function getPublicProfile(nickname) {
  const { data, error } = await supabase
    .from("public_profiles").select("*").eq("nickname", nickname).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getReviewsByNickname(nickname) {
  const { data, error } = await supabase
    .from("public_reviews").select("*").eq("nickname", nickname)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateNickname(userId, nickname) {
  const { error } = await supabase
    .from("profiles").update({ nickname }).eq("user_id", userId);
  if (error) throw error;
}