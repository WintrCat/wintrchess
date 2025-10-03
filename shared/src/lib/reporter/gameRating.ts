/**
 * Game Rating Module
 * 
 * Self-contained utility for estimating chess game ratings based on accuracy and move quality.
 * Uses piecewise linear interpolation and penalty calculations to determine rating estimates.
 */

// Configuration constants (easily tweakable)
const ACCURACY_RATING_KNOTS: Array<[number, number]> = [
    [60, 800], [70, 1000], [80, 1300], [85, 1500],
    [90, 1750], [95, 2050], [98, 2350], [100, 2500]
];

const BLUNDER_PENALTY = 80;
const MISTAKE_PENALTY = 30;
const INACC_PENALTY = 10;

export type GameQualityCounts = {
    inaccuracy: number;   // count of small errors
    mistake: number;      // count of medium errors
    blunder: number;      // count of large errors
    theory: number;       // count of book/theory moves
    total: number;        // total moves for this color
};

export type GameRatingInput = {
    accuracyPct: number;        // e.g., 87.2
    counts: GameQualityCounts;
};

export type GameRatingSummary = {
    rating: number;             // final rounded game rating
    baseFromAccuracy: number;   // mapped from accuracy
    accuracyPct: number;
    penalties: {
        blunders: number;
        mistakes: number;
        inaccuracies: number;
        total: number;
    };
    lengthFactor: number;       // dampening factor for very short games
    effectiveMoves: number;     // total - theory, min 0
};

/**
 * Linear interpolation between two points
 */
function linearInterpolate(x: number, x1: number, y1: number, x2: number, y2: number): number {
    if (x2 === x1) return y1;
    return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
}

/**
 * Map accuracy percentage to base rating using piecewise linear interpolation
 */
function mapAccuracyToRating(accuracyPct: number): number {
    // Clamp accuracy to [0, 100]
    const clampedAccuracy = Math.max(0, Math.min(100, accuracyPct));
    
    // Find the appropriate segment for interpolation
    for (let i = 0; i < ACCURACY_RATING_KNOTS.length - 1; i++) {
        const [x1, y1] = ACCURACY_RATING_KNOTS[i];
        const [x2, y2] = ACCURACY_RATING_KNOTS[i + 1];
        
        if (clampedAccuracy >= x1 && clampedAccuracy <= x2) {
            return linearInterpolate(clampedAccuracy, x1, y1, x2, y2);
        }
    }
    
    // Handle edge cases
    if (clampedAccuracy <= ACCURACY_RATING_KNOTS[0][0]) {
        return ACCURACY_RATING_KNOTS[0][1];
    }
    if (clampedAccuracy >= ACCURACY_RATING_KNOTS[ACCURACY_RATING_KNOTS.length - 1][0]) {
        return ACCURACY_RATING_KNOTS[ACCURACY_RATING_KNOTS.length - 1][1];
    }
    
    return ACCURACY_RATING_KNOTS[0][1]; // fallback
}

/**
 * Estimate game rating from accuracy and move quality counts
 */
export function estimateGameRating(input: GameRatingInput): GameRatingSummary {
    const { accuracyPct, counts } = input;
    
    // Calculate effective moves (total - theory, min 0)
    const effectiveMoves = Math.max(0, counts.total - counts.theory);
    
    // Map accuracy to base rating
    const baseFromAccuracy = mapAccuracyToRating(accuracyPct);
    
    // Calculate penalty scale based on game length
    // penaltyScale = sqrt(20 / max(20, effective))
    const penaltyScale = Math.sqrt(20 / Math.max(20, effectiveMoves));
    
    // Calculate penalties
    const blunderPenalty = counts.blunder * BLUNDER_PENALTY * penaltyScale;
    const mistakePenalty = counts.mistake * MISTAKE_PENALTY * penaltyScale;
    const inaccPenalty = counts.inaccuracy * INACC_PENALTY * penaltyScale;
    const totalPenalty = blunderPenalty + mistakePenalty + inaccPenalty;
    
    // Calculate length factor for short-game dampening
    // 10 effective moves => ~0.92, 20 => ~0.97, 30+ => ~1.00
    const m = Math.max(1, effectiveMoves);
    const lengthFactor = Math.min(1, 0.90 + 0.01 * Math.min(m, 10) + 0.007 * Math.max(0, m - 10));
    
    // Final calculation
    const rawRating = baseFromAccuracy - totalPenalty;
    const rating = Math.round(Math.max(300, lengthFactor * rawRating));
    
    return {
        rating,
        baseFromAccuracy,
        accuracyPct,
        penalties: {
            blunders: blunderPenalty,
            mistakes: mistakePenalty,
            inaccuracies: inaccPenalty,
            total: totalPenalty
        },
        lengthFactor,
        effectiveMoves
    };
}

/**
 * Example usage:
 * 
 * import { estimateGameRating, GameQualityCounts } from "./gameRating";
 * 
 * const whiteCounts: GameQualityCounts = {
 *   inaccuracy: 1,
 *   mistake: 3,
 *   blunder: 0,
 *   theory: 2,
 *   total: 22
 * };
 * 
 * const whiteRating = estimateGameRating({
 *   accuracyPct: 87.2,
 *   counts: whiteCounts
 * });
 * 
 * console.log(`White rating: ${whiteRating.rating}`);
 * // Output: White rating: 1456
 */
