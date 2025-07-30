import { QUEEN } from "chess.js";

import {
    ExtractedCurrentNode,
    ExtractedPreviousNode
} from "../types/ExtractedNode";

/**
 * @description Returns whether a move is critical to maintaining an
 * advantage - moves that are easy to find or forced cannot be critical.
 * Also serves as a preliminary check for critical and brilliant moves.
 */
export function isMoveCriticalCandidate(
    previous: ExtractedPreviousNode,
    current: ExtractedCurrentNode
) {
    // Still completely winning even if this move hadn't been found
    const secondSubjectiveEval = previous.secondSubjectiveEvaluation;

    if (secondSubjectiveEval) {
        if (
            secondSubjectiveEval.type == "centipawn"
            && secondSubjectiveEval.value >= 700
        ) return false;
    } else {
        if (
            current.evaluation.type == "centipawn"
            && current.subjectiveEvaluation.value >= 700
        ) return false;
    }

    // Moves in losing positions cannot be critical
    if (current.subjectiveEvaluation.value < 0) return false;

    // Disallow queen promotions as critical moves
    if (current.playedMove.promotion == QUEEN) return false;
    
    // Disallow moves that must be played anyway to escape check
    if (previous.board.isCheck()) return false;

    return true;
}