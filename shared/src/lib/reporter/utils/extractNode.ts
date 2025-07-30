import { Chess, WHITE } from "chess.js";

import { StateTreeNode } from "@/types/game/position/StateTreeNode";
import { EngineLine, getLineGroupSibling, getTopEngineLine } from "@/types/game/position/EngineLine";
import { RawMove } from "../types/RawMove";
import {
    ExtractedCurrentNode,
    ExtractedPreviousNode
} from "../types/ExtractedNode";
import { adaptPieceColour } from "@/constants/PieceColour";
import { getSubjectiveEvaluation } from "@/lib/utils/chess";

type PieceMovement = Pick<RawMove, "from" | "to" | "promotion">;

function safeMove(fen: string, move: string | PieceMovement) {
    try {
        return new Chess(fen).move(move);
    } catch {
        return undefined;
    }
}

function extractSecondTopMove(node: StateTreeNode, topLine: EngineLine) {
    const secondTopLine = getLineGroupSibling(
        node.state.engineLines,
        topLine,
        2
    );

    const secondTopMoveSan = secondTopLine?.moves.at(0)?.san;

    const secondTopMove = secondTopMoveSan
        ? safeMove(node.state.fen, secondTopMoveSan)
        : undefined;

    const secondSubjectiveEvaluation = secondTopLine?.evaluation
        && secondTopMove
        && getSubjectiveEvaluation(
            secondTopLine.evaluation,
            adaptPieceColour(secondTopMove.color)
        );

    return {
        secondTopLine,
        secondTopMove,
        secondSubjectiveEvaluation
    };
}

export function extractPreviousStateTreeNode(
    node: StateTreeNode
): ExtractedPreviousNode | null {
    // Get top engine line and move in this position
    const topLine = getTopEngineLine(node.state.engineLines);
    if (!topLine) return null;

    const topMoveSan = topLine.moves.at(0)?.san;
    if (!topMoveSan) return null;

    const topMove = safeMove(node.state.fen, topMoveSan);
    if (!topMove) return null;

    // Get played move in this position
    const playedMove = node.parent
        && node.state.move
        && safeMove(node.parent.state.fen, node.state.move.san);

    const subjectiveEvaluation = getSubjectiveEvaluation(
        topLine.evaluation,
        adaptPieceColour(playedMove?.color || WHITE)
    );

    return {
        board: new Chess(node.state.fen),
        state: node.state,
        topLine: topLine,
        topMove: topMove,
        ...extractSecondTopMove(node, topLine),
        evaluation: topLine.evaluation,
        subjectiveEvaluation: subjectiveEvaluation,
        playedMove: playedMove
    };
}

/**
 * @description Extract analysis information from a node. Returns an object
 * of extracted data, or null if any required pieces of data are missing.
 */
export function extractCurrentStateTreeNode(
    node: StateTreeNode
): ExtractedCurrentNode | null {
    if (!node.parent) return null;

    // Get top engine line and move in this position
    const topLine = getTopEngineLine(node.state.engineLines);
    if (!topLine) return null;

    const topMoveSan = topLine.moves.at(0)?.san;

    const topMove = topMoveSan
        ? safeMove(node.state.fen, topMoveSan)
        : undefined;

    // Get played move in this position
    const playedMoveSan = node.state.move?.san;
    if (!playedMoveSan) return null;

    const playedMove = safeMove(node.parent.state.fen, playedMoveSan);
    if (!playedMove) return null;

    const subjectiveEvaluation = getSubjectiveEvaluation(
        topLine.evaluation,
        adaptPieceColour(playedMove?.color || WHITE)
    );

    return {
        board: new Chess(node.state.fen),
        state: node.state,
        topLine: topLine,
        topMove: topMove,
        ...extractSecondTopMove(node, topLine),
        evaluation: topLine.evaluation,
        subjectiveEvaluation: subjectiveEvaluation,
        playedMove: playedMove
    };
}