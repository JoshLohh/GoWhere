/**
 * Simple scoring function for MVP
 * Weights rating more than review count
 */
export function scorePlace(place) {
  const rating = place.rating || 0;
  const reviews = place.reviews || 0;

  const reviewBoost = Math.log10(reviews + 1);
  return rating * 0.7 + reviewBoost * 0.3;
}

