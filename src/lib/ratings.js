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