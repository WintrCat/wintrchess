import { Chess, Move, PAWN, KNIGHT, ROOK, KING } from "chess.js";
import { minBy } from "lodash-es";

import { BoardPiece, getBoardPieces } from "../types/BoardPiece";
import PieceColour from "@/constants/PieceColour";
import { pieceValues } from "@/constants/utils";
import { adaptPieceColour } from "@/constants/PieceColour";
import { toBoardPiece } from "../types/BoardPiece";
import { getAttackingMoves } from "./attackers";
import { getDefendingMoves } from "./defenders";

export function isPieceSafe(
    board: Chess,
    piece: BoardPiece,
    playedMove?: Move
) {
    const directAttackers = getAttackingMoves(board, piece, false)
        .map(toBoardPiece);

    const attackers = getAttackingMoves(board, piece).map(toBoardPiece);
    const defenders = getDefendingMoves(board, piece).map(toBoardPiece);

    // Favourable, decimal sacrifices (rook for 2 pieces etc.) are safe
    if (
        playedMove?.captured
        && piece.type == ROOK
        && pieceValues[playedMove.captured] == pieceValues[KNIGHT]
        && attackers.length == 1
        && defenders.length > 0
        && pieceValues[attackers[0].type] == pieceValues[KNIGHT]
    ) return true;

    // A piece with a direct attacker of lower value than itself isn't safe
    const hasLowerValueAttacker = directAttackers.some(attacker => (
        pieceValues[attacker.type] < pieceValues[piece.type]
    ));

    if (hasLowerValueAttacker) return false;

    // A piece that does not have more attackers than it has defenders is safe
    if (attackers.length <= defenders.length) {
        return true;
    }

    // A piece lower in value than any direct attacker, and with any
    // defender lower in value than all direct attackers, must be safe
    const lowestValueAttacker = minBy(directAttackers,
        attacker => pieceValues[attacker.type]
    );

    if (!lowestValueAttacker) return true;

    if (
        pieceValues[piece.type] < pieceValues[lowestValueAttacker.type]
        && defenders.some(defender => (
            pieceValues[defender.type] < pieceValues[lowestValueAttacker.type]
        ))
    ) return true;

    // A piece defended by any pawn, at this point, must be safe
    if (defenders.some(defender => defender.type == PAWN)) {
        return true;
    }

    return false;
}

export function getUnsafePieces(
    board: Chess,
    colour: PieceColour,
    playedMove?: Move
) {
    const capturedPieceValue = playedMove?.captured
        ? pieceValues[playedMove.captured] : 0;

    return getBoardPieces(board).filter(piece => (
        piece?.color == adaptPieceColour(colour)
        && piece.type != PAWN
        && piece.type != KING
        && pieceValues[piece.type] > capturedPieceValue
        && !isPieceSafe(board, piece, playedMove)
    ));
}