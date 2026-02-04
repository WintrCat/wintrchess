/**
 * Game Rating Card Component
 * 
 * Self-contained React component for displaying chess game ratings for both colors.
 * Framework-agnostic and easy to drop into any page.
 */

import React from "react";
import { estimateGameRating, type GameQualityCounts } from "../lib/gameRating";

export type Side = "White" | "Black";

export type SideInput = {
    accuracyPct: number;
    counts: GameQualityCounts;
};

export type GameRatingCardProps = {
    white: SideInput;
    black: SideInput;
    title?: string; // default "Game Rating"
};

const styles = {
    container: {
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '400px'
    },
    title: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#333',
        textAlign: 'center' as const
    },
    sideContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        padding: '8px',
        backgroundColor: 'white',
        borderRadius: '4px',
        border: '1px solid #eee'
    },
    sideLabel: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#333',
        minWidth: '60px'
    },
    rating: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#2c3e50'
    },
    details: {
        fontSize: '11px',
        color: '#666',
        marginTop: '4px',
        lineHeight: '1.3'
    },
    whiteSide: {
        backgroundColor: '#f8f9fa'
    },
    blackSide: {
        backgroundColor: '#e9ecef'
    }
};

export default function GameRatingCard(props: GameRatingCardProps): JSX.Element {
    const { white, black, title = "Game Rating" } = props;
    
    // Calculate ratings for both sides
    const whiteRating = estimateGameRating(white);
    const blackRating = estimateGameRating(black);
    
    const renderSideRating = (side: Side, rating: typeof whiteRating, input: SideInput) => (
        <div 
            key={side}
            style={{
                ...styles.sideContainer,
                ...(side === "White" ? styles.whiteSide : styles.blackSide)
            }}
        >
            <div style={styles.sideLabel}>{side}</div>
            <div style={{ flex: 1, marginLeft: '12px' }}>
                <div style={styles.rating}>{rating.rating}</div>
                <div style={styles.details}>
                    base {Math.round(rating.baseFromAccuracy)} − penalties {Math.round(rating.penalties.total)} × len {rating.lengthFactor.toFixed(2)}
                </div>
            </div>
        </div>
    );
    
    return (
        <div style={styles.container}>
            <div style={styles.title}>{title}</div>
            {renderSideRating("White", whiteRating, white)}
            {renderSideRating("Black", blackRating, black)}
        </div>
    );
}

/**
 * Example usage:
 * 
 * import GameRatingCard, { GameQualityCounts } from "./GameRatingCard";
 * 
 * const whiteCounts: GameQualityCounts = {
 *   inaccuracy: 1,
 *   mistake: 3,
 *   blunder: 0,
 *   theory: 2,
 *   total: 22
 * };
 * 
 * const blackCounts: GameQualityCounts = {
 *   inaccuracy: 1,
 *   mistake: 4,
 *   blunder: 2,
 *   theory: 2,
 *   total: 22
 * };
 * 
 * // JSX
 * <GameRatingCard
 *   white={{ accuracyPct: 87.2, counts: whiteCounts }}
 *   black={{ accuracyPct: 81.5, counts: blackCounts }}
 * />
 * 
 * // With custom title
 * <GameRatingCard
 *   title="Performance Rating"
 *   white={{ accuracyPct: 87.2, counts: whiteCounts }}
 *   black={{ accuracyPct: 81.5, counts: blackCounts }}
 * />
 */
