/**
 * Fame Rating Calculator
 *
 * Calculates a user's fame rating (0-100) based on various metrics.
 *
 * Formula breakdown:
 * - Profile completeness (20 points): profile completed (20)
 * - Popularity (60 points): likes received (up to 35) + views received (up to 20) + matches (up to 5)
 *   - Likes: 3 points per like, max 35 points (12 likes)
 *   - Views: 1.5 points per view, max 20 points (14 views)
 *   - Matches: 1 point per match, max 5 points (5 matches)
 * - Quality & longevity (20 points): like-to-view ratio (up to 15) + account age (up to 5)
 */

export interface FameRatingMetrics {
  profileCompletedPoints: number;
  likesReceived: number;
  viewsReceived: number;
  matchesCount: number;
  daysActive: number;
}

export function calculateFameRating(metrics: FameRatingMetrics): number {
  // 1. Profile completeness (20 points max)
  const profilePoints = metrics.profileCompletedPoints;

  // 2. Popularity (60 points max)
  const likesPoints = Math.min(metrics.likesReceived * 3, 35);
  const viewsPoints = Math.min(metrics.viewsReceived * 1.5, 20);
  const matchesPoints = Math.min(metrics.matchesCount, 5);
  const popularityPoints = likesPoints + viewsPoints + matchesPoints;

  // 3. Quality & longevity (20 points max)
  const likeToViewRatio =
    metrics.viewsReceived > 0
      ? metrics.likesReceived / metrics.viewsReceived
      : 0;
  const ratioPoints = Math.min(likeToViewRatio * 15, 15);
  const agePoints = Math.min(metrics.daysActive / 30, 1) * 5;
  const qualityPoints = ratioPoints + agePoints;

  // Total fame rating (0-100)
  const fameRating = Math.round(
    profilePoints + popularityPoints + qualityPoints,
  );

  return Math.max(0, Math.min(100, fameRating));
}
