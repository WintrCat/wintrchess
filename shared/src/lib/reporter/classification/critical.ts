import {
    ExtractedCurrentNode,
    ExtractedPreviousNode
} from "../types/ExtractedNode";
import { flipPieceColour, adaptPieceColour } from "@/constants/PieceColour";
import { getCaptureSquare } from "@/lib/utils/chess";
import { getExpectedPointsLoss } from "../expectedPoints";
import { isMoveCriticalCandidate } from "../utils/criticalMove";
import { isPieceSafe } from "../utils/pieceSafety";

export function considerCriticalClassification(
    previous: ExtractedPreviousNode,
    current: ExtractedCurrentNode
) {
    if (!isMoveCriticalCandidate(previous, current)) return false;

    // It is not critical to find moves where you have mate
    if (
        current.subjectiveEvaluation.type == "mate"
        && current.subjectiveEvaluation.value > 0
    ) return false;

    // A critical move cannot be a capture of free material
    if (current.playedMove.captured) {
        const capturedPieceSafety = isPieceSafe(
            previous.board,
            {
                color: flipPieceColour(current.playedMove.color),
                square: getCaptureSquare(current.playedMove),
                type: current.playedMove.captured
            }
        );

        if (!capturedPieceSafety) return false;
    }

    if (!previous.secondTopLine?.evaluation) return false;

    const secondTopMovePointLoss = getExpectedPointsLoss(
        previous.evaluation,
        previous.secondTopLine.evaluation,
        adaptPieceColour(current.playedMove.color)
    );

    // 10% loss = middle between inaccuracy and mistake
    return secondTopMovePointLoss >= 0.1;
}