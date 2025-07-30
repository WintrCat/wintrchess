import { Chess } from "chess.js";
import { minBy } from "lodash-es";

import { BoardPiece } from "../types/BoardPiece";
import { adaptPieceColour, flipPieceColour } from "@/constants/PieceColour";
import { setFenTurn } from "@/lib/utils/chess";
import { getAttackingMoves } from "./attackers";

export function getDefendingMoves(
    board: Chess,
    piece: BoardPiece,
    transitive: boolean = true
) {
    const defenderBoard = new Chess(board.fen());

    const attackingMoves = getAttackingMoves(defenderBoard, piece, false);

    // Where there are attackers, simulate taking the piece with each attacker
    // and record the minima of recaptures
    const smallestRecapturerSet = minBy(
        attackingMoves.map(attackingMove => {
            const captureBoard = new Chess(
                setFenTurn(
                    defenderBoard.fen(),
                    adaptPieceColour(flipPieceColour(piece.color))
                )
            );

            try {
                captureBoard.move(attackingMove);
            } catch {
                return;
            }

            return getAttackingMoves(
                captureBoard,
                {
                    type: attackingMove.piece,
                    color: attackingMove.color,
                    square: attackingMove.to
                },
                transitive
            );
        }).filter(recapturers => !!recapturers),
        recapturers => recapturers.length
    );

    // Where there are no attackers, flip the colour of the piece and count
    // the attackers of the flipped piece
    if (!smallestRecapturerSet) {
        const flippedPiece: BoardPiece = {
            type: piece.type,
            color: flipPieceColour(piece.color),
            square: piece.square
        };

        defenderBoard.put(flippedPiece, piece.square);
        
        return getAttackingMoves(defenderBoard, flippedPiece, transitive);
    }

    return smallestRecapturerSet;
}