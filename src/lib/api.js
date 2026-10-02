import { eateries } from "../data/eateries";
import { reviews } from "../data/reviews";

export async function getReviewsByEateryId(eateryId) {
  return reviews.filter((r) => r.eatery_id === eateryId);
}

export async function getEateries() {
    return eateries;
}

export async function getEateryBySlug(slug) {
    return eateries.find((e) => e.slug === slug) ?? null;
}