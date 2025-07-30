import { Chess, Move, QUEEN } from "chess.js";
import { differenceWith, isEqual } from "lodash-es";

import { BoardPiece } from "../types/BoardPiece";
import { RawMove } from "../types/RawMove";
import { pieceValues } from "@/constants/utils";
import { PieceColour, adaptPieceColour } from "@/constants/PieceColour";
import { parseSanMove } from "@/lib/utils/chess";
import { getUnsafePieces } from "./pieceSafety";
import { getAttackingMoves } from "./attackers";

/**
 * @description Returns a list of attacking moves of unsafe pieces of a
 * given colour that are higher or equal in value to the threatened piece.
 */
function relativeUnsafePieceAttacks(
    actionBoard: Chess,
    threatenedPiece: BoardPiece,
    colour: PieceColour,
    playedMove?: Move
) {
    return getUnsafePieces(actionBoard, colour, playedMove)
        .filter(unsafePiece => (
            unsafePiece.square != threatenedPiece.square
            && pieceValues[unsafePiece.type] >= pieceValues[threatenedPiece.type]
        ))
        .map(unsafePiece => getAttackingMoves(
            actionBoard, unsafePiece, false
        ))
        .reduce((acc, val) => acc.concat(val), []);
}

/**
 * @description Assuming that a given piece is under threat, act on the threat
 * through a given move. For example, capturing it as the opponent, or moving
 * it to safety. Returns whether playing the move creates a greater
 * counterthreat than that already imposed on the threatened piece.
 */
export function moveCreatesGreaterThreat(
    board: Chess,
    threatenedPiece: BoardPiece,
    actingMove: RawMove
) {
    const actionBoard = new Chess(board.fen());

    // Pieces of the acting colour, >= in value to the threatened piece
    // that are already unsafe even before the acting move is played
    const previousRelativeAttacks = relativeUnsafePieceAttacks(
        actionBoard,
        threatenedPiece,
        adaptPieceColour(actingMove.color)
    );

    try {
        var bakedMove = actionBoard.move(actingMove);
    } catch {
        return false;
    }

    // Attacks on unsafe pieces >= in value to threatened piece that
    // now exist after the acting move has been played
    const relativeAttacks = relativeUnsafePieceAttacks(
        actionBoard,
        threatenedPiece,
        adaptPieceColour(actingMove.color),
        bakedMove
    );

    const newRelativeAttacks = differenceWith(
        relativeAttacks, previousRelativeAttacks, isEqual
    );

    if (newRelativeAttacks.length > 0) return true;

    // Lower value piece sacrifice that if taken leads to mate
    const lowValueCheckmatePin = (
        pieceValues[threatenedPiece.type] < pieceValues[QUEEN]
        && actionBoard.moves().some(
            move => parseSanMove(move).checkmate
        )
    );

    return lowValueCheckmatePin;
}

export function moveLeavesGreaterThreat(
    board: Chess,
    threatenedPiece: BoardPiece,
    actingMove: RawMove
) {
    const actionBoard = new Chess(board.fen());

    try {
        actionBoard.move(actingMove);
    } catch {
        return false;
    }

    // Attacks on unsafe pieces >= in value to threatened piece after move
    const relativeAttacks = relativeUnsafePieceAttacks(
        actionBoard,
        threatenedPiece,
        adaptPieceColour(actingMove.color)
    );

    if (relativeAttacks.length > 0) return true;

    // Lower value piece sacrifice that if taken leads to mate
    const lowValueCheckmatePin = (
        pieceValues[threatenedPiece.type] < pieceValues[QUEEN]
        && actionBoard.moves().some(
            move => parseSanMove(move).checkmate
        )
    );

    return lowValueCheckmatePin;
}

/**
 * @description Returns whether all acting moves create a threat larger than
 * that imposed on the threatened piece. Equality strategies are `creates`
 * when relative threats after the move must be a direct result thereof,
 * and `leaves` when it should only check for the existence of them at all.
 */
export function hasDangerLevels(
    board: Chess,
    threatenedPiece: BoardPiece,
    actingMoves: RawMove[],
    equalityStrategy: "creates" | "leaves" = "leaves"
) {
    return actingMoves.every(actingMove => (equalityStrategy == "creates"
        ? moveCreatesGreaterThreat(board, threatenedPiece, actingMove)
        : moveLeavesGreaterThreat(board, threatenedPiece, actingMove)
    ));
}