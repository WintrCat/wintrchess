import { meanBy } from "lodash-es";

import { getNodeChain, StateTreeNode } from "@/types/game/position/StateTreeNode";
import Evaluation from "@/types/game/position/Evaluation";
import PieceColour from "@/constants/PieceColour";
import { getExpectedPointsLoss } from "./expectedPoints";

export function getGameAccuracy(rootNode: StateTreeNode) {
    const accuracyHolders = getNodeChain(rootNode).filter(
        node => node.state.accuracy != undefined
    );

    const whiteNodes = accuracyHolders.filter(
        node => node.state.moveColour == PieceColour.WHITE
    );

    const blackNodes = accuracyHolders.filter(
        node => node.state.moveColour == PieceColour.BLACK
    );

    return {
        white: meanBy(whiteNodes, node => node.state.accuracy!),
        black: meanBy(blackNodes, node => node.state.accuracy!)
    };
}

export function getMoveAccuracy(
    previousEvaluation: Evaluation,
    currentEvaluation: Evaluation,
    moveColour: PieceColour
) {
    const pointLoss = getExpectedPointsLoss(
        previousEvaluation,
        currentEvaluation,
        moveColour
    );

    return 103.16 * Math.exp(-4 * pointLoss) - 3.17;
}