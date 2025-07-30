import Evaluation from "@/types/game/position/Evaluation";
import { PieceColour, flipPieceColour } from "@/constants/PieceColour";

interface ExpectedPointsOptions {
    moveColour: PieceColour;
    centipawnGradient?: number;
}

export function getExpectedPoints(
    evaluation: Evaluation,
    options?: ExpectedPointsOptions
) {
    const opts = {
        centipawnGradient: 0.0035,
        ...options
    };

    if (evaluation.type == "mate") {
        if (evaluation.value == 0) {
            return Number(opts.moveColour == PieceColour.WHITE);
        }

        return Number(evaluation.value > 0);
    } else {
        return 1 / (1 + Math.exp(
            -opts.centipawnGradient * evaluation.value
        ));
    }
}

export function getExpectedPointsLoss(
    previousEvaluation: Evaluation,
    currentEvaluation: Evaluation,
    moveColour: PieceColour
) {
    return Math.max(0,
        (
            getExpectedPoints(previousEvaluation, {
                moveColour: flipPieceColour(moveColour)
            })
            - getExpectedPoints(currentEvaluation, { moveColour })
        )
        * (moveColour == PieceColour.WHITE ? 1 : -1)
    );
}