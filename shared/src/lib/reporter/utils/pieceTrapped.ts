import { Chess, KING } from "chess.js";

import { BoardPiece } from "../types/BoardPiece";
import { isPieceSafe } from "./pieceSafety";
import { moveCreatesGreaterThreat } from "./dangerLevels";
import { adaptPieceColour } from "@/constants/PieceColour";
import { setFenTurn } from "@/lib/utils/chess";

/**
 * @description Returns whether a piece is trapped. If a piece is unsafe on its
 * current square and also in every square it can move to, it is trapped. If
 * danger levels is enabled, it is also trapped if moving it allows the
 * opponent a larger counterthreat.
 */
export function isPieceTrapped(
    board: Chess,
    piece: BoardPiece,
    dangerLevels = true
) {
    const calibratedBoard = new Chess(
        setFenTurn(board.fen(), adaptPieceColour(piece.color))
    );

    const standingPieceSafety = isPieceSafe(calibratedBoard, piece);
    
    const pieceMoves = calibratedBoard.moves({
        square: piece.square,
        verbose: true
    });

    const allMovesUnsafe = pieceMoves.every(move => {
        if (move.captured == KING) return false;

        const escapeBoard = new Chess(calibratedBoard.fen());

        if (
            dangerLevels
            && moveCreatesGreaterThreat(escapeBoard, piece, move)
        ) return true;

        const escapeMove = escapeBoard.move(move);

        const escapedPieceSafety = isPieceSafe(
            escapeBoard,
            { ...piece, square: escapeMove.to },
            escapeMove
        );

        return !escapedPieceSafety;
    });

    return !standingPieceSafety && allMovesUnsafe;
}