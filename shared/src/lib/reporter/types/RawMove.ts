import { Square, PieceSymbol, Color, Move } from "chess.js";

export interface RawMove {
    piece: PieceSymbol;
    color: Color;
    from: Square;
    to: Square;
    promotion?: PieceSymbol;
}

export function toRawMove(move: Move): RawMove {
    return {
        piece: move.piece,
        color: move.color,
        from: move.from,
        to: move.to,
        promotion: move.promotion
    };
}