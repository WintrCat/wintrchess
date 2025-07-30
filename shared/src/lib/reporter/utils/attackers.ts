import { Chess, Square, PieceSymbol, KING } from "chess.js";
import { isEqual, xorWith } from "lodash-es";

import { BoardPiece } from "../types/BoardPiece";
import { RawMove, toRawMove } from "../types/RawMove";
import { adaptPieceColour, flipPieceColour } from "@/constants/PieceColour";
import { setFenTurn, getCaptureSquare } from "@/lib/utils/chess";

interface TransitiveAttacker {
    directFen: string;
    square: Square;
    type: PieceSymbol;
}

function directAttackingMoves(
    board: Chess,
    piece: BoardPiece
): RawMove[] {
    // Set turn to attacker's side (opposite of piece)
    const attackerBoard = new Chess(
        setFenTurn(
            board.fen(),
            adaptPieceColour(flipPieceColour(piece.color))
        )
    );

    const attackingMoves: RawMove[] = attackerBoard
        .moves({ verbose: true })
        .filter(move => getCaptureSquare(move) == piece.square)
        .map(toRawMove);

    const kingAttackerSquare = attackerBoard
        .attackers(piece.square)
        .find(attackerSquare => (
            attackerBoard.get(attackerSquare)?.type == KING
        ));

    if (
        kingAttackerSquare
        && !attackingMoves.some(attack => attack.piece == KING)
    ) {
        attackingMoves.push({
            piece: KING,
            color: flipPieceColour(piece.color),
            from: kingAttackerSquare,
            to: piece.square
        });
    }

    return attackingMoves;
}

export function getAttackingMoves(
    board: Chess,
    piece: BoardPiece,
    transitive: boolean = true
): RawMove[] {
    const attackingMoves = directAttackingMoves(board, piece);
    
    if (!transitive) return attackingMoves;

    // Keep a record of each transitive attacker and the FEN on
    // which they are considered a direct attacker
    const frontier: TransitiveAttacker[] = attackingMoves.map(
        attackingMove => ({
            directFen: board.fen(),
            square: attackingMove.from,
            type: attackingMove.piece
        })
    );

    while (frontier.length > 0) {
        const transitiveAttacker = frontier.pop();
        if (!transitiveAttacker) break;

        const transitiveBoard = new Chess(transitiveAttacker.directFen);

        // A king cannot be at the front of a battery
        if (transitiveAttacker.type == KING) {
            continue;
        }

        // Remove the piece at the front of the battery
        const oldAttackingMoves = directAttackingMoves(transitiveBoard, piece);

        transitiveBoard.remove(transitiveAttacker.square);

        // Find revealed attackers as a XOR between old (removed piece excluded)
        // and new direct attackers list
        const revealedAttackingMoves = xorWith(
            oldAttackingMoves.filter(
                attackingMove => attackingMove.from != transitiveAttacker.square
            ),
            directAttackingMoves(transitiveBoard, piece),
            isEqual
        );

        // Record revealed attackers in final list
        attackingMoves.push(...revealedAttackingMoves);

        // Queue revealed attackers for further recursion
        frontier.push(
            ...revealedAttackingMoves.map(attackingMove => ({
                directFen: transitiveBoard.fen(),
                square: attackingMove.from,
                type: attackingMove.piece
            }))
        );
    }

    return attackingMoves;
}