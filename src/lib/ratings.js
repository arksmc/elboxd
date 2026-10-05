export function getAverage(reviews) {
  if (!reviews.length) return null;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

export function getDistribution(reviews) {
  const counts = {};
  for (let n = 0.5; n <= 5; n += 0.5) counts[n] = 0;
  reviews.forEach((r) => { counts[Number(r.rating)] += 1; });
  return counts;
}

// Weighted score: pulls small samples toward 3.5 so one 5-star doesn't win
export function weightedScore(stats) {
  if (!stats) return 0;
  const m = 3;   // how many "average" reviews to blend in
  const c = 3.5; // the average to blend toward
  return (stats.review_count * stats.avg_rating + m * c) / (stats.review_count + m);
}