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

export async function getFavoritesByNickname(nickname) {
  const { data, error } = await supabase
    .from("public_favorites").select("position, eatery_id").eq("nickname", nickname);
  if (error) throw error;
  return data;
}

export async function setFavorite(userId, position, eateryId) {
  const { error } = await supabase
    .from("favorites")
    .upsert({ user_id: userId, position, eatery_id: eateryId }, { onConflict: "user_id,position" });
  if (error) throw error;
}

export async function removeFavorite(userId, position) {
  const { error } = await supabase
    .from("favorites").delete().eq("user_id", userId).eq("position", position);
  if (error) throw error;
}

export async function getMyLikes(userId) {
  const { data, error } = await supabase
    .from("review_likes").select("review_id").eq("user_id", userId);
  if (error) throw error;
  return new Set(data.map((l) => l.review_id));
}

export async function likeReview(reviewId, userId) {
  const { error } = await supabase
    .from("review_likes").insert({ review_id: reviewId, user_id: userId });
  if (error) throw error;
}

export async function unlikeReview(reviewId, userId) {
  const { error } = await supabase
    .from("review_likes").delete().eq("review_id", reviewId).eq("user_id", userId);
  if (error) throw error;
}

export async function getTopReviews(limit = 6) {
  const { data, error } = await supabase
    .from("public_reviews").select("*")
    .gt("like_count", 0)
    .order("like_count", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function createSuggestion({ userId, name, area, category, note }) {
  const { error } = await supabase.from("suggestions").insert({
    user_id: userId,
    name,
    area: area || null,
    category: category || null,
    note: note || null,
  });
  if (error) throw error;
}

export async function getBadgesByNickname(nickname) {
  const { data, error } = await supabase
    .from("public_profile_badges").select("*").eq("nickname", nickname);
  if (error) throw error;
  return data;
}

export async function checkIsAdmin() {
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
}

export async function getOpenSuggestions() {
  const { data, error } = await supabase
    .from("suggestions").select("*").eq("status", "open").order("created_at");
  if (error) throw error;
  return data;
}

export async function getOpenReports() {
  const { data, error } = await supabase
    .from("reports")
    .select("id, reason, note, created_at, review_id, reviews(id, eatery_id, rating, body, hidden)")
    .eq("status", "open")
    .order("created_at");
  if (error) throw error;
  return data;
}

export async function setSuggestionStatus(id, status) {
  const { error } = await supabase.from("suggestions").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function setReportStatus(id, status) {
  const { error } = await supabase.from("reports").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function hideReview(reviewId) {
  const { error } = await supabase.from("reviews").update({ hidden: true }).eq("id", reviewId);
  if (error) throw error;
  const { error: e2 } = await supabase
    .from("reports").update({ status: "resolved" }).eq("review_id", reviewId);
  if (e2) throw e2;
}

export async function addEatery(row) {
  const { error } = await supabase.from("eateries").insert(row);
  if (error) throw error;
}