import { eateries } from "../data/eateries";

export async function getEateries() {
    return eateries;
}

export async function getEateryBySlug(slug) {
    return eateries.find((e) => e.slug === slug) ?? null;
}